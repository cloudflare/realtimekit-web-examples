import InMeeting from './in-meeting';
import {
  RtkEndedScreen,
  RtkIdleScreen,
  RtkSetupScreen,
  RtkWaitingScreen,
} from '@cloudflare/realtimekit-react-ui';
import { States } from '@cloudflare/realtimekit-ui';
import { useContainerSize } from '../hooks/useContainerSize';

export interface CustomRtkMeetingProps {
  states: States;
  meetingIdentifier: string;
}

function CustomRtkMeeting({ states, meetingIdentifier }: CustomRtkMeetingProps) {
  const size = useContainerSize(meetingIdentifier);
  
  switch (states.meeting) {
    case 'idle':

      return <RtkIdleScreen />;
    case 'setup':

      return <RtkSetupScreen size={size} />;
    case 'waiting':

      return <RtkWaitingScreen />;
    case 'ended':

      return <RtkEndedScreen />;
    case 'joined':
    default:

      return <InMeeting states={states} meetingIdentifier={meetingIdentifier} />;
  }
}

export default CustomRtkMeeting;
