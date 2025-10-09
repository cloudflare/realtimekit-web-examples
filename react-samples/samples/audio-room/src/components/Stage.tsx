import { RtkAudioVisualizer, RtkAvatar } from '@cloudflare/realtimekit-react-ui';
import { useRealtimeKitMeeting, useRealtimeKitSelector } from '@cloudflare/realtimekit-react';
import clsx from 'clsx';

export default function Stage() {
  const { meeting } = useRealtimeKitMeeting();
  const activeParticipants = useRealtimeKitSelector((meeting) =>
    meeting.participants.active.toArray()
  );

  const joinedParticipants = useRealtimeKitSelector((meeting) =>
    meeting.participants.joined.toArray()
  );

  const participants = [
    ...activeParticipants,
    ...joinedParticipants.filter((p) => !activeParticipants.includes(p)),
    meeting.self,
  ];

  return (
    <main className="flex-1 relative flex flex-wrap content-center justify-center gap-4 p-6">
      {participants.map((participant) => {
        return (
          <div
            className={clsx(
              'relative min-w-[180px] flex flex-col items-center justify-center gap-2 bg-zinc-100 border-2 p-6 pb-2 rounded-xl break-all',
              participant.audioEnabled &&
                'border-blue-500 shadow-lg shadow-blue-100'
            )}
            key={participant.id}
          >
            <RtkAvatar participant={participant} size="sm" />
            <div className="flex items-center gap-0.5">
              <RtkAudioVisualizer
                participant={participant}
                size="md"
                className="absolute top-2 left-2"
              />
              <div>
                {participant.name}
                {participant.id === meeting.self.id ? ' (you)' : null}
              </div>
            </div>
          </div>
        );
      })}
    </main>
  );
}
