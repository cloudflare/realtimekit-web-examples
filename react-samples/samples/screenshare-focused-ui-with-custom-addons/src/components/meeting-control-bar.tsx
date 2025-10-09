import { RtkBreakoutRoomsToggle, RtkCameraToggle, RtkChatToggle, RtkControlbar, RtkControlbarButton, RtkFullscreenToggle, RtkLeaveButton, RtkMicToggle, RtkMoreToggle, RtkMuteAllButton, RtkParticipantsToggle, RtkPipToggle, RtkPluginsToggle, RtkPoll, RtkPollsToggle, RtkRecordingToggle, RtkScreenShareToggle, RtkSettingsToggle, RtkStageToggle } from '@cloudflare/realtimekit-react-ui';
import { UIConfig, defaultIconPack } from '@cloudflare/realtimekit-ui';
import RealtimeKitClient from '@cloudflare/realtimekit';
import { CustomStates, SetStates } from "../types";
import { useEffect, useState } from "react";

function ControlBarPreBuilt({
    meeting, states, config,
}: { meeting: RealtimeKitClient, config: UIConfig, states: CustomStates, setStates: SetStates }
){
    return <RtkControlbar meeting={meeting} config={config}  states={states} className='flex w-full overflow-visible	justify-between'/>;
}

function ControlBarWithCustomUI({
    meeting, states, config, setStates, setEffectsDialog, setReactionsDialog,
}: { meeting: RealtimeKitClient, config: UIConfig, states: CustomStates, setStates: SetStates, setEffectsDialog: (openEffectsDialog: boolean) => void, setReactionsDialog:  (openReactionsDialog: boolean) => void}
){

    const fullScreenTargetElement = document.querySelector('#root') as HTMLElement;

    const [handRaised, setHandRaised] = useState(false);

    useEffect(() => {
        if(!meeting){
            return;
        }
        meeting.participants.joined.addListener('participantJoined', () => {
            setTimeout(() => {
                // Hack - Re broadcast the message when a new participant joins
                meeting.participants.broadcastMessage(handRaised? "raised-hand" : "lowered-hand", {
                    peerId: meeting.self.id,
                });
            }, 1000);
        });
    }, [meeting]);

    return (
        <div className="flex w-full bg-black text-white justify-between">
            <div id="controlbar-left" className="flex items-center overflow-visible justify-center">
                <RtkFullscreenToggle states={states} targetElement={fullScreenTargetElement}/>
                <RtkSettingsToggle states={states} />
                <RtkScreenShareToggle states={states} meeting={meeting} />
            </div>
            <div id="controlbar-center" className="flex items-center overflow-visible justify-center">
                <RtkMicToggle meeting={meeting} />
                <RtkCameraToggle meeting={meeting} />
                <RtkStageToggle meeting={meeting} />
                <RtkLeaveButton/>
                <RtkMoreToggle states={states}>
                    <div slot="more-elements">
                        <RtkPipToggle meeting={meeting} states={states} config={config} variant="horizontal" />
                        <RtkMuteAllButton meeting={meeting} variant="horizontal"/>
                        <RtkBreakoutRoomsToggle meeting={meeting} states={states} variant="horizontal"/>
                        <RtkRecordingToggle meeting={meeting} variant="horizontal"/>
                    </div>
                </RtkMoreToggle>
            </div>
            <div id="controlbar-right" className="flex items-center overflow-visible justify-center">
                <RtkChatToggle meeting={meeting} states={states}/>
                <RtkPollsToggle meeting={meeting} states={states}/>
                <RtkParticipantsToggle meeting={meeting} states={states}/>
                <RtkPluginsToggle meeting={meeting} states={states} />
                <RtkControlbarButton
                    onClick={() => {
                        if(states.activeSidebar && !states.sidebar && states.customSidebar === 'warnings'){
                            setStates( (oldState) => { return { ...oldState, activeSidebar: false, sidebar: null, customSidebar: null }});    
                        } else {
                            setStates( (oldState) => { return { ...oldState, activeSidebar: true, sidebar: null, customSidebar: 'warnings' }});
                        }
                    }}
                    icon={defaultIconPack.add}
                    label={'Open Custom SideBar'}
                />
                <RtkControlbarButton
                    onClick={() => setEffectsDialog(true)}
                    icon={defaultIconPack.ai_sparkle}
                    label={'Effects'}
                />
                <RtkControlbarButton
                    onClick={async () => {
                        setHandRaised(!handRaised);
                        await meeting.participants.broadcastMessage(handRaised? "lowered-hand" : "raised-hand", {
                            peerId: meeting.self.id,
                        });
                    }}
                    icon='<svg fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M4 12.02c0 1.06.2 2.1.6 3.08l.6 1.42c.22.55.64 1.01 1.17 1.29.27.14.56.21.86.21h2.55c.77 0 1.49-.41 1.87-1.08.5-.87 1.02-1.7 1.72-2.43l1.32-1.39c.44-.46.97-.84 1.49-1.23l.59-.45a.6.6 0 0 0 .23-.47c0-.75-.54-1.57-1.22-1.79a3.34 3.34 0 0 0-2.78.29V4.5a1.5 1.5 0 0 0-2.05-1.4 1.5 1.5 0 0 0-2.9 0A1.5 1.5 0 0 0 6 4.5v.09A1.5 1.5 0 0 0 4 6v6.02ZM8 4.5v4a.5.5 0 0 0 1 0v-5a.5.5 0 0 1 1 0v5a.5.5 0 0 0 1 0v-4a.5.5 0 0 1 1 0v6a.5.5 0 0 0 .85.37h.01c.22-.22.44-.44.72-.58.7-.35 2.22-.57 2.4.5l-.53.4c-.52.4-1.04.78-1.48 1.24l-1.33 1.38c-.75.79-1.31 1.7-1.85 2.63-.21.36-.6.58-1.01.58H7.23a.87.87 0 0 1-.4-.1 1.55 1.55 0 0 1-.71-.78l-.59-1.42a7.09 7.09 0 0 1-.53-2.7V6a.5.5 0 0 1 1 0v3.5a.5.5 0 0 0 1 0v-5a.5.5 0 0 1 1 0Z" fill="currentColor"></path></svg>'
                    label={handRaised? 'Lower hand': 'Raise Hand'}
                />
                <RtkControlbarButton
                    onClick={() => setReactionsDialog(true)}
                    icon='<svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 122.88 122.88"><defs><style>.cls-1{fill:#fbd433;}.cls-1,.cls-2{fill-rule:evenodd;}.cls-2{fill:#141518;}</style></defs><title>smiley</title><path class="cls-1" d="M45.54,2.11A61.42,61.42,0,1,1,2.11,77.34,61.42,61.42,0,0,1,45.54,2.11Z"/><path class="cls-2" d="M45.78,32.27c4.3,0,7.79,5,7.79,11.27s-3.49,11.27-7.79,11.27S38,49.77,38,43.54s3.48-11.27,7.78-11.27Z"/><path class="cls-2" d="M77.1,32.27c4.3,0,7.78,5,7.78,11.27S81.4,54.81,77.1,54.81s-7.79-5-7.79-11.27S72.8,32.27,77.1,32.27Z"/><path d="M28.8,70.82a39.65,39.65,0,0,0,8.83,8.41,42.72,42.72,0,0,0,25,7.53,40.44,40.44,0,0,0,24.12-8.12,35.75,35.75,0,0,0,7.49-7.87.22.22,0,0,1,.31,0L97,73.14a.21.21,0,0,1,0,.29A45.87,45.87,0,0,1,82.89,88.58,37.67,37.67,0,0,1,62.83,95a39,39,0,0,1-20.68-5.55A50.52,50.52,0,0,1,25.9,73.57a.23.23,0,0,1,0-.28l2.52-2.5a.22.22,0,0,1,.32,0l0,0Z"/></svg>'
                    label={'Reactions'}
                />
            </div>
        </div>
    );
}

// export default ControlBarPreBuilt; // uncomment if you are fine with prebuilt control bar
export default ControlBarWithCustomUI; // uncomment if you want to create a custom control bar