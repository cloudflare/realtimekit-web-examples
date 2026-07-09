# recording-sdk-app-examples

## OVERVIEW

4 React + 4 Angular apps for `@cloudflare/realtimekit-recording-sdk` — a headless recorder/bot client that runs inside a browser automation context (e.g., Puppeteer, Playwright). **Deploys to Cloudflare Workers** (Vite/ng build + wrangler deploy).

## STRUCTURE

```
recording-sdk-app-examples/
├── react-examples/
│   ├── record-single-preset/                    # Records only participants with preset "LEAD"
│   ├── screenshare-focused/                     # Recording layout: screenshare fullscreen + participant bubbles
│   ├── screenshare-focused-with-snapshot-capture/ # Same + periodic JPEG snapshots POSTed to endpoint
│   └── recording-with-watermark/               # Screenshare layout + watermark overlay + custom video subscription
└── angular-examples/
    ├── record-single-preset/                    # Angular port of record-single-preset
    ├── screenshare-focused/                     # Angular port of screenshare-focused
    ├── screenshare-focused-with-snapshot-capture/ # Angular port of screenshare-focused-with-snapshot-capture
    └── recording-with-watermark/               # Angular port of recording-with-watermark
```

## WHERE TO LOOK

| Task | Location | Notes |
|------|----------|-------|
| Baseline recording layout | `screenshare-focused/` | Start here; other examples build on this |
| Filter recording by preset | `record-single-preset/` | `participant.preset.name === 'LEAD'` filter |
| Capture video snapshots | `screenshare-focused-with-snapshot-capture/` | `canvas.toDataURL` → POST to configurable endpoint |
| Watermark + video subscription | `recording-with-watermark/` | Watermark overlay + `videoUnsubscribePresetsRegex` config for custom video subscription |

## CONVENTIONS

- **Cloudflare Workers deployment** — each example has its own `wrangler.jsonc` with staging/production envs. Deploy via `pnpm deploy:staging` or `pnpm deploy:production`
- Auth: `authToken` passed via URL query param — same as main react-examples
- Versions pinned manually in each `package.json` — no `update-cloudflare-realtime-deps.sh`
- Worker names follow the pattern `recording-app-<example-name>-staging` / `recording-app-<example-name>-production`
- React `record-single-preset` uses Vite ^5 + TypeScript ^5; the other three React examples use Vite ^3 + TypeScript ^4
- Angular examples use Angular CLI 15 + TypeScript ~4.8 (NgModule-based, not standalone components)

## ANTI-PATTERNS

- Do NOT add unnecessary third-party dependencies — keep examples minimal

## CONFIG

The `recording-with-watermark` example accepts a base64-encoded JSON `config` query parameter with this shape:

```ts
interface MeetingConfig {
  uiKit: boolean;                          // Use UI Kit for rendering (default: false)
  waitTimeMs: number;                      // Wait time before recording starts (default: 60000)
  watermark: WatermarkConfig;              // Watermark overlay settings
  videoUnsubscribePresetsRegex?: string[]; // Regex patterns to unsubscribe video for matching presets
}
```

**`videoUnsubscribePresetsRegex`** — pass an array of regex patterns (e.g., `["Host$", "^interviewer"]`) to unsubscribe video for participants whose preset name matches. This replaces the previous Flagsmith-based feature flag approach — no external feature flag service is needed.

Example URL with config:
```
?authToken=<token>&config=<base64-encoded-json>
```

## NOTES

- `record-single-preset`: participant pin loop (`participant.pin()`) is commented out — optional feature intentionally disabled
- `pnpm-workspace.yaml` at repo root includes both `recording-sdk-app-examples/react-examples/*` and `recording-sdk-app-examples/angular-examples/*`
- Flagsmith dependency has been removed from `recording-with-watermark` — custom video subscription is now controlled via the `videoUnsubscribePresetsRegex` config key
