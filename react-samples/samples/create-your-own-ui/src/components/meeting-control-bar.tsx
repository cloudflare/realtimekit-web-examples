import {
  RtkBreakoutRoomsToggle,
  RtkCameraToggle,
  RtkChatToggle,
  RtkControlbar,
  RtkControlbarButton,
  RtkFullscreenToggle,
  RtkLeaveButton,
  RtkMicToggle,
  RtkMoreToggle,
  RtkMuteAllButton,
  RtkParticipantsToggle,
  RtkPipToggle,
  RtkPluginsToggle,
  RtkPoll,
  RtkPollsToggle,
  RtkRecordingToggle,
  RtkScreenShareToggle,
  RtkSettingsToggle,
  RtkStageToggle,
} from '@cloudflare/realtimekit-react-ui';
import { defaultIconPack } from '@cloudflare/realtimekit-ui';
import { useStatesStore } from '../store';

function ControlBarPreBuilt() {
  return (<RtkControlbar className="flex w-full overflow-visible	justify-between" />);
}

function ControlBarWithCustomUI() {
  const fullScreenTargetElement = document.querySelector(
    '#root',
  ) as HTMLElement;

  const states = useStatesStore((s) => s.states);

  return (
    <div className="flex w-full py-2 px-3 text-white justify-between">
      <div
        id="controlbar-left"
        className="flex items-center overflow-visible justify-center"
      >
        <RtkFullscreenToggle targetElement={fullScreenTargetElement} />
        <RtkSettingsToggle />
        <RtkScreenShareToggle />
      </div>
      <div
        id="controlbar-center"
        className="flex items-center overflow-visible justify-center"
      >
        <RtkMicToggle />
        <RtkCameraToggle />
        <RtkStageToggle />
        <RtkLeaveButton />
        <RtkMoreToggle>
          <div slot="more-elements">
            <RtkPipToggle variant="horizontal" />
            <RtkMuteAllButton variant="horizontal" />
            <RtkBreakoutRoomsToggle variant="horizontal" />
            <RtkRecordingToggle variant="horizontal" />
          </div>
        </RtkMoreToggle>
      </div>
      <div
        id="controlbar-right"
        className="flex items-center overflow-visible justify-center"
      >
        <RtkChatToggle />
        <RtkPollsToggle />
        <RtkParticipantsToggle />
        <RtkPluginsToggle />
        <RtkControlbarButton
          icon={defaultIconPack.add}
          label="Open Custom Sidebar"
          onClick={(e) => {
            console.log(states.activeSidebar);
            e.currentTarget.dispatchEvent(
              new CustomEvent('rtkStateUpdate', {
                detail: {
                  activeSidebar:
                    (states.sidebar as any) !== 'warnings'
                      ? true
                      : !states.activeSidebar,
                  sidebar: 'warnings',
                },
                bubbles: true,
                composed: true,
              }),
            );
          }}
        />
      </div>
    </div>
  );
}

// export default ControlBarPreBuilt; // uncomment if you are fine with prebuilt control bar
export default ControlBarWithCustomUI; // uncomment if you want to create a custom control bar
