import type RealtimeKitClient from '@cloudflare/realtimekit';
import { UIConfig }  from '@cloudflare/realtimekit-ui/dist/types/types/ui-config';
import { CustomStates, SetStates } from '../types';
import { RtkDialogManager, RtkSetupScreen } from '@cloudflare/realtimekit-react-ui';
import { RtkParticipantTile, RtkAvatar, RtkNameTag, RtkAudioVisualizer, RtkMicToggle, RtkCameraToggle, RtkSettingsToggle, RtkButton, RtkControlbarButton, defaultIconPack, } from '@cloudflare/realtimekit-react-ui';
import MediaPreviewModal from "./media-preview-modal";
import { useEffect, useState } from 'react';

export function SetupScreenPreBuilt({
    meeting,
    config,
    states,
    setStates,
}: { meeting: RealtimeKitClient, config: UIConfig,  states: CustomStates, setStates: SetStates}) {
    return (
        <main className='w-full h-full' style={{
            backgroundColor: '#272727',
            color: '#ffffff',
        }} ref={(el) => {
          el?.addEventListener('rtkStateUpdate', (e) => {
            const { detail: newStateUpdate } = e as unknown as { detail: CustomStates };
            console.log('rtkStateUpdateSetup:: ', newStateUpdate);
            setStates((oldState: CustomStates) => { return {
              ...oldState,
              ...newStateUpdate,
            }});
          });
        }}>
            <RtkSetupScreen meeting={meeting} config={config} states={states}/>
            <RtkDialogManager meeting={meeting} config={config} states={states}/>
        </main>
    );
}

export function CustomSetupScreenWithPrebuiltMediaPreviewModal({
  meeting,
  config,
  states,
  setStates,
}: { meeting: RealtimeKitClient, config: UIConfig,  states: CustomStates, setStates: SetStates}){
    const [participantName, setParticipantName] = useState('');

    useEffect(() => {
        if (!meeting) {
            return;
        }
        setParticipantName(meeting.self.name);
    }, [meeting]);

    return (
        <main ref={(el) => {
            el?.addEventListener('rtkStateUpdate', (e) => {
              const { detail: newStateUpdate } = e as unknown as { detail: CustomStates };
              console.log('rtkStateUpdateSetup:: ', newStateUpdate);
              setStates((oldState: CustomStates) => { return {
                ...oldState,
                ...newStateUpdate,
              }});
            });
          }}>
            <div key="on-setup-screen" className='flex justify-around w-full h-full p-[5%] bg-black text-white'>
                <div className='flex justify-around w-full h-full p-[5%]'>
                    <RtkParticipantTile meeting={meeting} participant={meeting.self} config={config}>
                        <RtkAvatar participant={meeting.self} />
                        <RtkNameTag participant={meeting.self}>
                            <RtkAudioVisualizer
                                participant={meeting.self}
                                slot="start"
                            />
                        </RtkNameTag>
                        <div id='user-actions' className='absolute flex bottom-2 right-2'>
                            <RtkMicToggle meeting={meeting} size='sm'></RtkMicToggle>
                            <RtkCameraToggle meeting={meeting} size='sm'></RtkCameraToggle>

                        </div>
                        <div className="absolute top-2 right-2">
                            <RtkSettingsToggle states={states} size='sm'></RtkSettingsToggle>
                        </div>
                    </RtkParticipantTile>
                    <div className='h-1/2 w-1/4 flex flex-col justify-between'>
                        <div className='flex flex-col items-center'>
                            <p>Joining as</p>
                            <div>{participantName}</div>
                        </div>
                        <input
                            hidden={!meeting.self.permissions.canEditDisplayName}
                            placeholder="Your name"
                            className='bg-[#141414] rounded-sm border-[#EEEEEE] focus:border-[#2160FD] p-2.5 mb-10'
                            autoFocus
                            value={participantName}
                            onChange={(event) => setParticipantName(event.target.value)}
                        />
                        <RtkButton
                            kind="wide"
                            size='lg'
                            style={{ cursor: participantName ? 'pointer' : 'not-allowed' }}
                            onClick={async () => {
                                if (participantName) {
                                    if (meeting.self.permissions.canEditDisplayName) {
                                        await meeting.self.setName(participantName);
                                    }
                                    await meeting.join();
                                }
                            }}>
                            Join
                        </RtkButton>
                    </div>
                </div >
            </div >
            <RtkDialogManager meeting={meeting} config={config} states={states}/>
        </main>
    );

}

export function CustomSetupScreenWithCustomMediaPreviewModal({
  meeting,
  config,
  states,
  setStates,
}: { meeting: RealtimeKitClient, config: UIConfig,  states: CustomStates, setStates: SetStates}){
    const [participantName, setParticipantName] = useState('');

    useEffect(() => {
        if (!meeting) {
            return;
        }
        setParticipantName(meeting.self.name);
    }, [meeting]);

    return (
        <div key="on-setup-screen" className='flex justify-around w-full h-full p-[5%] bg-black text-white'>
            <div className='flex justify-around w-full h-full p-[5%]'>
                <RtkParticipantTile meeting={meeting} participant={meeting.self}>
                    <RtkAvatar participant={meeting.self} />
                    <RtkNameTag participant={meeting.self}>
                        <RtkAudioVisualizer
                            participant={meeting.self}
                            slot="start"
                        />
                    </RtkNameTag>
                    <div id='user-actions' className='absolute flex bottom-2 right-2'>
                        <RtkMicToggle meeting={meeting} size='sm'></RtkMicToggle>
                        <RtkCameraToggle meeting={meeting} size='sm'></RtkCameraToggle>

                    </div>
                    <div className="absolute top-2 right-2">
                        <RtkControlbarButton
                            onClick={() => setStates( (oldState) => { return { ...oldState, activeMediaPreviewModal: true }})}
                            icon={defaultIconPack.settings}
                            label={'Media Preview'}
                        />
                    </div>
                </RtkParticipantTile>
                <div className='h-1/2 w-1/4 flex flex-col justify-between'>
                    <div className='flex flex-col items-center'>
                        <p>Joining as</p>
                        <div>{participantName}</div>
                    </div>
                    <input
                        hidden={!meeting.self.permissions.canEditDisplayName}
                        placeholder="Your name"
                        className='bg-[#141414] rounded-sm border-[#EEEEEE] focus:border-[#2160FD] p-2.5 mb-10'
                        autoFocus
                        value={participantName}
                        onChange={(event) => setParticipantName(event.target.value)}
                    />
                    <RtkButton
                        kind="wide"
                        size='lg'
                        style={{ cursor: participantName ? 'pointer' : 'not-allowed' }}
                        onClick={async () => {
                            if (participantName) {
                                if (meeting.self.permissions.canEditDisplayName) {
                                    await meeting.self.setName(participantName);
                                }
                                await meeting.join();
                            }
                        }}>
                        Join
                    </RtkButton>
                </div>
                <MediaPreviewModal open={!!states.activeMediaPreviewModal} states={states} config={config} setStates={setStates} meeting={meeting} />
            </div >
        </div >
    );

}

export default SetupScreenPreBuilt; // Uncomment, if you want prebuild setup screen
// export default CustomSetupScreenWithPrebuiltMediaPreviewModal; // Uncomment, if you want custom setup screen with prebuilt media preview
// export default CustomSetupScreenWithCustomMediaPreviewModal; // Uncomment, if you want custom setup screen with custom media preview