import { useEffect } from 'react';
import { RtkMeeting } from '@cloudflare/realtimekit-react-ui';
import { useRealtimeKitClient } from '@cloudflare/realtimekit-react';
import { RealtimeKitNoiseCancellation } from '@cloudflare/realtimekit-noise-cancellation';

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
      modules: { devTools: { logs: logInConsole } },
    }).then((meeting) => {
      if (!meeting) return;
      Object.assign(window, { meeting });

      // Enables automatically when the mic is available, without delaying join.
      void RealtimeKitNoiseCancellation.init({ meeting }).catch(console.warn);
    });
  }, []);

  // By default this component will cover the entire viewport.
  // To avoid that and to make it fill a parent container, pass the prop:
  // `mode="fill"` to the component.
  return <RtkMeeting meeting={meeting!} />;
}

export default App;
