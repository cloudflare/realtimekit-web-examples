# recording-sdk-app-samples

## OVERVIEW

4 React apps for `@cloudflare/realtimekit-recording-sdk` — a headless recorder/bot client that runs inside a browser automation context (e.g., Puppeteer, Playwright). **Deploys to Vercel**, not Cloudflare Workers.

## STRUCTURE

```
recording-sdk-app-samples/
└── react-examples/
    ├── record-single-preset/                    # Records only participants with preset "LEAD"
    ├── screenshare-focused/                     # Recording layout: screenshare fullscreen + participant bubbles
    ├── screenshare-focused-with-snapshot-capture/ # Same + periodic JPEG snapshots POSTed to endpoint
    └── recording-with-watermark/               # Screenshare layout + watermark overlay + FlagsmithController
```

## WHERE TO LOOK

| Task | Location | Notes |
|------|----------|-------|
| Baseline recording layout | `screenshare-focused/` | Start here; other examples build on this |
| Filter recording by preset | `record-single-preset/` | `participant.preset.name === 'LEAD'` filter |
| Capture video snapshots | `screenshare-focused-with-snapshot-capture/` | `canvas.toDataURL` → POST to configurable endpoint |
| Feature-flagged watermark | `recording-with-watermark/` | `FlagsmithController` wraps `Watermark.tsx` |

## CONVENTIONS

- **Vercel deployment** — run `vercel` CLI to deploy; no `wrangler.jsonc` or `worker.js` here
- Auth: `authToken` passed via URL query param — same as main react-examples
- Versions pinned manually in each `package.json` — no `update-cloudflare-realtime-deps.sh`
- Vite ^5 + TypeScript ^5 (newer than main react-examples workspace)

## ANTI-PATTERNS

- Do NOT add `worker.js` or `wrangler.jsonc` — Vercel only
- Do NOT copy `@dyteinternals/utils` to new examples — it is a vestigial dep in `recording-with-watermark` from an upstream fork

## NOTES

- `record-single-preset`: participant pin loop (`participant.pin()`) is commented out — optional feature intentionally disabled
- `pnpm-workspace.yaml` at repo root references `recording-sdk-app-examples/react-examples/*` (misnamed: `examples` vs `samples`) — this workspace glob is broken and these packages are not resolved by the root pnpm workspace
