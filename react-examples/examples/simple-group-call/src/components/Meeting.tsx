import { useRealtimeKitMeeting, useRealtimeKitSelector } from '@cloudflare/realtimekit-react';
import {
  RtkAudioVisualizer,
  RtkParticipantTile,
  RtkNameTag,
  RtkAvatar,
  RtkMeetingTitle,
  RtkClock,
  RtkMicToggle,
  RtkCameraToggle,
  RtkParticipantCount,
  RtkParticipantsAudio,
  RtkSetupScreen,
  RtkLeaveButton,
  RtkEndedScreen,
} from '@cloudflare/realtimekit-react-ui';
import { useMemo, useRef } from 'react';
import { createGrid } from 'good-grid';
import { useGridDimensions } from 'good-grid/react';
import clsx from 'clsx';

function UI() {
  const $grid = useRef<HTMLElement>(null);
  const dimensions = useGridDimensions($grid);

  const { meeting } = useRealtimeKitMeeting();
  const self = useRealtimeKitSelector((meeting) => meeting.self);
  const activeParticipants = useRealtimeKitSelector((meeting) =>
    meeting.participants.active.toArray()
  );

  const pinnedParticipants = useRealtimeKitSelector((meeting) =>
    meeting.participants.pinned.toArray()
  );

  // show pinned participants first
  const participants = [
    ...pinnedParticipants,
    ...activeParticipants.filter((p) => !pinnedParticipants.includes(p)),
    self,
  ];

  const { width, height, getPosition } = useMemo(
    () =>
      createGrid({
        dimensions,
        count: participants.length,
        aspectRatio: '4:3',
        gap: 12,
      }),
    [participants]
  );

  return (
    <div className="w-full h-full flex flex-col">
      <RtkParticipantsAudio meeting={meeting} />
      <header className="h-12 flex items-center justify-between px-4 border-b">
        <div className="flex items-center gap-1 md:gap-2">
          <img
            src="https://docs.realtime.cloudflare.com/logo/cf.svg"
            className="h-6 md:h-7"
          />
          <div className="w-px h-7 mx-1 rotate-[18deg] bg-zinc-200"></div>
          <RtkMeetingTitle
            meeting={meeting}
            className="mx-0 font-medium text-xs md:text-sm font-sans"
          />
        </div>
        <div>
          <RtkParticipantCount
            meeting={meeting}
            className="text-xs md:text-sm"
          />
          <RtkClock meeting={meeting} className="text-xs md:text-sm" />
        </div>
      </header>
      <main
        className="flex-grow flex-shrink-0 relative flex flex-wrap content-center justify-center gap-4 p-4 overflow-clip"
        ref={$grid}
      >
        {participants.map((participant, index) => {
          const { top, left } = getPosition(index);

          return (
            <RtkParticipantTile
              participant={participant}
              meeting={meeting}
              key={participant.id}
              className={clsx(
                'absolute transition-all border bg-zinc-100',
                participant.audioEnabled
                  ? 'border-rtk-blue shadow-md shadow-rtk-blue/30'
                  : 'border-zinc-200'
              )}
              style={{
                width,
                height,
                top,
                left,
              }}
            >
              <RtkAvatar participant={participant} size="md" />
              <RtkNameTag participant={participant} meeting={meeting}>
                <RtkAudioVisualizer participant={participant} slot="start" />
              </RtkNameTag>
            </RtkParticipantTile>
          );
        })}
      </main>
      <footer className="py-2 flex items-center justify-center">
        <RtkMicToggle meeting={meeting} />
        <RtkCameraToggle meeting={meeting} />
        <RtkLeaveButton />
      </footer>
    </div>
  );
}

export default function Meeting() {
  const { meeting } = useRealtimeKitMeeting();

  const roomJoined = useRealtimeKitSelector((meeting) => meeting.self.roomJoined);
  const roomState = useRealtimeKitSelector((meeting) => meeting.self.roomState);

  if(roomState === 'ended' || roomState === 'left') {
    return <RtkEndedScreen meeting={meeting} />;
  }

  if (roomState === 'joined') {
    return <UI />;
  }

  return <RtkSetupScreen meeting={meeting} />;
  
}
