import {
  RtkDialogManager,
  RtkParticipantTile,
  RtkRecordingToggle,
  RtkSettingsToggle,
  RtkSpinner,
  RtkUiProvider,
  States,
  provideRtkDesignSystem,
} from '@cloudflare/realtimekit-react-ui';
import {
  RealtimeKitProvider,
  useRealtimeKitClient,
  useRealtimeKitMeeting,
  useRealtimeKitSelector,
} from '@cloudflare/realtimekit-react';
import { Dispatch, useEffect, useReducer, useState } from 'react';
import { getBrightness, getElapsedDuration } from './utils';
import Duration from './components/Duration';
import { useStatesStore } from './store';

function LoadingUI() {
  return (
    <div className="w-full h-full flex flex-col gap-4 place-items-center justify-center">
      <RtkSpinner className="w-14 h-14 text-blue-500" />
      <p className="text-xl font-semibold">Starting RealtimeKit Video Survey</p>
    </div>
  );
}

function useBrightnessAndSilenceDetector(
  dispatchError: Dispatch<Parameters<typeof errorReducer>[1]>,
) {
  const { meeting } = useRealtimeKitMeeting();
  const videoEnabled = useRealtimeKitSelector((m) => m.self.videoEnabled);
  const audioEnabled = useRealtimeKitSelector((m) => m.self.audioEnabled);

  useEffect(() => {
    const { audioTrack } = meeting.self;
    if (!audioTrack || !audioEnabled) return;

    const stream = new MediaStream();
    stream.addTrack(audioTrack);
    const audioContext = new AudioContext();
    audioContext.resume();
    const analyserNode = audioContext.createAnalyser();
    analyserNode.fftSize = 2048;
    const micSource = audioContext.createMediaStreamSource(stream);
    micSource.connect(analyserNode);
    const bufferLength = 2048;
    const dataArray = new Float32Array(bufferLength);
    const silenceThreshold = 0.05;
    const segmentLength = 1024;

    function getRMS(
      dataArray: Float32Array,
      startIndex: number,
      endIndex: number,
    ) {
      let sum = 0;
      for (let i = startIndex; i < endIndex; i++) {
        sum += dataArray[i] * dataArray[i];
      }
      const mean = sum / (endIndex - startIndex);
      const rms = Math.sqrt(mean);
      return rms;
    }

    function detectSilence() {
      analyserNode.getFloatTimeDomainData(dataArray);
      const numSegments = Math.floor(bufferLength / segmentLength);
      for (let i = 0; i < numSegments; i++) {
        const startIndex = i * segmentLength;
        const endIndex = (i + 1) * segmentLength;
        const rms = getRMS(dataArray, startIndex, endIndex);
        if (rms > silenceThreshold) {
          // Detected non-silence in this segment
          return false;
        }
      }
      // Detected silence
      return true;
    }

    const interval = setInterval(() => {
      const isSilent = detectSilence();

      if (isSilent) {
        dispatchError({ type: 'add', error: 'not_loud' });
      } else {
        dispatchError({ type: 'remove', error: 'not_loud' });
      }
    }, 1000);

    return () => {
      clearInterval(interval);
      dispatchError({ type: 'remove', error: 'not_loud' });
    };
  }, [audioEnabled]);

  useEffect(() => {
    if (!videoEnabled) return;

    const { videoTrack } = meeting.self;
    if (!videoTrack) return;
    const videoStream = new MediaStream();
    videoStream.addTrack(videoTrack);
    const video = document.createElement('video');
    video.style.width = '240px';
    video.style.height = '180px';
    video.muted = true;
    video.srcObject = videoStream;
    video.play();
    const canvas = document.createElement('canvas');
    canvas.width = 240;
    canvas.height = 180;
    const ctx = canvas.getContext('2d', { willReadFrequently: true })!;

    const interval = setInterval(() => {
      const brightness = getBrightness(video, canvas, ctx);
      if (brightness < 0.4) {
        dispatchError({ type: 'add', error: 'not_bright' });
      } else {
        dispatchError({ type: 'remove', error: 'not_bright' });
      }
    }, 1000);

    return () => {
      clearInterval(interval);
      dispatchError({ type: 'remove', error: 'not_bright' });
    };
  }, [videoEnabled]);

  return null;
}

type MyError = 'not_bright' | 'not_loud';
type State = 'ok' | MyError;

function errorReducer(
  state: MyError[],
  action: { type: 'add' | 'remove'; error: MyError },
) {
  switch (action.type) {
    case 'add':
      if (!state.includes(action.error)) {
        return [...state, action.error];
      }
      break;
    case 'remove':
      return state.filter((e) => e !== action.error);
  }
  return state;
}

const messages = {
  ok: 'Ensure your head and shoulders are in shot. Hit record when you are ready.',
  not_bright:
    'You seem to be in a dark room, please try turning on the lights.',
  not_loud: 'Your voice is not loud enough. Please speak loud and clearly.',
};

function Recorder({states}: {states: States;}) {
  const { meeting } = useRealtimeKitMeeting();

  const [timestamp, setTimestamp] = useState<Date>();
  const [recordingDisabled, setRecordingDisabled] = useState(false);
  

  const [duration, setDuration] = useState(0);
  const [errors, dispatchError] = useReducer(errorReducer, []);

  useBrightnessAndSilenceDetector(dispatchError);

  useEffect(() => {
    // calculate duration from recording timestamp
    if (timestamp) {
      const interval = setInterval(() => {
        const duration = getElapsedDuration(timestamp);
        setDuration(duration);
      }, 500);
      return () => {
        clearInterval(interval);
      };
    }
  }, [timestamp]);

  useEffect(() => {
    const onRecordingUpdate = (state: string) => {
      switch (state) {
        case 'RECORDING':
          setTimestamp(new Date());
          break;
        case 'STOPPING':
          setTimestamp(undefined);
          break;
      }
    };

    meeting.recording.addListener('recordingUpdate', onRecordingUpdate);
    return () => {
      meeting.recording.removeListener('recordingUpdate', onRecordingUpdate);
    };
  }, []);

  useEffect(() => {
    // stop recording when you reach max duration of 60 seconds
    if (duration >= 60) {
      meeting.recording.stop();
      setRecordingDisabled(false);
    }
  }, [duration]);

  if (states.meeting != 'joined') {
    return <LoadingUI />;
  }

  return (
    <div className="w-full h-full flex place-items-center justify-center p-4 flex-col">
      <div className="max-w-4xl pb-8">
        <h3 className="text-xl font-bold mb-4">
          Have you worked with any of the following technologies: JavaScript
          Core, Web Assembly, Protobufs?{' '}
        </h3>
        <div className="mb-2">
          List out the ones you have experience in and pick 1 to elaborate. If
          you haven't worked with any of these technologies, pick 2-3 skills
          mentioned in the job description to describe instead. Here are some
          tips to help you record a great video:
        </div>
        <li>Please provide as much detail as you can</li>
        <li>Use your webcam or mobile camera to record your video response</li>
        <li>Make sure you have plenty of light so we can clearly see you</li>
        <li>
          Avoid places with lots of background noise so we can clearly hear you
        </li>
      </div>
      <div className="flex flex-col w-full max-w-lg border rounded-xl overflow-clip">
        <div className="relative">
          <RtkParticipantTile
            participant={meeting.self}
            meeting={meeting}
            className="w-full h-auto rounded-none aspect-[3/2] bg-zinc-300"
            style={{ background: '#000' }}
          />
          <p className="text-white bg-purple-950 p-3 text-xs text-center">
            {/* Show okay message, or last error message */}
            {errors.length === 0
              ? messages['ok']
              : messages[errors[errors.length - 1]! as State]}
          </p>
          {/* Show placement container only when recording hasn't started */}
          {!timestamp && (
            <div className="absolute w-44 z-50 left-1/2 -translate-x-1/2 top-1/2 -translate-y-28 aspect-square border-2 border-dashed border-pink-50 rounded-lg" />
          )}
        </div>
        {/* Duration indicator */}
        <Duration duration={duration} />

        <div className="flex items-center justify-center p-2">
          <RtkRecordingToggle
            meeting={meeting}
            disabled={(timestamp && duration <= 15) || recordingDisabled}
          />
          <RtkSettingsToggle/>
        </div>
      </div>
      <RtkDialogManager />
    </div>
  );
}

export default function App() {
  const [meeting, initMeeting] = useRealtimeKitClient();
  const states = useStatesStore((s) => s.states);
  const setStates = useStatesStore((s) => s.setStates);
  

  useEffect(() => {
    provideRtkDesignSystem(document.body, {
      theme: 'light',
    });

    const searchParams = new URLSearchParams(window.location.search);
    const authToken = searchParams.get('authToken');

    if (!authToken) {
      alert(
        "An authToken wasn't passed, please pass an authToken in the URL query to join a meeting.",
      );
      return;
    }

    initMeeting({
      authToken,
      // NOTE: remove defaults
      // defaults: {
      //   audio: false,
      //   video: false,
      // },
    }).then((meeting) => {
      Object.assign(window, { meeting });
      // automatically join room
      // meeting?.joinRoom();
    });
  }, []);

  return (
    <RealtimeKitProvider value={meeting} fallback={<LoadingUI />}>
      <RtkUiProvider meeting={meeting} onRtkStatesUpdate={(e) => {
        setStates(e.detail);
      }}>
        <Recorder states={states} />
      </RtkUiProvider>
    </RealtimeKitProvider>
  );
}
