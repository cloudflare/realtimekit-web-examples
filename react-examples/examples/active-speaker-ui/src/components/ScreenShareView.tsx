import { useMeetingStore } from '../lib/meeting-store';
import {
  RtkAudioVisualizer,
  RtkButton,
  RtkIcon,
  RtkNameTag,
  RtkScreenshareView,
} from '@cloudflare/realtimekit-react-ui';
import { useRealtimeKitMeeting } from '@cloudflare/realtimekit-react';
import type { RTKParticipant, RTKSelf } from '@cloudflare/realtimekit';
import { iconPack } from '../lib/const';

export default function ScreenShareView({
  participant,
}: {
  participant: RTKSelf | RTKParticipant;
}) {
  const { meeting } = useRealtimeKitMeeting();
  const [states, setStates] = useMeetingStore((s) => [s.states, s.setStates]);

  const onMaximise = async () => {
    setStates({ activeSidebar: false, sidebar: undefined });
  };

  const isSelf = meeting.self.id === participant.id;

  return (
    <RtkScreenshareView
      meeting={meeting}
      participant={participant}
      key={participant.id}
      className="flex-1 relative"
      // hidden default full screen button
      hideFullScreenButton
    >
      <RtkNameTag participant={participant} meeting={meeting} isScreenShare>
        <RtkAudioVisualizer
          participant={participant}
          isScreenShare
          slot="start"
        />
      </RtkNameTag>
      {/* custom full screen button that doesn't hide */}
      {states.activeSidebar && !isSelf && (
        <RtkButton
          variant="secondary"
          kind="icon"
          onClick={onMaximise}
          className="absolute bottom-3 right-3"
        >
          <RtkIcon icon={iconPack.full_screen_maximize} />
        </RtkButton>
      )}
    </RtkScreenshareView>
  );
}
