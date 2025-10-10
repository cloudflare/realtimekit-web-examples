import { RtkClock, RtkGridPagination, RtkHeader, RtkLivestreamIndicator, RtkLogo, RtkMeetingTitle, RtkParticipantCount, RtkRecordingIndicator, RtkViewerCount } from '@cloudflare/realtimekit-react-ui';
import { UIConfig } from '@cloudflare/realtimekit-ui';
import RealtimeKitClient from '@cloudflare/realtimekit';
import { CustomStates, SetStates } from "../types";

function HeaderPreBuilt({
    meeting, states, config, setStates,
}: { meeting: RealtimeKitClient, config: UIConfig, states: CustomStates, setStates: SetStates }
){
    return <RtkHeader meeting={meeting} config={config} className='flex justify-between'/>;
}

function HeaderWithCustomUI({
    meeting, states, config,
}: { meeting: RealtimeKitClient, config: UIConfig, states: CustomStates, setStates: SetStates }
){
    
    return (
        <div className='flex justify-between bg-black text-white'>
            <div id="header-left" className="flex items-center h-[48px]">
                <RtkLogo meeting={meeting} />
                <RtkRecordingIndicator meeting={meeting}/>
                <RtkLivestreamIndicator meeting={meeting}/>
            </div>
            <div id="header-center" className="flex items-center h-[48px]">
                <RtkMeetingTitle meeting={meeting}/>
            </div>
            <div id="header-right" className="flex items-center h-[48px]">
                <RtkGridPagination meeting={meeting} states={states}/>
                <RtkParticipantCount meeting={meeting}/>
                <RtkViewerCount meeting={meeting} />
                <RtkClock meeting={meeting} />
            </div>
        </div>
    );
}

export default HeaderPreBuilt; // uncomment if you want the pre built RealtimeKit header
// export default HeaderWithCustomUI; // uncomment if yoi want custom UI