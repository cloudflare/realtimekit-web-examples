# react-examples

## OVERVIEW

17 self-contained React+Vite+Tailwind example apps demonstrating Cloudflare RealtimeKit. All deployed together as a single Cloudflare Worker, each served at `/<example-name>/`.

## STRUCTURE

```
react-examples/
├── examples/
│   ├── default-meeting-ui/        # Drop-in <RtkMeeting> — minimal integration
│   ├── simple-ui/                 # Atom-level custom UI from individual SDK primitives
│   ├── simple-group-call/         # Custom UI with setup screen
│   ├── create-your-own-ui/        # Full custom UI reference; commented-export swap pattern
│   ├── active-speaker-ui/         # Custom layout highlighting loudest speaker; useActiveSpeaker hook
│   ├── screenshare-focused-ui-with-custom-addons/ # Fullscreen screenshare + custom addons
│   ├── facetime/                  # Two-person PiP layout; auto-joins on init
│   ├── audio-room/                # Voice-only (video disabled)
│   ├── clubhouse/                 # Audio-only with raise-hand / request-to-speak
│   ├── chat/                      # Chat-only view (no video grid)
│   ├── chat-widget/               # Embeddable floating chat popup + server.ts backend auth
│   ├── with-background-transformer/ # Default UI + virtual background middleware
│   ├── async-video-survey/        # Solo async video recording (60s cap, brightness/silence detection)
│   ├── live-auction/              # Paged setup/meeting/ended flow with custom branding
│   ├── back-to-back-meetings/     # Sequential meetings chained via onMeetingLeft
│   ├── multi-meeting/             # Dual meetings side-by-side, default UI, resizable split
│   └── multi-meeting-custom/      # Dual meetings side-by-side, custom UI, resizable split
├── update-cloudflare-realtime-deps.sh  # Rewrites dep versions from npm registry before install
├── postbuild.sh                   # Aggregates examples/*/dist → dist/<name>/; copies worker.js
├── worker.js                      # Cloudflare Worker — SPA routing across all sub-paths
├── wrangler.jsonc                 # Deploy config
└── package.json                   # npm workspaces; scripts: build, postbuild, deploy
```

## WHERE TO LOOK

| Task | Location | Notes |
|------|----------|-------|
| Minimal default UI | `default-meeting-ui/` | Single `<RtkMeeting meeting={meeting} />` |
| Custom UI from atoms | `simple-ui/` | `RtkGrid`, `RtkMicToggle`, `RtkCameraToggle`, etc. + `useRealtimeKitSelector` |
| Full bespoke UI reference | `create-your-own-ui/` | `onRtkStatesUpdate`, custom store, `RtkDialogManager` retained |
| Virtual background | `with-background-transformer/` | `meeting.self.addVideoMiddleware`, canvas2dCpu pipeline |
| Multiple concurrent meetings | `multi-meeting/`, `multi-meeting-custom/` | Two independent `initMeeting` instances |
| Sequential meetings | `back-to-back-meetings/` | `onMeetingLeft` callback chains next `initMeeting` |
| Config manipulation | `screenshare-focused-ui-with-custom-addons/` | `generateConfig`, `defaultConfig`, `RtkStateListenersUtils` |

## SDK PACKAGES

| Package | Used for |
|---------|----------|
| `@cloudflare/realtimekit` | Core: `RealtimeKitClient`, `initMeeting` |
| `@cloudflare/realtimekit-react` | `RealtimeKitProvider`, `useRealtimeKitClient`, `useRealtimeKitMeeting`, `useRealtimeKitSelector` |
| `@cloudflare/realtimekit-react-ui` | `RtkMeeting`, `RtkGrid`, `RtkUiProvider`, `RtkDialogManager`, control atoms, `provideRtkDesignSystem` |
| `@cloudflare/realtimekit-ui-addons` | `VideoBackground`, `HandRaise`, host controls |
| `@cloudflare/realtimekit-virtual-background` | Background blur/image: `addVideoMiddleware` |

## CONVENTIONS

- Every example sets `base: '/<example-name>/'` in `vite.config.ts` — required for Worker sub-path routing; do not remove
- Auth: `authToken` passed via URL query param (`?authToken=...`) — demo-app generates and injects it via iframe URL
- `provideRtkDesignSystem()` called in `main.tsx` before render — registers web components globally
- Build at workspace level uses `npm run build` (not pnpm) — the framework workspace uses npm workspaces internally

## ANTI-PATTERNS

- `create-your-own-ui` and `screenshare-focused-ui-with-custom-addons` use **commented-out export swaps** to toggle prebuilt vs. custom components — do not delete these comments assuming they are dead code
- Known broken: `RtkDialogManager` state sync in `back-to-back-meetings/src/Meeting.tsx` (FIXME at ~line 199)
- `chat-widget/src/server.ts` creates an agent participant but the `notify()` call is commented out — agent token is created but never delivered (silent broken feature)

## NOTES

- `screenshare-focused-ui-with-custom-addons` is the most complex example: custom `lib/`, `RtkStateListenersUtils`, reactions, effects manager
- Older examples use Vite ^3 + TypeScript ^4; newer use Vite ^5 + TypeScript ^5 — version inconsistency is expected
