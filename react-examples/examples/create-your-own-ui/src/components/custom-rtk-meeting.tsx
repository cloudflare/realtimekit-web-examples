import InMeeting from './in-meeting';
import {
  RtkEndedScreen,
  RtkIdleScreen,
  RtkSetupScreen,
  RtkWaitingScreen,
} from '@cloudflare/realtimekit-react-ui';
import { useCustomStatesStore, useStatesStore } from '../store';
import SetupScreen from './setup-screen';

function CustomRtkMeeting() {
  const states = useStatesStore((s) => s.states);
  const customStates = useCustomStatesStore((s) => s.states);
  console.log(states, customStates);

  switch (states.meeting) {
    case 'idle':
      return <RtkIdleScreen />;
    case 'setup':
      return <SetupScreen />;
    case 'waiting':
      return <RtkWaitingScreen />;
    case 'ended':
      return <RtkEndedScreen />;
    case 'joined':
    default:
      return <InMeeting />;
  }
}

export default CustomRtkMeeting;
