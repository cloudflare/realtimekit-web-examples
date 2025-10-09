import { useEffect, useState } from 'react';
import {
  RealtimeKitProvider,
  useRealtimeKitClient,
  useRealtimeKitMeeting,
} from '@cloudflare/realtimekit-react';
import './global.css';
import {
  defaultConfig,
  generateConfig,
} from '@cloudflare/realtimekit-react-ui';
import { RtkStateListenersUtils } from './rtk-state-listeners';
import { CustomStates } from './types';
import { setFullScreenToggleTargetElement } from './utils';
import CustomRtkMeeting from './components/custom-rtk-meeting';

function Meeting() {
  const { meeting } = useRealtimeKitMeeting();
  const [config, setConfig] = useState(defaultConfig);
  const [states, setStates] = useState<CustomStates>({
    meeting: 'setup',
    sidebar: 'chat'
  });

  useEffect(() => {
    async function setupMeetingConfigs(){
      const theme = meeting!.self.config;
      const { config } = generateConfig(theme, meeting!);

      /**
       * NOTE(ravindra-dyte):
       * Full screen by default requests rtk-meeting/RtkMeeting element to be in full screen.
       * Since RtkMeeting element is not here,
       *  we need to pass rtk-fullscreen-toggle, an targetElementId through config.
       */
      setFullScreenToggleTargetElement({config, targetElementId: 'root'});

      setConfig({...config});

    /**
     * NOTE(ravindra-dyte):
     * Add listeners on meeting & self to monitor leave meeting, join meeting and so on.
     * This work was earlier done by RtkMeeting component internally.
     */
      const stateListenersUtils = new RtkStateListenersUtils(() => meeting, () => states, () => setStates);
      stateListenersUtils.addRtkEventListeners();
    }

    if(meeting){
    /**
     * NOTE(ravindra-dyte):
     * During development phase, make sure to expose meeting object to window,
     * for debugging purposes.
     */
      Object.assign(window, {
        meeting,
      })
      setupMeetingConfigs();
    }

  }, [meeting]);

  return <CustomRtkMeeting meeting={meeting} config={config} states={states} setStates={setStates} />
  
}

function App() {
  const [meeting, initMeeting] = useRealtimeKitClient();

  useEffect(() => {
    async function initalizeMeeting(){
      const searchParams = new URL(window.location.href).searchParams;

      const authToken = searchParams.get('authToken');
  
      if (!authToken) {
        alert(
          "An authToken wasn't passed, please pass an authToken in the URL query to join a meeting.",
        );
        return;
      }
  
      const meeting = await initMeeting({
        authToken,
        defaults: {
          audio: false,
          video: false,
        },
        modules: {devTools: {logs: true}}
      });

      // await meeting!.joinRoom();

    }

    if(!meeting){
      initalizeMeeting();
    }
  }, [meeting]);

  // By default this component will cover the entire viewport.
  // To avoid that and to make it fill a parent container, pass the prop:
  // `mode="fill"` to the component.
  return (
    <RealtimeKitProvider value={meeting}>
      <Meeting/>
    </RealtimeKitProvider>
  );
}

export default App;
