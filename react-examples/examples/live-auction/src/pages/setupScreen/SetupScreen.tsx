import { useEffect, useState } from 'react'
import './setupScreen.css'
import { useRealtimeKitMeeting } from '@cloudflare/realtimekit-react';
import {
  RtkAudioVisualizer,
  RtkAvatar,
  RtkCameraToggle,
  RtkMicToggle,
  RtkNameTag,
  RtkParticipantTile,
} from '@cloudflare/realtimekit-react-ui';

const SetupScreen = () => {
  const { meeting } = useRealtimeKitMeeting();
  const [isHost, setIsHost] = useState<boolean>(false);
  const [name, setName] = useState<string>('');

  useEffect(() => {
    if (!meeting) return;
    const preset = meeting.self.presetName;
    const name = meeting.self.name;
    setName(name);

    if (preset.includes('host')) {
      setIsHost(true);
    }
  }, [meeting])

  const joinMeeting = () => {
    meeting?.self.setName(name);
    meeting.joinRoom();
  }

  return (
    <div className='setup-screen'>
      <div className="setup-media">
        <div className="video-container">
          <RtkParticipantTile meeting={meeting} participant={meeting.self}>
            <RtkAvatar size="md" participant={meeting.self}/>
            <RtkNameTag meeting={meeting} participant={meeting.self}>
              <RtkAudioVisualizer size='sm' slot="start" participant={meeting.self} />
            </RtkNameTag>
            <div className='setup-media-controls'>
              <RtkMicToggle size="sm" meeting={meeting}/>
              &ensp;
              <RtkCameraToggle size="sm" meeting={meeting}/>
            </div>
          </RtkParticipantTile>
        </div>
      </div>
      <div className="setup-information">
        <div className="setup-content">
          <h2>Welcome! {name}</h2>
          <p>{isHost ? 'You are joining as a Host' : 'You are joining as a bidder'}</p>
          <input disabled={!meeting.self.permissions.canEditDisplayName} className='setup-name' value={name} onChange={(e) => {
            setName(e.target.value)
          }} />
          <button className='setup-join' onClick={joinMeeting}>
            Join Meeting
          </button>
        </div>
      </div>
    </div>
  );
}

export default SetupScreen