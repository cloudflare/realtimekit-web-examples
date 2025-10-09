import { RtkChat, RtkParticipants, RtkPlugins, RtkPolls, RtkSidebar, RtkSidebarUi } from '@cloudflare/realtimekit-react-ui';
import { UIConfig } from '@cloudflare/realtimekit-ui';
import RealtimeKitClient from '@cloudflare/realtimekit';
import { CustomSideBarTabs, CustomStates, SetStates } from "../types";
import { useEffect, useState } from "react";
import { RtkSidebarView } from '@cloudflare/realtimekit-ui/dist/types/components/rtk-sidebar-ui/rtk-sidebar-ui';
import { RtkSidebarSection } from '@cloudflare/realtimekit-ui/dist/types/components/rtk-sidebar/rtk-sidebar';

function SidebarPreBuilt({
    meeting, states, config, setStates,
}: { meeting: RealtimeKitClient, config: UIConfig, states: CustomStates, setStates: SetStates }
){
    if(!states.activeSidebar){
        return null;
    }
    return <RtkSidebar meeting={meeting} config={config} states={states}/>;
}

function SidebarWithCustomUI({
    meeting, states, config, setStates,
}: { meeting: RealtimeKitClient, config: UIConfig, states: CustomStates, setStates: SetStates }
){
    const [tabs, setTabs] = useState([
        { id: 'chat', name: 'chat' },
        { id: 'polls', name: 'polls' },
        { id: 'participants', name: 'participants' },
        { id: 'plugins', name: 'plugins' },
        { id: 'warnings', name: 'warnings' }
    ]);
    const [view, setView] = useState<RtkSidebarView>('sidebar');

    if(!states.activeSidebar || (!states.sidebar && !states.customSidebar)){
        return null;
    }

    const currentTab = states.sidebar || states.customSidebar;

    return (
        <RtkSidebarUi
            tabs={tabs}
            currentTab={currentTab}
            view={view}
            onTabChange={(e) => {
                setStates((oldState) => {
                    return {
                        ...oldState,
                        activeSidebar: true,
                        customSidebar: e.detail,
                        sidebar: e.detail,
                    }
                });
            }}
            className="w-80 "
            onSidebarClose={() => {
                setStates((oldState) => {
                    return {
                        ...oldState,
                        activeSidebar: false,
                        sidebar: null,
                        customSidebar: null,
                    }
                });
            }}>
            {currentTab === 'chat' && <RtkChat meeting={meeting} config={config} slot="chat" /> }
            {currentTab === 'polls' && <RtkPolls meeting={meeting} config={config} slot="polls" /> }
            {currentTab === 'participants' && <RtkParticipants meeting={meeting} config={config} states={states} slot="participants" /> }
            {currentTab === 'plugins' && <RtkPlugins meeting={meeting} config={config} slot="plugins" /> }
            {currentTab === 'warnings' && <div slot="warnings" className="flex justify-center items-center">
                <div>Do not cheat in the exam</div>
            </div> }
        </RtkSidebarUi>
    );

}

// export default SidebarPreBuilt; // Uncomment if you want prebuilt sidebar
export default SidebarWithCustomUI; // Uncomment if you want custom sidebar
