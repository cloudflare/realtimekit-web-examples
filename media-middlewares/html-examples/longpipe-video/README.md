# Longpipe Video Effects

Add virtual backgrounds and background blur to a RealtimeKit meeting with [Longpipe](https://longpipe.dev/), an open-source video effects SDK for the browser.

This example adds an **Effects** button to the default meeting UI. It opens a picker with "no effect", blur and a set of background images.

## Run the example

```bash
pnpm install
pnpm dev
```

Open `http://localhost:5173/?authToken=<your-token>`. Optional query params: `baseURI` (defaults to `realtime.cloudflare.com`) and `logInConsole=true`.

To deploy to Cloudflare Workers, run `pnpm deploy:staging` or `pnpm deploy:production`.

## Integrate Longpipe step by step

Longpipe takes a camera `MediaStream` and returns a processed `MediaStream`. Instead of adding a [media middleware](../../README.md#media-middleware), you publish Longpipe's output track as the local participant's video.

### 1. Install Longpipe

```bash
pnpm add longpipe
```

Model weights load from Longpipe's CDN on first use, so no extra setup is needed.

### 2. Initialize the meeting

Acquire media first and pass it to the SDK ([media-first approach](https://developers.cloudflare.com/realtime/realtimekit/core/media-acquisition-approaches/#approach-2-media-first)):

```js
const media = await RealtimeKitClient.initMedia({ video: true, audio: true });

const meeting = await RealtimeKitClient.init({
  authToken,
  defaults: { mediaHandler: media },
});
```

### 3. Run the camera through Longpipe

Clone the camera track and hand it to an `EffectsPipeline`:

```js
import { EffectsPipeline } from 'longpipe';

const cameraTrack = meeting.self.rawVideoTrack.clone();
const pipeline = new EffectsPipeline(new MediaStream([cameraTrack]), {
  background: 'https://rtk-assets.realtime.cloudflare.com/backgrounds/bg_1.jpg', // or 'blur'
});
```

Clone the track because RealtimeKit stops its own camera track in the next step.

### 4. Publish the processed track

Video is already on, so turn it off and turn it on again with Longpipe's track:

```js
await meeting.self.disableVideo();
await meeting.self.enableVideo(pipeline.stream.getVideoTracks()[0]);
```

Other participants now see the processed video.

### 5. Change or remove the effect

Switch effects on the running pipeline, without restarting the camera:

```js
await pipeline.setBackground({ blur: { strength: 0.5 } });
```

To remove the effect, stop the pipeline and let RealtimeKit bring back the plain camera:

```js
await meeting.self.disableVideo();
pipeline.destroy();
cameraTrack.stop();
await meeting.self.enableVideo();
```

### 6. Keep the effect when the camera is toggled

When a user turns the camera off, RealtimeKit does not stop custom tracks, so release them yourself. When the camera is turned back on, start a new pipeline and publish its track again. This example handles both by wrapping `meeting.self.enableVideo` in [`longpipe-effects.js`](./src/effects/longpipe-effects.js).

### 7. Add the Effects button (optional)

[`effects-addon.js`](./src/effects/effects-addon.js) packages the steps above as a UI Kit addon:

```js
import { registerAddons } from '@cloudflare/realtimekit-ui';
import { EffectsAddon } from './effects/effects-addon.js';

const effects = new EffectsAddon({ meeting });

const meetingElement = document.getElementById('meeting');
meetingElement.meeting = meeting;
meetingElement.config = registerAddons([effects], meeting);
```

`EffectsAddon` options: `images` (background URLs, must allow CORS), `blurStrength` (0 to 1), `label` and `onChange`.

## Project structure

```
src/
├── main.js                     # Meeting setup + addon registration
└── effects/
    ├── longpipe-effects.js     # Longpipe pipeline + local video track handling
    ├── effects-addon.js        # UI Kit addon: Effects button + wiring
    ├── effects-dialog.js       # <rtk-effects-dialog> background picker
    └── icons.js                # SVG icons
```

`effects-addon.js` and `effects-dialog.js` are based on the `video-background` addon from [`@cloudflare/realtimekit-ui-addons`](https://github.com/cloudflare/realtimekit-ui-addons), with `RealtimeKitVideoBackgroundTransformer` replaced by Longpipe.

## Known limitations

- **Firefox**: Longpipe's WebGPU backend currently fails in Firefox, so video is published without the effect.