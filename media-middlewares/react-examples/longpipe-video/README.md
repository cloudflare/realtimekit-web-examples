# Longpipe Video Effects (React)

Add virtual backgrounds and background blur to a RealtimeKit meeting with [Longpipe](https://longpipe.dev/), an open-source video effects SDK for the browser.

This example adds an **Effects** button to the default meeting UI (`RtkMeeting`). It opens a picker with "no effect", blur and a set of background images.

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

```tsx
const [meeting, initMeeting] = useRealtimeKitClient();

useEffect(() => {
  RealtimeKitClient.initMedia({ video: true, audio: true }).then((media) =>
    initMeeting({ authToken, defaults: { mediaHandler: media } })
  );
}, []);
```

### 3. Run the camera through Longpipe

Clone the camera track and hand it to an `EffectsPipeline`:

```ts
import { EffectsPipeline } from 'longpipe';

const cameraTrack = meeting.self.rawVideoTrack.clone();
const pipeline = new EffectsPipeline(new MediaStream([cameraTrack]), {
  background: 'https://rtk-assets.realtime.cloudflare.com/backgrounds/bg_1.jpg', // or 'blur'
});
```

Clone the track because RealtimeKit stops its own camera track in the next step.

### 4. Publish the processed track

Video is already on, so turn it off and turn it on again with Longpipe's track:

```ts
await meeting.self.disableVideo();
await meeting.self.enableVideo(pipeline.stream.getVideoTracks()[0]);
```

Other participants now see the processed video.

### 5. Change or remove the effect

Switch effects on the running pipeline, without restarting the camera:

```ts
await pipeline.setBackground({ blur: { strength: 0.5 } });
```

To remove the effect, stop the pipeline and let RealtimeKit bring back the plain camera:

```ts
await meeting.self.disableVideo();
pipeline.destroy();
cameraTrack.stop();
await meeting.self.enableVideo();
```

### 6. Keep the effect when the camera is toggled

When a user turns the camera off, RealtimeKit does not stop custom tracks, so release them yourself. When the camera is turned back on, start a new pipeline and publish its track again. This example handles both by wrapping `meeting.self.enableVideo` in [`longpipe-effects.ts`](./src/effects/longpipe-effects.ts).

### 7. Add the Effects button (optional)

[`useLongpipeEffects`](./src/effects/useLongpipeEffects.ts) wraps the steps above in a hook, [`EffectsAddon`](./src/effects/effects-addon.ts) adds the button to the UI Kit, and [`EffectsDialog`](./src/effects/EffectsDialog.tsx) renders the picker:

```tsx
const [config, setConfig] = useState<UIConfig>();
const [effectsOpen, setEffectsOpen] = useState(false);
const { selected, busy, apply } = useLongpipeEffects(meeting);

// RtkMeeting loads the preset's config whenever `meeting` changes,
// so apply the addon config in a separate update
useEffect(() => {
  if (!meeting) return;
  const effectsAddon = new EffectsAddon({ onClick: () => setEffectsOpen((open) => !open) });
  setConfig(registerAddons([effectsAddon], meeting));
}, [meeting]);

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
```

## Project structure

```
src/
├── App.tsx                       # Meeting setup, addon registration, Effects dialog
└── effects/
    ├── longpipe-effects.ts       # Longpipe pipeline + local video track handling
    ├── useLongpipeEffects.ts     # React hook: apply effects, track selection
    ├── effects-addon.ts          # UI Kit addon: Effects button
    ├── EffectsDialog.tsx         # Background picker
    ├── EffectsDialog.css
    └── icons.ts                  # SVG icons
```

The Effects button and picker are based on the `video-background` addon from [`@cloudflare/realtimekit-ui-addons`](https://github.com/cloudflare/realtimekit-ui-addons), with `RealtimeKitVideoBackgroundTransformer` replaced by Longpipe.

## Known limitations

- **Firefox**: Longpipe's WebGPU backend currently fails in Firefox, so video is published without the effect.
- **Camera switching**: switching cameras from the settings menu drops the effect until it is re-selected or the camera is toggled.
