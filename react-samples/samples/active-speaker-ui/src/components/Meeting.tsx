import { useMeetingStore } from '../lib/meeting-store';
import Controlbar from './Controlbar';
import MainArea from './MainArea';
import Sidebar from './Sidebar';
import {
  RtkDialogManager,
  RtkEndedScreen,
  RtkNotifications,
  RtkParticipantsAudio,
  RtkSetupScreen,
  RtkSpinner,
  RtkWaitingScreen,
} from '@cloudflare/realtimekit-react-ui';
import { useRealtimeKitMeeting, useRealtimeKitSelector } from '@cloudflare/realtimekit-react';
import { type States } from '@cloudflare/realtimekit-ui';
import { useEffect, useRef } from 'react';

function UI() {
  const { meeting } = useRealtimeKitMeeting();

  const isImmersiveMode = useMeetingStore((s) => s.isImmersiveMode);

  return (
    <div className="w-full h-full flex lg:flex-col">
      <div className="flex flex-1 h-full">
        <main className="flex-[2] relative">
          <MainArea />
          <RtkParticipantsAudio meeting={meeting} />
          <RtkNotifications
            meeting={meeting}
            config={{
              config: {
                notification_sounds: {
                  participant_joined: false,
                  participant_left: false,
                  chat: false,
                },
                notifications: {
                  participant_joined: false,
                  participant_left: false,
                  chat: false,
                },
              },
            }}
          />
        </main>

        {!isImmersiveMode && <Sidebar />}
      </div>
      <div className="grid p-2 pl-0 lg:pl-2 grid-rows-3 lg:grid-rows-1 lg:grid-cols-3 lg:pt-0">
        <Controlbar />
      </div>
    </div>
  );
}

export default function Meeting() {
  const $parent = useRef<HTMLDivElement>(null);
  const roomState = useRealtimeKitSelector((m) => m.self.roomState);
  const { meeting } = useRealtimeKitMeeting();

  const setDimensions = useMeetingStore((s) => s.setDimensions);
  const size = useMeetingStore((s) => s.size);

  const setStates = useMeetingStore((s) => s.setStates);
  const states = useMeetingStore((s) => s.states);

  useEffect(() => {
    const onStateUpdate = (e: CustomEvent<States>) => {
      setStates(e.detail);
    };

    $parent.current!.addEventListener('rtkStateUpdate', onStateUpdate as any);

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setDimensions({ width, height });
      }
    });
    observer.observe($parent.current!);
    return () => {
      observer.disconnect();
      $parent.current!.removeEventListener(
        'rtkStateUpdate',
        onStateUpdate as any
      );
    };
  }, []);

  let children: JSX.Element;

  switch (roomState) {
    case 'init':
      children = <RtkSetupScreen meeting={meeting} />;
      break;
    case 'waitlisted':
      children = <RtkWaitingScreen meeting={meeting} />;
      break;
    case 'joined':
      children = <UI />;
      break;
    default:
      children = <RtkEndedScreen meeting={meeting} />;
      break;
  }

  return (
    <div className="w-full h-full bg-black" ref={$parent} data-size={size}>
      {children}
      <RtkDialogManager
        size={size === 'lg' ? 'lg' : 'sm'}
        meeting={meeting}
        states={states}
      />
    </div>
  );
}
