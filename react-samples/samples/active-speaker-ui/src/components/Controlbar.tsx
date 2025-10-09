import { useMeetingStore } from '../lib/meeting-store';
import {
  RtkSettingsToggle,
  RtkScreenShareToggle,
  RtkStageToggle,
  RtkMicToggle,
  RtkCameraToggle,
  RtkParticipantsToggle,
  RtkPollsToggle,
  RtkChatToggle,
  RtkPluginsToggle,
  RtkControlbarButton,
} from '@cloudflare/realtimekit-react-ui';
import { useRealtimeKitMeeting, useRealtimeKitSelector } from '@cloudflare/realtimekit-react';
import HOST_PRESET, { iconPack, saveWhiteboard, WHITEBOARD_ID } from '../lib/const';

export default function Controlbar() {
  const { meeting } = useRealtimeKitMeeting();
  const size = useMeetingStore((s) => s.size);
  const isMobile = useMeetingStore((s) => s.isMobile);
  const states = useMeetingStore((s) => s.states);
  const isDarkMode = useMeetingStore((s) => s.darkMode);
  const toggleDarkMode = useMeetingStore((s) => s.toggleDarkMode);
  const setStates = useMeetingStore((s) => s.setStates);
  const whiteboardPlugin = useRealtimeKitSelector(m => m.plugins.active.get(WHITEBOARD_ID)) 

  const buttonSize = size === 'lg' ? 'lg' : 'sm';

  const isHost = meeting.self.presetName === HOST_PRESET;

  const leaveMeeting = async () => {
    if (whiteboardPlugin?.active) {
      await saveWhiteboard(whiteboardPlugin);
    }
    setStates({
      activeLeaveConfirmation: true,
    })
  }

  const LeaveButton = () => {
    return (<RtkControlbarButton icon={iconPack.call_end} size={buttonSize} label='Leave' onClick={leaveMeeting}/>);
  }


  if (isMobile) {
    return (
      <>
        <div className="flex flex-col lg:flex-row items-center">
          {isHost && (
            <>
              <RtkParticipantsToggle
                meeting={meeting}
                size={buttonSize}
                states={states}
              />
              <RtkPluginsToggle
                meeting={meeting}
                size={buttonSize}
                states={states}
              />
            </>
          )}
          <RtkChatToggle meeting={meeting} size={buttonSize} states={states} />
          <RtkPollsToggle
            meeting={meeting}
            size={buttonSize}
            states={states}
          />
        </div>
        <div className="flex flex-col lg:flex-row items-center justify-center">
          <RtkMicToggle meeting={meeting} size={buttonSize} />
          <RtkCameraToggle meeting={meeting} size={buttonSize} />
          <RtkScreenShareToggle
            meeting={meeting}
            size={buttonSize}
            states={states}
          />
        </div>
        <div className="flex flex-col lg:flex-row items-center justify-end">
          <RtkStageToggle
            meeting={meeting}
            size={buttonSize}
            iconPack={iconPack}
          />
          <LeaveButton/>
          <RtkSettingsToggle size={buttonSize} states={states} />
        </div>
      </>
    );
  }

  return (
    <>
      <div className="flex flex-col lg:flex-row items-center">
        <RtkSettingsToggle size={buttonSize} states={states} />
        <RtkScreenShareToggle
          meeting={meeting}
          size={buttonSize}
          states={states}
        />
        {
          isHost 
          && <RtkControlbarButton
              icon={isDarkMode ? iconPack.dark : iconPack.light}
              label= {isDarkMode ? 'Dark' : 'Light'}
              title='Toggles theme for the active plugin for now'
              onClick={() => {
                toggleDarkMode(!isDarkMode);
              }}
            />
        }
      </div>
      <div className="flex flex-col lg:flex-row items-center justify-center">
        <RtkStageToggle
          meeting={meeting}
          size={buttonSize}
          iconPack={iconPack}
        />
        <RtkMicToggle meeting={meeting} size={buttonSize} />
        <RtkCameraToggle meeting={meeting} size={buttonSize} />
        <LeaveButton />
      </div>
      <div className="flex flex-col lg:flex-row items-center justify-end">
        {isHost && (
          <>
            <RtkParticipantsToggle
              meeting={meeting}
              size={buttonSize}
              states={states}
            />
            <RtkPluginsToggle
              meeting={meeting}
              size={buttonSize}
              states={states}
            />
          </>
        )}
        <RtkChatToggle meeting={meeting} size={buttonSize} states={states} />
        <RtkPollsToggle meeting={meeting} size={buttonSize} states={states} />
      </div>
    </>
  );
}
