import { RtkDialog, RtkIcon, defaultIconPack } from '@cloudflare/realtimekit-react-ui';
import { useState } from 'react';
import AudioPreview from './audio-preview';
import VideoPreview from './video-preview';
import { useCustomStatesStore } from '../store';
import { useRealtimeKitMeeting } from '@cloudflare/realtimekit-react';

function MediaPreviewModal({ open }: { open: boolean }) {
  const { meeting } = useRealtimeKitMeeting();
  const [activeTab, setActiveTab] = useState<'audio' | 'video'>('video');
  const setCustomStates = useCustomStatesStore((s) => s.setCustomStates);

  return (
    <RtkDialog
      open={open}
      onRtkDialogClose={() => {
        setCustomStates({ activeMediaPreviewModal: false });
      }}
    >
      <div className="flex min-w-[720px] min-h-[480px] bg-[#222222]">
        <aside className="flex flex-col w-1/3 bg-[#181818]">
          <header className="flex justify-center items-center h-[100px]">
            <h2>Media Preview</h2>
          </header>
          {meeting.self.permissions.canProduceAudio === 'ALLOWED' && (
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
          )}
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
          {activeTab === 'audio' && <AudioPreview />}
          {activeTab === 'video' && <VideoPreview />}
        </main>
      </div>
    </RtkDialog>
  );
}

export default MediaPreviewModal;
