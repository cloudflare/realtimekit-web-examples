import { useRealtimeKitMeeting, useRealtimeKitSelector } from '@cloudflare/realtimekit-react';
import { RtkButton, provideRtkDesignSystem } from '@cloudflare/realtimekit-react-ui';
import { useEffect } from 'react';
import Room from './Room';

export default function AudioRoom() {
  const { meeting } = useRealtimeKitMeeting();
  const roomJoined = useRealtimeKitSelector((meeting) => meeting.self.roomJoined);

  useEffect(() => {
    meeting.self.on('roomLeft', () => {
      // handle navigation to other screen here after user has left the room.
      alert("You've left the room");
    });

    provideRtkDesignSystem(document.body, {
      theme: 'light',
    });
  }, []);

  if (!roomJoined) {
    // Show a page before joining the room, which allows you to join
    // the meeting

    return (
      <div className="w-full h-full flex flex-col items-center justify-center space-y-6">
        <h1 className="text-3xl font-bold">{meeting.meta.meetingTitle}</h1>
        <h2 className="text-2xl">You will be joining as {meeting.self.name}</h2>
        <p>By default you will join with your mic disabled.</p>
        <RtkButton
          size="lg"
          onClick={() => meeting.joinRoom()}
          kind="wide"
          className="max-w-sm"
        >
          Join audio room
        </RtkButton>
      </div>
    );
  }

  return <Room />;
}
