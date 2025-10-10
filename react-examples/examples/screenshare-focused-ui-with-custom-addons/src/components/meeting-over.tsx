import { RtkEndedScreen } from '@cloudflare/realtimekit-react-ui';
import { UIConfig } from '@cloudflare/realtimekit-ui';
import RealtimeKitClient from '@cloudflare/realtimekit';
import { CustomStates, SetStates } from "../types";

function MeetingOver({
  meeting,
  config,
  states,
}: { meeting: RealtimeKitClient, config: UIConfig,  states: CustomStates, setStates: SetStates}) {
    return (
      <main className='flex w-full h-full justify-center items-center'>
        <RtkEndedScreen meeting={meeting} config={config} states={states} />
      </main>
    );
}

export default MeetingOver;