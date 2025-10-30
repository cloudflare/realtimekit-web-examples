import { RtkEndedScreen, RtkParticipantsAudio, RtkSetupScreen } from '@cloudflare/realtimekit-react-ui';
import { useRealtimeKitMeeting, useRealtimeKitSelector } from '@cloudflare/realtimekit-react';
import User from './User';
import Requests from './Requests';
import { useEffect, useState } from 'react';
import { Clipboard, Mic, MicOff, XSquare } from 'react-feather';
import { HandIcon } from './icons';
import clsx from 'clsx';

export default function Meeting() {
  const [showRequests, setShowRequests] = useState(true);

  const { meeting } = useRealtimeKitMeeting();
  const audioEnabled = useRealtimeKitSelector((m) => m.self.audioEnabled);
  const roomJoined = useRealtimeKitSelector((m) => m.self.roomJoined);
  const roomState = useRealtimeKitSelector((m) => m.self.roomState);

  const title = useRealtimeKitSelector((m) => m.meta.meetingTitle);

  const status = useRealtimeKitSelector((m) => m.stage.status);

  const onStageParticipants = useRealtimeKitSelector((m) =>
    m.participants.joined
      .toArray()
      .filter((p) => p.stageStatus=== 'ON_STAGE')
  );

  const listeners = useRealtimeKitSelector((m) =>
    m.participants.joined
      .toArray()
      .filter((p) => p.stageStatus !== 'ON_STAGE')
  );

  const isSelfListener = meeting.stage.status !== 'ON_STAGE';

  useEffect(() => {
    if (status === 'ACCEPTED_TO_JOIN_STAGE') {
      meeting.stage.join();
    }
  }, [status]);

  if (!roomJoined && window.location.search.includes('showSetupScreen')) {
    return <RtkSetupScreen meeting={meeting} size="sm" />;
  }

  if(roomState === 'left' || roomState === 'ended') {
    return <RtkEndedScreen/>;
  }

  return (
    <div className="flex flex-col w-full h-full">
      <RtkParticipantsAudio meeting={meeting} />
      <div className="flex-1 flex flex-col">
        <h1 className="text-lg font-bold p-4">{title}</h1>

        <main className="flex flex-col gap-4 flex-1 overflow-y-auto p-4">
          <div className="flex flex-wrap gap-4">
            {onStageParticipants.map((participant) => (
              <User participant={participant} key={participant.id} />
            ))}
            {!isSelfListener && <User participant={meeting.self} />}
          </div>

          {(isSelfListener || listeners.length > 0) && (
            <div className="mt-4">
              <h3 className="text-xs text-gray-500 font-medium">Listeners</h3>

              <div className="flex flex-wrap gap-4 mt-4">
                {isSelfListener && (
                  <User participant={meeting.self} size="sm" />
                )}

                {listeners.map((participant) => (
                  <User
                    participant={participant}
                    key={participant.id}
                    size="sm"
                  />
                ))}
              </div>
            </div>
          )}
        </main>

        <div className="border-t w-full flex items-center justify-between p-4 text-xs">
          <div className="flex items-center gap-2">
            <button
              className="icon-btn text-red-500 disabled:opacity-50"
              onClick={() => meeting.stage.leave()}
              disabled={status !== 'ON_STAGE'}
            >
              <XSquare />
              Leave Stage
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="icon-btn text-red-500"
              onClick={() => meeting.leave()}
            >
              <XSquare />
              Leave Meeting
            </button>
          </div>

          <div className="flex items-center gap-2">
            {meeting.self.permissions.acceptPresentRequests && (
              <button
                className="icon-btn"
                onClick={() => setShowRequests((r) => !r)}
              >
                <Clipboard className="" />
              </button>
            )}

            {(status === 'OFF_STAGE' ||
              status === 'REQUESTED_TO_JOIN_STAGE') && (
              <button
                className="icon-btn"
                onClick={() => {
                  if (status === 'REQUESTED_TO_JOIN_STAGE') {
                    meeting.stage.cancelRequestAccess();
                  } else {
                    meeting.stage.requestAccess();
                  }
                }}
              >
                <HandIcon
                  className={clsx(
                    status === 'REQUESTED_TO_JOIN_STAGE' && 'rotate-180'
                  )}
                />
                {status === 'REQUESTED_TO_JOIN_STAGE'
                  ? 'Lower hand'
                  : 'Raise hand'}
              </button>
            )}

            {status === 'ON_STAGE' && (
              <button
                className="icon-btn"
                onClick={() => {
                  if (meeting.self.audioEnabled) {
                    meeting.self.disableAudio();
                  } else {
                    meeting.self.enableAudio();
                  }
                }}
              >
                {audioEnabled ? <Mic /> : <MicOff />}
              </button>
            )}
          </div>
        </div>
      </div>
      {showRequests && <Requests />}
    </div>
  );
}
