import { useEffect, useState } from 'react';
import {
  defaultIconPack,
  registerAddons,
  RtkMeeting,
} from '@cloudflare/realtimekit-react-ui';
import type { UIConfig } from '@cloudflare/realtimekit-react-ui';
import {
  RealtimeKitProvider,
  useRealtimeKitClient,
} from '@cloudflare/realtimekit-react';
import CustomControlbarButton from '@cloudflare/realtimekit-ui-addons/custom-controlbar-button';
import ManualSubscriptionsDialog from './components/ManualSubscriptionsDialog';

function App() {
  const [meeting, initMeeting] = useRealtimeKitClient();
  const [config, setConfig] = useState<UIConfig>();
  const [subscriptionsOpen, setSubscriptionsOpen] = useState(false);

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
      ...(baseURI ? { baseURI } : {}),
      modules: { devTools: { logs: logInConsole } },
    }).catch((cause: unknown) => {
      console.error('Unable to initialize the meeting', cause);
    });
  }, [initMeeting]);

  useEffect(() => {
    if (!meeting) return;

    const subscriptionsButton = new CustomControlbarButton({
      position: 'left',
      label: 'Subscriptions',
      icon: defaultIconPack.people_checked,
      onClick: () => setSubscriptionsOpen(true),
      attributes: { 'aria-haspopup': 'dialog' },
    });

    setConfig(registerAddons([subscriptionsButton], meeting));
  }, [meeting]);

  // By default this component will cover the entire viewport.
  // To avoid that and to make it fill a parent container, pass the prop:
  // `mode="fill"` to the component.
  // Mount before initialization so preset loading precedes the addon config update.
  return (
    <>
      <RtkMeeting
        meeting={meeting}
        {...(config ? { config } : {})}
        onRtkStatesUpdate={({ detail }) => {
          if (detail.meeting && detail.meeting !== 'joined') {
            setSubscriptionsOpen(false);
          }
        }}
      />
      <RealtimeKitProvider value={meeting}>
        <ManualSubscriptionsDialog
          open={subscriptionsOpen}
          onClose={() => setSubscriptionsOpen(false)}
        />
      </RealtimeKitProvider>
    </>
  );
}

export default App;
