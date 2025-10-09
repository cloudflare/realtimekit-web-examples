import {
  defaultIconPack,
  RtkClock,
  RtkDialogManager,
  RtkIcon,
  RtkLeaveButton,
  RtkMicToggle,
  RtkParticipantCount,
  RtkParticipantsAudio,
  RtkRecordingIndicator,
  RtkTooltip,
} from '@cloudflare/realtimekit-react-ui';
import { useRealtimeKitMeeting, useRealtimeKitSelector } from '@cloudflare/realtimekit-react';
import { useEffect } from 'react';
import Stage from './Stage';

export default function Room() {
  const { meeting } = useRealtimeKitMeeting();
  const audioEnabled = useRealtimeKitSelector((meeting) => meeting.self.audioEnabled);

  useEffect(() => {
    function onKeyPress(e: KeyboardEvent) {
      if (e.ctrlKey && e.key.toLowerCase() === 'd') {
        if (meeting.self.audioEnabled) {
          meeting.self.disableAudio();
        } else {
          meeting.self.enableAudio();
        }
      }
    }

    window.addEventListener('keypress', onKeyPress);

    return () => {
      window.removeEventListener('keypress', onKeyPress);
    };
  }, []);

  return (
    <div className="h-full w-full flex flex-col">
      <header className="flex items-center justify-between px-6 h-16">
        <h1 className="text-xl flex items-center gap-2">
          <RtkIcon icon={defaultIconPack.mic_on} className="h-6" />
          <span>{meeting.meta.meetingTitle}</span>
        </h1>

        <div>
          <RtkParticipantCount meeting={meeting} />
          <RtkClock meeting={meeting} />
          <RtkRecordingIndicator meeting={meeting} />
        </div>
      </header>
      <Stage />
      <footer className="flex items-center px-6 py-4 justify-center gap-1">
        <RtkLeaveButton>
          <RtkIcon icon={defaultIconPack.call_end} className="h-7 w-7" />
        </RtkLeaveButton>

        <RtkTooltip label="Ctrl+D to toggle mic">
          <RtkMicToggle meeting={meeting}>
            <RtkIcon
              icon={
                audioEnabled ? defaultIconPack.mic_on : defaultIconPack.mic_off
              }
              className="h-7 w-7"
            />
          </RtkMicToggle>
        </RtkTooltip>
      </footer>
      <RtkDialogManager meeting={meeting} />
      <RtkParticipantsAudio meeting={meeting} />
    </div>
  );
}
