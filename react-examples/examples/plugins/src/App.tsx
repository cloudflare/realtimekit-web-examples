import { useEffect, useRef } from 'react';
import { RtkMeeting } from '@cloudflare/realtimekit-react-ui';
import { useRealtimeKitClient } from '@cloudflare/realtimekit-react';

const WHITEBOARD_URL = 'https://whiteboard-collabkit.cf-realtime.workers.dev';
const WHITEBOARD_ICON =
  'https://whiteboard-collabkit.cf-realtime.workers.dev/logo.png';

function createWhiteboardIframe(): HTMLIFrameElement {
  const iframe = document.createElement('iframe');
  iframe.style.width = '100%';
  iframe.style.height = '100%';
  iframe.style.border = 'none';
  iframe.allow = 'camera; microphone';
  return iframe;
}

function App() {
  const [meeting, initMeeting] = useRealtimeKitClient();
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  if (!iframeRef.current) {
    iframeRef.current = createWhiteboardIframe();
  }

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
      baseURI: import.meta.env.VITE_BASE_URL,
      defaults: {
        plugins: [
          {
            id: 'whiteboard',
            name: 'Whiteboard',
            icon: WHITEBOARD_ICON,
            permissions: {
              canActivate: true,
              canDeactivate: true,
            },
            component: iframeRef.current,
          },
        ],
      },
    }).then((m) => {
      if (!m) return;

      const params = new URLSearchParams({
        roomId: m.meta.meetingId,
        roomName: m.meta.meetingTitle || 'Whiteboard',
        userId: m.self.id,
        userName: m.self.name,
      });

      if (m.self.picture) {
        params.set('profilePicture', m.self.picture);
      }

      iframeRef.current.src = `${WHITEBOARD_URL}?${params.toString()}`;
    }).catch(console.error);
  }, []);

  // By default this component will cover the entire viewport.
  // To avoid that and to make it fill a parent container, pass the prop:
  // `mode="fill"` to the component.
  return <RtkMeeting meeting={meeting!} />;
}

export default App;
