import { useMeetingStore } from '../lib/meeting-store';
import {
  RtkGrid,
  RtkSimpleGrid,
  RtkSpotlightGrid,
} from '@cloudflare/realtimekit-react-ui';
import { useRealtimeKitMeeting, useRealtimeKitSelector } from '@cloudflare/realtimekit-react';

export default function Grid() {
  const { meeting } = useRealtimeKitMeeting();

  const size = useMeetingStore((s) => s.size);
  const stageStatus = useRealtimeKitSelector((m) => m.stage.status);
  const isPinned = useRealtimeKitSelector((m) => m.self.isPinned);

  const activeParticipants = useRealtimeKitSelector((m) =>
    m.participants.active.toArray()
  );

  const participants =
    stageStatus === 'ON_STAGE' && !isPinned
      ? [...activeParticipants, meeting.self]
      : activeParticipants;

  const pinned = useRealtimeKitSelector((m) => m.participants.pinned.toArray());

  const pinnedParticipants =
    isPinned && stageStatus === 'ON_STAGE' ? [...pinned, meeting.self] : pinned;

  if (pinnedParticipants.length > 0) {
    return (
      <RtkSpotlightGrid
        participants={participants}
        pinnedParticipants={pinnedParticipants}
        meeting={meeting}
        size={size}
      />
    );
  }

  return (<RtkSimpleGrid participants={participants} meeting={meeting} size={size} />);
}
