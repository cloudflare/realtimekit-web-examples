import { useEffect, useReducer } from 'react';
import {
  RealtimeKitProvider,
  useRealtimeKitClient,
  useRealtimeKitMeeting,
  useRealtimeKitSelector,
} from '@cloudflare/realtimekit-react';
import {
  RtkCameraToggle,
  RtkChatToggle,
  RtkDialogManager,
  RtkGrid,
  RtkLogo,
  RtkMeetingTitle,
  RtkMicToggle,
  RtkParticipantsAudio,
  RtkPollsToggle,
  RtkScreenShareToggle,
  RtkSetupScreen,
  RtkSidebar,
  RtkSpinner,
  RtkUiProvider,
  defaultConfig,
  provideRtkDesignSystem,
} from '@cloudflare/realtimekit-react-ui';

const config = { ...defaultConfig };

if (config.root) {
  config.root['rtk-participant-tile'] = (
    config.root['rtk-participant-tile'] as any
  ).children;
}

function Meeting() {
  const { meeting } = useRealtimeKitMeeting();
  const roomJoined = useRealtimeKitSelector((m) => m.self.roomJoined);

  const [states, updateStates] = useReducer(
    (state: any, payload: any) => ({
      ...state,
      ...payload,
    }),
    { meeting: 'joined', activeSidebar: false },
  );

  if (!meeting) {
    return <RtkSpinner />;
  }

  if (!roomJoined) {
    return <RtkSetupScreen meeting={meeting} />;
  }

  return (
    <div
      className="flex flex-col w-full h-full"
      ref={(el) => {
        el?.addEventListener('rtkStateUpdate', (e: any) => {
          updateStates(e.detail);
        });
      }}
    >
      <header className="flex items-center gap-3 h-12 border-b w-full px-2 text-sm">
        <RtkLogo meeting={meeting} />
        <RtkMeetingTitle meeting={meeting} />
      </header>
      <main className="flex flex-1 p-2">
        <RtkGrid meeting={meeting} config={config} />
        {states.activeSidebar && <RtkSidebar meeting={meeting} states={states} />}
      </main>
      <footer className="p-2 flex place-items-center justify-center">
        <RtkMicToggle meeting={meeting} />
        <RtkCameraToggle meeting={meeting} />
        <RtkScreenShareToggle meeting={meeting} />
        <RtkChatToggle meeting={meeting} />
        <RtkPollsToggle meeting={meeting} />
      </footer>
    </div>
  );
}

function App() {
  const [meeting, initMeeting] = useRealtimeKitClient();

  useEffect(() => {
    const searchParams = new URL(window.location.href).searchParams;

    const authToken = searchParams.get('authToken');

    if (!authToken) {
      alert(
        "An authToken wasn't passed, please pass an authToken in the URL query to join a meeting.",
      );
      return;
    }

    provideRtkDesignSystem(document.body, {
      theme: 'light',
    });

    initMeeting({
      authToken,
      defaults: {
        audio: false,
        video: false,
      },
    })
  }, []);

  // By default this component will cover the entire viewport.
  // To avoid that and to make it fill a parent container, pass the prop:
  // `mode="fill"` to the component.
  return (
    <RealtimeKitProvider value={meeting}>
      <RtkUiProvider meeting={meeting} showSetupScreen>
        <Meeting />
        <RtkDialogManager />
        <RtkParticipantsAudio />
      </RtkUiProvider>
    </RealtimeKitProvider>
  );
}

export default App;
