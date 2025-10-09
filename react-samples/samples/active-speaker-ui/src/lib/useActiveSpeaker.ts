import { useRealtimeKitMeeting, useRealtimeKitSelector } from '@cloudflare/realtimekit-react';

export function useActiveSpeaker() {
  const { meeting } = useRealtimeKitMeeting();
  const isPinned = useRealtimeKitSelector((m) => m.self.isPinned);

  const lastActiveSpeaker = useRealtimeKitSelector(
    (m) => m.participants.lastActiveSpeaker
  );

  const pinnedParticipants = useRealtimeKitSelector((m) =>
    m.participants.pinned.toArray()
  );

  const activeParticipants = useRealtimeKitSelector((m) =>
    m.participants.active.toArray()
  );

  if (isPinned) {
    return meeting.self;
  }

  if (pinnedParticipants.length > 0) {
    return pinnedParticipants.at(0);
  }

  if (meeting.self.id === lastActiveSpeaker) {
    return meeting.self;
  }

  return (
    meeting.participants.joined.get(lastActiveSpeaker) ??
    activeParticipants.at(0) ??
    meeting.self
  );
}
