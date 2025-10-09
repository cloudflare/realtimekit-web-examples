import {
  RtkStage,
  RtkGrid,
  RtkNotifications,
  RtkParticipantsAudio,
  RtkSidebar,
  RtkControlbar,
  RtkHeader,
} from '@cloudflare/realtimekit-react-ui';
import type { CustomRtkMeetingProps } from './custom-rtk-meeting';
import { useContainerSize } from '../hooks/useContainerSize';

function InMeeting({ states, meetingIdentifier }: CustomRtkMeetingProps) {
  const size = useContainerSize(meetingIdentifier);
  return (
    <div className="flex flex-col w-full h-full overflow-hidden">
      <header className="flex-shrink-0 w-full">
        <RtkHeader size={size} style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 'var(--rtk-space-2, 8px)',
          '--header-section-gap': 'var(--rtk-space-2, 8px)',
        }}/>
      </header>
      <main className="flex-1 w-full overflow-hidden relative">
        <RtkStage className="w-full h-full p-2 overflow-hidden relative">
          <RtkGrid size={size} />
          <RtkNotifications size={size} />
          { states.activeSidebar && <RtkSidebar size={size}/>}
        </RtkStage>
        <RtkParticipantsAudio />
      </main>
      <footer className="flex-shrink-0 w-full">
        <RtkControlbar size={size} style={{display: 'flex', justifyContent: 'space-between'}} />
      </footer>
    </div>
  );
}

export default InMeeting;
