import RealtimeKitClient from '@cloudflare/realtimekit';
import { registerAddons } from '@cloudflare/realtimekit-ui';
import { defineCustomElements } from '@cloudflare/realtimekit-ui/loader';
import { EffectsAddon } from './effects/effects-addon.js';

defineCustomElements();

async function main() {
  const params = new URLSearchParams(window.location.search);
  const authToken = params.get('authToken');

  if (!authToken) {
    alert("An authToken wasn't passed, please pass an authToken in the URL query to join a meeting.");
    return;
  }

  // Media-first: acquire camera/mic before initializing the SDK, then hand it over
  // https://developers.cloudflare.com/realtime/realtimekit/core/media-acquisition-approaches/#approach-2-media-first
  const media = await RealtimeKitClient.initMedia({ video: true, audio: true });

  const meeting = await RealtimeKitClient.init({
    authToken,
    baseURI: params.get('baseURI') || 'realtime.cloudflare.com',
    modules: { devTools: { logs: params.get('logInConsole') === 'true' } },
    defaults: { mediaHandler: media },
  });

  const effects = new EffectsAddon({
    meeting,
    onChange: ({ mode, url }) => console.log('Video effect changed:', { mode, url }),
  });

  const meetingElement = document.getElementById('meeting');
  meetingElement.meeting = meeting;
  meetingElement.config = registerAddons([effects], meeting);
}

main();
