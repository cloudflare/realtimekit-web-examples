import { useEffect } from 'react';
import {
  RealtimeKitProvider,
  useRealtimeKitClient,
  useRealtimeKitMeeting,
} from '@cloudflare/realtimekit-react';
import { RtkDialogManager, RtkUiProvider } from '@cloudflare/realtimekit-react-ui';
import CustomRtkMeeting from './components/custom-rtk-meeting';
import { useStatesStore } from './store';

function Meeting() {
  const { meeting } = useRealtimeKitMeeting();

  useEffect(() => {
    if (meeting) {
      /**
       * NOTE(ravindra-dyte):
       * During development phase, make sure to expose meeting object to window,
       * for debugging purposes.
       */
      Object.assign(window, {
        meeting,
      });
    }
  }, [meeting]);

  return <CustomRtkMeeting />;
}

function App() {
  const [meeting, initMeeting] = useRealtimeKitClient();
  const setStates = useStatesStore((s) => s.setStates);

  useEffect(() => {
    async function initalizeMeeting() {
      const searchParams = new URL(window.location.href).searchParams;

      const authToken = searchParams.get('authToken');

      if (!authToken) {
        alert(
          "An authToken wasn't passed, please pass an authToken in the URL query to join a meeting.",
        );
        return;
      }

      initMeeting({
        authToken,
        defaults: {
          audio: false,
          video: false,
        },
      });
    }

    if (!meeting) {
      initalizeMeeting();
    }
  }, [meeting]);

  // By default this component will cover the entire viewport.
  // To avoid that and to make it fill a parent container, pass the prop:
  // `mode="fill"` to the component.
  return (
    <RealtimeKitProvider value={meeting}>
      <RtkUiProvider
        meeting={meeting}
        onRtkStatesUpdate={(e) => {
          setStates(e.detail);
        }}
        showSetupScreen
        style={{ height: '100%', width: '100%', display: 'block' }}
      >
        <Meeting />
        <RtkDialogManager />
      </RtkUiProvider>
    </RealtimeKitProvider>
  );
}

export default App;
