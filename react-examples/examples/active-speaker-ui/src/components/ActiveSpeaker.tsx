import { useMeetingStore } from '../lib/meeting-store';
import { useActiveSpeaker } from '../lib/useActiveSpeaker';
import { RtkAvatar, RtkParticipantTile } from '@cloudflare/realtimekit-react-ui';
import { useRealtimeKitMeeting } from '@cloudflare/realtimekit-react';
import { HTMLAttributes } from 'react';

export default function ActiveSpeaker(
  props: Omit<HTMLAttributes<HTMLRtkParticipantTileElement>, 'style'> & {
    isSmall?: true;
  }
) {
  const activeSpeaker = useActiveSpeaker();
  const { meeting } = useRealtimeKitMeeting();
  const [size, states] = useMeetingStore((s) => [s.size, s.states]);
  const isActiveMode = useMeetingStore((s) => s.isActiveSpeakerMode);

  if (!activeSpeaker || !isActiveMode) return null;

  return (
    <RtkParticipantTile
      participant={activeSpeaker}
      meeting={meeting}
      size={props.isSmall ? 'sm' : size}
      states={states}
      {...props}
    >
      <RtkAvatar participant={activeSpeaker} />
    </RtkParticipantTile>
  );
}
