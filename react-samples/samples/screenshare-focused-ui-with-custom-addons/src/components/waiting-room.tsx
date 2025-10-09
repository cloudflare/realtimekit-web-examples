import { RtkWaitingScreen } from '@cloudflare/realtimekit-react-ui';
import { UIConfig } from '@cloudflare/realtimekit-ui';
import RealtimeKitClient from '@cloudflare/realtimekit';
import { CustomStates, SetStates } from "../types";

function WaitingRoom({
    meeting,
    config,
}: { meeting: RealtimeKitClient, config: UIConfig,  states: CustomStates, setStates: SetStates}) {
    return (
        <main className='flex w-full h-full justify-center items-center' style={{
            backgroundColor: '#272727',
            color: '#ffffff',
      }}>
            <RtkWaitingScreen meeting={meeting} config={config}/>
        </main>
    );
}

export default WaitingRoom;