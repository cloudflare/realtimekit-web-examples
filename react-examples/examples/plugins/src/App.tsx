import { useEffect, useRef } from 'react';
import { RtkMeeting } from '@cloudflare/realtimekit-react-ui';
import { useRealtimeKitClient } from '@cloudflare/realtimekit-react';

const WHITEBOARD_URL = 'https://whiteboard-collabkit.cf-realtime.workers.dev';
const WHITEBOARD_ICON =
  'https://whiteboard-collabkit.cf-realtime.workers.dev/logo.png';

const DOCSHARE_URL = 'https://docshare-collabkit.cf-realtime.workers.dev';
const STREAMER_URL = 'https://streamer-collabkit.cf-realtime.workers.dev';

function createPluginIframe(): HTMLIFrameElement {
  const iframe = document.createElement('iframe');
  iframe.style.width = '100%';
  iframe.style.height = '100%';
  iframe.style.border = 'none';
  iframe.allow = 'camera; microphone';
  return iframe;
}

function App() {
  const [meeting, initMeeting] = useRealtimeKitClient();
  const whiteboardIframeRef = useRef<HTMLIFrameElement | null>(null);
  if (!whiteboardIframeRef.current) {
    whiteboardIframeRef.current = createPluginIframe();
  }

  const docshareIframeRef = useRef<HTMLIFrameElement | null>(null);
  if (!docshareIframeRef.current) {
    docshareIframeRef.current = createPluginIframe();
  }

  const streamerIframeRef = useRef<HTMLIFrameElement | null>(null);
  if (!streamerIframeRef.current) {
    streamerIframeRef.current = createPluginIframe();
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

    const baseURI = searchParams.get('baseURI') || import.meta.env.VITE_BASE_URL;
    const logInConsole = searchParams.get('logInConsole') === 'true';

    initMeeting({
      authToken,
      baseURI,
      modules: { devTools: { logs: logInConsole } },
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
            component: whiteboardIframeRef.current,
          },
          {
            id: 'docshare',
            name: 'DocShare',
            icon: `${DOCSHARE_URL}/document.png`,
            permissions: {
              canActivate: true,
              canDeactivate: true,
            },
            component: docshareIframeRef.current,
          },
          {
            id: 'streamer',
            name: 'Streamer',
            icon: `${STREAMER_URL}/logo.png`,
            permissions: {
              canActivate: true,
              canDeactivate: true,
            },
            component: streamerIframeRef.current,
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

      whiteboardIframeRef.current!.src = `${WHITEBOARD_URL}?${params.toString()}`;

      const docshareParams = new URLSearchParams({
        roomId: m.meta.meetingId,
        roomName: m.meta.meetingTitle || 'DocShare',
        userId: m.self.id,
        userName: m.self.name,
      });
      docshareIframeRef.current!.src = `${DOCSHARE_URL}?${docshareParams.toString()}`;

      const streamerParams = new URLSearchParams({
        roomId: m.meta.meetingId,
        roomName: m.meta.meetingTitle || 'Streamer',
        userId: m.self.id,
        userName: m.self.name,
      });
      streamerIframeRef.current!.src = `${STREAMER_URL}?${streamerParams.toString()}`;
    }).catch(console.error);
  }, []);

  // By default this component will cover the entire viewport.
  // To avoid that and to make it fill a parent container, pass the prop:
  // `mode="fill"` to the component.
  return <RtkMeeting meeting={meeting!} />;
}

export default App;
