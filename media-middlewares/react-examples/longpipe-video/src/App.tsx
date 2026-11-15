import { useEffect, useState } from 'react';
import RealtimeKitClient from '@cloudflare/realtimekit';
import { useRealtimeKitClient } from '@cloudflare/realtimekit-react';
import { RtkMeeting, registerAddons, type UIConfig } from '@cloudflare/realtimekit-react-ui';
import { EffectsAddon } from './effects/effects-addon';
import { EffectsDialog } from './effects/EffectsDialog';
import { useLongpipeEffects } from './effects/useLongpipeEffects';

const BACKGROUNDS = Array.from(
  { length: 7 },
  (_, i) => `https://rtk-assets.realtime.cloudflare.com/backgrounds/bg_${i + 1}.jpg`
);

function App() {
  const [meeting, initMeeting] = useRealtimeKitClient();
  const [config, setConfig] = useState<UIConfig>();
  const [effectsOpen, setEffectsOpen] = useState(false);
  const { selected, busy, apply } = useLongpipeEffects(meeting);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const authToken = params.get('authToken');

    if (!authToken) {
      alert("An authToken wasn't passed, please pass an authToken in the URL query to join a meeting.");
      return;
    }

    // Media-first: acquire camera/mic before initializing the SDK, then hand it over
    // https://developers.cloudflare.com/realtime/realtimekit/core/media-acquisition-approaches/#approach-2-media-first
    RealtimeKitClient.initMedia({ video: true, audio: true }).then((media) =>
      initMeeting({
        authToken,
        baseURI: params.get('baseURI') || 'realtime.cloudflare.com',
        modules: { devTools: { logs: params.get('logInConsole') === 'true' } },
        defaults: { mediaHandler: media },
      })
    );
  }, []);

  // RtkMeeting loads the preset's config whenever `meeting` changes, so apply the addon
  // config in a separate update after the meeting is set
  useEffect(() => {
    if (!meeting) return;
    const effectsAddon = new EffectsAddon({ onClick: () => setEffectsOpen((open) => !open) });
    setConfig(registerAddons([effectsAddon], meeting));
  }, [meeting]);

  if (!meeting) return null;

  return (
    <>
      <RtkMeeting meeting={meeting} config={config} showSetupScreen />
      <EffectsDialog
        open={effectsOpen}
        images={BACKGROUNDS}
        selected={selected}
        busy={busy}
        onSelect={apply}
        onClose={() => setEffectsOpen(false)}
      />
    </>
  );
}

export default App;
