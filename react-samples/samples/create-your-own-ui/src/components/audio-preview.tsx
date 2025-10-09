import { useEffect, useRef, useState } from 'react';
import {
  RtkAudioVisualizer,
  RtkButton,
  RtkIcon,
  RtkSettingsAudio,
  RtkSwitch,
  defaultIconPack,
} from '@cloudflare/realtimekit-react-ui';
import { useRealtimeKitMeeting } from '@cloudflare/realtimekit-react';
interface CurrentDevices {
  audio?: MediaDeviceInfo;
  speaker?: MediaDeviceInfo;
}

function AudioPreviewPreBuilt() {
  return <RtkSettingsAudio />;
}

function AudioPreviewWithCustomUI() {
  const { meeting } = useRealtimeKitMeeting();

  const [audioDevices, setAudioDevices] = useState<MediaDeviceInfo[]>([]);
  const [speakerDevices, setSpeakerDevices] = useState<MediaDeviceInfo[]>([]);
  const [currentDevices, setCurrentDevices] = useState<CurrentDevices>({});
  const testAudioEl = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (!meeting) {
      return;
    }
    const deviceListUpdateCallback = async () => {
      setAudioDevices(await meeting.self.getAudioDevices());
      setSpeakerDevices(await meeting.self.getSpeakerDevices());
    };
    meeting.self.addListener('deviceListUpdate', deviceListUpdateCallback);
    //populate first time values
    deviceListUpdateCallback();
    setCurrentDevices({
      audio: meeting.self.getCurrentDevices().audio,
      speaker: meeting.self.getCurrentDevices().speaker,
    });
    return () => {
      meeting.self.removeListener('deviceListUpdate', deviceListUpdateCallback);
    };
  }, [meeting]);
  const setDevice = (kind: 'audio' | 'speaker', deviceId: string) => {
    // if (disableSettingSinkId(this.meeting)) return;
    const device =
      kind === 'audio'
        ? audioDevices.find((d) => d.deviceId === deviceId)
        : speakerDevices.find((d) => d.deviceId === deviceId);
    setCurrentDevices((oldDevices) => {
      return {
        ...oldDevices,
        [kind]: device,
      };
    });
    if (device != null) {
      meeting.self.setDevice(device);
      if (device.kind === 'audiooutput') {
        if ((testAudioEl.current as any)?.setSinkId) {
          (testAudioEl.current as any)?.setSinkId(device.deviceId);
        }
      }
    }
  };
  let unnamedMicCount = 0;
  let unnamedSpeakerCount = 0;
  const testAudio = () => {
    testAudioEl?.current?.play();
  };
  return (
    <div className="flex flex-col p-4">
      <audio
        preload="auto"
        src="https://assets.dyte.io/ui-kit/speaker-test.mp3"
        ref={testAudioEl}
      />
      {meeting.self.permissions.canProduceAudio === 'ALLOWED' && (
        <div>
          <label>Microphone</label>
          <div>
            <select
              className="mt-2 w-full text-ellipsis bg-[#1F1F1F] p-2"
              onChange={(e) =>
                setDevice('audio', (e.target as HTMLSelectElement).value)
              }
            >
              {audioDevices.map(({ deviceId, label }) => (
                <option
                  key={deviceId}
                  value={deviceId}
                  selected={currentDevices.audio?.deviceId === deviceId}
                >
                  {label || `Microphone ${++unnamedMicCount}`}
                </option>
              ))}
            </select>
            <RtkAudioVisualizer participant={meeting?.self} />
          </div>
        </div>
      )}
      <div>
        {speakerDevices.length > 0 && (
          <div>
            <label>Speaker Output</label>
            <div>
              <select
                className="mt-2 w-full text-ellipsis bg-[#1F1F1F] p-2"
                onChange={(e) =>
                  setDevice('speaker', (e.target as HTMLSelectElement).value)
                }
              >
                {speakerDevices.map(({ deviceId, label }) => (
                  <option
                    key={deviceId}
                    value={deviceId}
                    selected={currentDevices.speaker?.deviceId === deviceId}
                  >
                    {label || `Speaker ${++unnamedSpeakerCount}`}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
        <RtkButton
          className="mt-2 bg-[#1F1F1F]"
          onClick={() => testAudio()}
          size="lg"
        >
          <RtkIcon icon={defaultIconPack.speaker} slot="start" />
          Test
        </RtkButton>
      </div>
    </div>
  );
}

// export default AudioPreviewPreBuilt; // uncomment if you want to use prebuilt audio preview
export default AudioPreviewWithCustomUI; // uncomment if you want custom ui for audio preview
