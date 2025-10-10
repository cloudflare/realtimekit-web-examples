import type RealtimeKitClient from '@cloudflare/realtimekit';
import { UIConfig }  from '@cloudflare/realtimekit-ui/dist/types/types/ui-config';
import { CustomStates, SetStates } from '../types';
import { RtkHeader, RtkStage, RtkGrid, RtkNotifications, RtkSidebar, RtkParticipantsAudio, RtkDialogManager, RtkControlbar, RtkControlbarButton } from '@cloudflare/realtimekit-react-ui';
import MeetingHeader from './meeting-header';
import MeetingControlBar from './meeting-control-bar';
import MeetingSideBar from './meeting-sidebar';
import CustomRtkGrid from './custom-rtk-grid';
import EffectsManager from './EffectsManager';
import { useState } from 'react';
import ReactionsManager from './ReactionsManager';
function InMeeting({
    meeting,
    config,
    states,
    setStates,
}: { meeting: RealtimeKitClient, config: UIConfig,  states: CustomStates, setStates: SetStates}) {
  
  const [effectsDialog, setEffectsDialog] = useState(false);
  const [reactionsDialog, setReactionsDialog] = useState(false);
  
  return (
    <div
      className="flex flex-col w-full h-full"
      ref={(el) => {
        el?.addEventListener('rtkStateUpdate', (e) => {
          const { detail: newStateUpdate } = e as unknown as { detail: CustomStates };
          console.log('rtkStateUpdateSetup:: ', newStateUpdate);
          setStates((oldState: CustomStates) => { return {
            ...oldState,
            ...newStateUpdate,
          }});
        });
      }}
    >
      <header>
        <MeetingHeader meeting={meeting} config={config} states={states} setStates={setStates}/>
      </header>
      <main className='flex w-full flex-1' style={{
        backgroundColor: '#272727',
        color: '#ffffff',
      }}>
        <RtkStage className='flex w-full flex-1 p-2'>
          <CustomRtkGrid meeting={meeting} config={config} states={states} setStates={setStates}/>
          <RtkNotifications meeting={meeting} config={config}  states={states}/>
          <MeetingSideBar meeting={meeting} config={config} states={states} setStates={setStates}/>
        </RtkStage>
        <RtkParticipantsAudio meeting={meeting}/>
        <RtkDialogManager meeting={meeting} config={config} states={states}/>
      </main>
      <footer className='flex w-full overflow-visible'>
        <MeetingControlBar meeting={meeting} config={config} states={states} setStates={setStates} setEffectsDialog={setEffectsDialog} setReactionsDialog={setReactionsDialog} />
      </footer>
      <EffectsManager
            meeting={meeting}
            isOpen={effectsDialog}
            onClose={() => setEffectsDialog(false)}
      />
      <ReactionsManager
        meeting={meeting}
        isOpen={reactionsDialog}
        onClose={() => setReactionsDialog(false)}
      />
    </div>
  );
}

export default InMeeting;