import { RtkDialog, RtkIcon, defaultIconPack } from '@cloudflare/realtimekit-react-ui';
import { useState } from "react";
import RealtimeKitClient from '@cloudflare/realtimekit';
import { UIConfig } from '@cloudflare/realtimekit-ui';
import AudioPreview from "./audio-preview";
import VideoPreview from "./video-preview";
import { CustomStates, SetStates } from "../types";

function MediaPreviewModal({
    open, states, setStates, meeting, config,
}: { open: boolean, config: UIConfig, states: CustomStates, setStates: SetStates, meeting: RealtimeKitClient }) {
    const [activeTab, setActiveTab] = useState<'audio' | 'video'>('video');
    return (
        <RtkDialog
            open={open}
            onRtkDialogClose={() => setStates((oldState: CustomStates) => { return {
                ...oldState,
                activeMediaPreviewModal: false
            }})}
        >
            <div className="flex min-w-[720px] min-h-[480px] bg-[#222222]">
                <aside className="flex flex-col w-1/3 bg-[#181818]">
                    <header className="flex justify-center items-center h-[100px]">
                        <h2>Media Preview</h2>
                    </header>
                    {meeting.self.permissions.canProduceAudio === 'ALLOWED' &&
                        <button
                            type="button"
                            className={`${activeTab === 'audio' ? 'bg-[#2160FD]' : ''} flex justify-between p-2 rounded`}
                            onClick={() => setActiveTab('audio')}
                        >
                            Audio
                            <div>
                                <RtkIcon icon={defaultIconPack.mic_on} />
                            </div>
                        </button>
                    }
                    {meeting.self.permissions.canProduceVideo === 'ALLOWED' && (
                        <button
                            type="button"
                            className={`${activeTab === 'video' ? 'bg-[#2160FD]' : ''} flex justify-between p-2 rounded`}
                            onClick={() => setActiveTab('video')}
                        >
                            Video
                            <div>
                                <RtkIcon icon={defaultIconPack.video_on} />
                            </div>
                        </button>
                    )}
                </aside>
                <main className="flex flex-col w-2/3">
                    {activeTab === 'audio' && <AudioPreview meeting={meeting} config={config} states={states} setStates={setStates} />}
                    {activeTab === 'video' && <VideoPreview meeting={meeting} config={config} states={states} setStates={setStates} />}
                </main>
            </div>
        </RtkDialog>
    );
}

export default MediaPreviewModal;