import Meeting from './components/Meeting';
import { RtkSpinner, RtkUiProvider } from '@cloudflare/realtimekit-react-ui';
import { RealtimeKitProvider, useRealtimeKitClient } from '@cloudflare/realtimekit-react';
import { useEffect } from 'react';

function App() {
  const [meeting, initMeeting] = useRealtimeKitClient();

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);

    const authToken = searchParams.get('authToken');

    if (!authToken) {
      alert(
        "An authToken wasn't passed, please pass an authToken in the URL query to join a meeting."
      );
      return;
    }

    initMeeting({
      authToken,
      defaults: {
        audio: false,
        video: false,
      },
    }).then((meeting) => {
      Object.assign(window, { meeting });
    });
  }, []);

  // By default this component will cover the entire viewport.
  // To avoid that and to make it fill a parent container, pass the prop:
  // `mode="fill"` to the component.
  return (
    <RealtimeKitProvider
      value={meeting}
      fallback={
        <div className="size-full flex flex-col gap-3 place-items-center justify-center">
          <RtkSpinner className="w-12 h-12 text-blue-600" />
          <p className="text-lg">Joining...</p>
        </div>
      }
    >
      <RtkUiProvider meeting={meeting} showSetupScreen>
        <Meeting />
      </RtkUiProvider>
    </RealtimeKitProvider>
  );
}

export default App;
