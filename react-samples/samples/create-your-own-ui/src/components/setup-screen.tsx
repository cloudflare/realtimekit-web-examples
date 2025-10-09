import type RealtimeKitClient from '@cloudflare/realtimekit';
import { UIConfig } from '@cloudflare/realtimekit-ui/dist/types/types/ui-config';
import { CustomStates, SetStates } from '../types';
import { RtkDialogManager, RtkSetupScreen } from '@cloudflare/realtimekit-react-ui';
import {
  RtkParticipantTile,
  RtkAvatar,
  RtkNameTag,
  RtkAudioVisualizer,
  RtkMicToggle,
  RtkCameraToggle,
  RtkSettingsToggle,
  RtkButton,
  RtkControlbarButton,
  defaultIconPack,
} from '@cloudflare/realtimekit-react-ui';
import MediaPreviewModal from './media-preview-modal';
import { useEffect, useState } from 'react';
import { useRealtimeKitMeeting } from '@cloudflare/realtimekit-react';
import { useCustomStatesStore } from '../store';

export function SetupScreenPreBuilt() {
  return (
    <main
      className="w-full h-full"
      style={{
        backgroundColor: '#272727',
        color: '#ffffff',
      }}
    >
      <RtkSetupScreen />
    </main>
  );
}

export function CustomSetupScreenWithPrebuiltMediaPreviewModal() {
  const { meeting } = useRealtimeKitMeeting();
  const [participantName, setParticipantName] = useState('');

  useEffect(() => {
    if (!meeting) {
      return;
    }
    setParticipantName(meeting.self.name);
  }, [meeting]);

  return (
    <main>
      <div
        key="on-setup-screen"
        className="flex justify-around w-full h-full p-[5%] bg-black text-white"
      >
        <div className="flex justify-around w-full h-full p-[5%]">
          <RtkParticipantTile participant={meeting.self}>
            <RtkAvatar participant={meeting.self} />
            <RtkNameTag participant={meeting.self}>
              <RtkAudioVisualizer participant={meeting.self} slot="start" />
            </RtkNameTag>
            <div id="user-actions" className="absolute flex bottom-2 right-2">
              <RtkMicToggle size="sm"></RtkMicToggle>
              <RtkCameraToggle size="sm"></RtkCameraToggle>
            </div>
            <div className="absolute top-2 right-2">
              <RtkSettingsToggle size="sm"></RtkSettingsToggle>
            </div>
          </RtkParticipantTile>
          <div className="h-1/2 w-1/4 flex flex-col justify-between">
            <div className="flex flex-col items-center">
              <p>Joining as</p>
              <div>{participantName}</div>
            </div>
            <input
              hidden={!meeting.self.permissions.canEditDisplayName}
              placeholder="Your name"
              className="bg-[#141414] rounded-sm border-[#EEEEEE] focus:border-[#2160FD] p-2.5 mb-10"
              autoFocus
              value={participantName}
              onChange={(event) => setParticipantName(event.target.value)}
            />
            <RtkButton
              kind="wide"
              size="lg"
              style={{ cursor: participantName ? 'pointer' : 'not-allowed' }}
              onClick={async () => {
                if (participantName) {
                  if (meeting.self.permissions.canEditDisplayName) {
                    meeting.self.setName(participantName);
                  }
                  await meeting.join();
                }
              }}
            >
              Join
            </RtkButton>
          </div>
        </div>
      </div>
    </main>
  );
}

export function CustomSetupScreenWithCustomMediaPreviewModal() {
  const { meeting } = useRealtimeKitMeeting();
  const customStates = useCustomStatesStore((s) => s.states);
  const setCustomStates = useCustomStatesStore((s) => s.setCustomStates);
  const [participantName, setParticipantName] = useState('');

  useEffect(() => {
    if (!meeting) {
      return;
    }
    setParticipantName(meeting.self.name);
  }, [meeting]);

  return (
    <div
      key="on-setup-screen"
      className="flex justify-around w-full h-full p-[5%] bg-black text-white"
    >
      <div className="flex justify-around w-full h-full p-[5%]">
        <RtkParticipantTile participant={meeting.self}>
          <RtkAvatar participant={meeting.self} />
          <RtkNameTag participant={meeting.self}>
            <RtkAudioVisualizer participant={meeting.self} slot="start" />
          </RtkNameTag>
          <div id="user-actions" className="absolute flex bottom-2 right-2">
            <RtkMicToggle size="sm" />
            <RtkCameraToggle size="sm" />
          </div>
          <div className="absolute top-2 right-2">
            <RtkControlbarButton
              onClick={() => {
                setCustomStates({
                  activeMediaPreviewModal: true,
                });
              }}
              icon={defaultIconPack.settings}
              label={'Media Preview'}
            />
          </div>
        </RtkParticipantTile>
        <div className="h-1/2 w-1/4 flex flex-col justify-between">
          <div className="flex flex-col items-center">
            <p>Joining as</p>
            <div>{participantName}</div>
          </div>
          <input
            hidden={!meeting.self.permissions.canEditDisplayName}
            placeholder="Your name"
            className="bg-[#141414] rounded-sm border-[#EEEEEE] focus:border-[#2160FD] p-2.5 mb-10"
            autoFocus
            value={participantName}
            onChange={(event) => setParticipantName(event.target.value)}
          />
          <RtkButton
            kind="wide"
            size="lg"
            style={{ cursor: participantName ? 'pointer' : 'not-allowed' }}
            onClick={async () => {
              if (participantName) {
                if (meeting.self.permissions.canEditDisplayName) {
                  meeting.self.setName(participantName);
                }
                await meeting.join();
              }
            }}
          >
            Join
          </RtkButton>
        </div>
        <MediaPreviewModal open={!!customStates.activeMediaPreviewModal} />
      </div>
    </div>
  );
}

// export default SetupScreenPreBuilt; // Uncomment, if you want prebuild setup screen
// export default CustomSetupScreenWithPrebuiltMediaPreviewModal; // Uncomment, if you want custom setup screen with prebuilt media preview
export default CustomSetupScreenWithCustomMediaPreviewModal; // Uncomment, if you want custom setup screen with custom media preview
