import { useEffect } from 'react';
import { RealtimeKitProvider, useRealtimeKitClient } from '@cloudflare/realtimekit-react';
import AudioRoom from './components/AudioRoom';
import { RtkUiProvider } from '@cloudflare/realtimekit-react-ui';

function App() {
  const [meeting, initMeeting] = useRealtimeKitClient();

  useEffect(() => {
    const searchParams = new URL(window.location.href).searchParams;

    const authToken = searchParams.get('authToken');

    if (!authToken) {
      alert(
        "An authToken wasn't passed, please pass an authToken in the URL query to join a meeting."
      );
      return;
    }

    const baseURI = searchParams.get('baseURI') || import.meta.env.VITE_BASE_URL;
    const logInConsole = searchParams.get('logInConsole') === 'true';

    initMeeting({
      authToken,
      baseURI,
      defaults: {
        audio: false,
        video: false,
      },
      modules: { devTools: { logs: logInConsole } },
    });
  }, []);

  // By default this component will cover the entire viewport.
  // To avoid that and to make it fill a parent container, pass the prop:
  // `mode="fill"` to the component.
  return (
    <RealtimeKitProvider value={meeting} fallback={<></>}>
      <RtkUiProvider meeting={meeting} showSetupScreen>
        <AudioRoom />
      </RtkUiProvider>
    </RealtimeKitProvider>
  );
}

export default App;
