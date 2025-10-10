/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from 'react';
import { RealtimeKitProvider, useRealtimeKitClient, useRealtimeKitSelector } from '@cloudflare/realtimekit-react';
import { provideRtkDesignSystem, RtkEndedScreen, RtkLeaveMeeting, RtkUiProvider } from '@cloudflare/realtimekit-react-ui';
import { LoadingScreen } from './pages';
import { Meeting, SetupScreen } from './pages';
import './App.css';

function App() {
  const meetingEl = useRef<HTMLDivElement>(null);
  const [meeting, initMeeting] = useRealtimeKitClient();
  const [roomJoined, setRoomJoined] = useState<boolean>(false);
  const [roomLeft, setRoomLeft] = useState<boolean>(false);

  useEffect(() => {
    const searchParams = new URL(window.location.href).searchParams;
    const authToken = searchParams.get('authToken');

    if (!authToken) {
      alert(
        "An authToken wasn't passed, please pass an authToken in the URL query to join a meeting."
      );
      return;
    }

    initMeeting({
      authToken,
      defaults: {
        audio: false,
        video: false,
      },
    });
  }, []);

  useEffect(() => {
    if (!meetingEl.current) return;
    provideRtkDesignSystem(meetingEl.current, {
      googleFont: 'Poppins',
      theme: 'light',
      colors: {
        danger: '#ffb31c',
        brand: {
          300: '#c6a6ff',
          400: '#9e77e0',
          500: '#754cba',
          600: '#4e288f',
          700: '#2e0773',
        },
        text: '#071428',
        'text-on-brand': '#ffffff',
        'video-bg': '#E5E7EB',
      },
      borderRadius: 'rounded',
    });
  }, []);

  useEffect(() => {
    if (!meeting) return;

    const roomJoinedListener = () => {
      setRoomJoined(true);
    };
    const roomLeftListener = () => {
      setRoomLeft(true);
    };
    meeting.self.on('roomJoined', roomJoinedListener);
    meeting.self.on('roomLeft', roomLeftListener);

    return () => {
      meeting.self.removeListener('roomJoined', roomJoinedListener);
      meeting.self.removeListener('roomLeft', roomLeftListener);
    }

  }, [meeting])

  return (
    <div ref={meetingEl} >
      <RealtimeKitProvider value={meeting} fallback={<LoadingScreen />}>
        <RtkUiProvider meeting={meeting} showSetupScreen>
          {
            !roomJoined ? <SetupScreen /> : !roomLeft ? <Meeting /> : <RtkEndedScreen />
          }
        </RtkUiProvider>
      </RealtimeKitProvider>
    </div>
  );
}

export default App
