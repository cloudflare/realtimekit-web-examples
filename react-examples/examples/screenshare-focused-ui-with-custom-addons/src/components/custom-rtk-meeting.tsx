import { UIConfig } from '@cloudflare/realtimekit-ui'
import RealtimeKitClient from '@cloudflare/realtimekit'
import { CustomStates, SetStates } from "../types"
import InMeeting from "./in-meeting"
import MeetingLoading from "./meeting-loading"
import MeetingOver from "./meeting-over"
import SetupScreen from "./setup-screen"
import WaitingRoom from "./waiting-room"

function CustomRtkMeeting({
  meeting,
  config,
  states,
  setStates,
}: { meeting: RealtimeKitClient, config: UIConfig,  states: CustomStates, setStates: SetStates}){
  if (!meeting) {
    <MeetingLoading />
  }
  
  if (states.meeting === 'setup') {
    return <SetupScreen meeting={meeting} config={config} states={states} setStates={setStates} />
  }
  
  if(states.meeting === 'ended'){
    return <MeetingOver meeting={meeting} config={config} states={states} setStates={setStates} />
  }
  
  if(states.meeting === 'waiting'){
    return <WaitingRoom meeting={meeting} config={config} states={states} setStates={setStates} />
  }
  
  if(states.meeting === 'joined'){
    return <InMeeting meeting={meeting} config={config} states={states} setStates={setStates} />
  }

  return null;
  
}

export default CustomRtkMeeting;