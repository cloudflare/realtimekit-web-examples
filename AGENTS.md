# PROJECT KNOWLEDGE BASE

**Generated:** 2026-02-25  
**Branch:** main

## OVERVIEW

Example gallery for **Cloudflare RealtimeKit** — a real-time video/audio SDK. Contains 17 React, 3 Angular, 5 HTML, and 4 recording SDK examples, plus a gallery portal. Live at `examples.realtime.cloudflare.com`. Docs: `developers.cloudflare.com/realtime/realtimekit/`.

## STRUCTURE

```
realtimekit-web-examples/
├── react-examples/            # 17 React+Vite examples → deployed as Cloudflare Worker
├── angular-examples/          # 3 Angular CLI examples → deployed as Cloudflare Worker
├── html-examples/             # 5 vanilla HTML/JS examples → deployed as Cloudflare Worker
├── demo-app/                  # Gallery portal (React Router 7 SSR) → examples.realtime.cloudflare.com
├── recording-sdk-app-examples/ # 4 recording SDK examples → deployed as individual Cloudflare Workers
├── pnpm-workspace.yaml        # Workspace definitions
└── .github/workflows/         # 9 CI/CD workflows (staging + prod per framework)
```

## WHERE TO LOOK

| Task | Location | Notes |
|------|----------|-------|
| Add React example | `react-examples/examples/<name>/` | Also add to `demo-app/app/utils/react.ts` |
| Add Angular example | `angular-examples/examples/<name>/` | Also add to `demo-app/app/utils/angular.ts` |
| Add HTML example | `html-examples/examples/<name>/` | Also add to `demo-app/app/utils/vanilla.ts` |
| Add recording example | `recording-sdk-app-examples/react-examples/<name>/` | Each example has own `wrangler.jsonc`; deploy via `pnpm deploy:staging` / `pnpm deploy:production` |
| Update SDK versions | `<workspace>/update-cloudflare-realtime-deps.sh` | Fetches from npm; pass `--env staging\|prod` |
| Gallery example catalog | `demo-app/app/utils/react.ts`, `angular.ts`, `vanilla.ts` | Hardcoded; new examples won't appear without editing |
| CI / deploy config | `.github/workflows/` | Per-framework staging + prod deploy workflows |
| API credentials | `demo-app/.dev.vars.example` | `REALTIMEKIT_ORG_ID`, `REALTIMEKIT_API_KEY`, `REALTIMEKIT_BASE_URL` |

## COMMANDS

```bash
# Install all workspaces
pnpm install-all

# Run a specific example
cd react-examples/examples/<name> && pnpm dev

# Build + deploy react examples to production
cd react-examples && npm run build && npm run deploy

# Update SDK to latest for a workspace
cd react-examples && ./update-cloudflare-realtime-deps.sh --env prod

# Run the gallery portal locally (requires .env)
cd demo-app && pnpm dev
```

## CONVENTIONS

- **pnpm only** — `preinstall` hook blocks npm/yarn; CI uses `--frozen-lockfile`
- Each example is **fully self-contained**: own `package.json`, `tsconfig.json`, `vite.config.ts`, `node_modules`. No cross-example sharing.
- React/HTML example Vite configs set `base: '/<example-name>/'` — required for sub-path deployment under shared Cloudflare Worker
- SDK version pins in `package.json` are **not the source of truth** — `update-cloudflare-realtime-deps.sh` overwrites them at build time from npm registry
- Gallery catalog is hardcoded in `demo-app/app/utils/` — new examples are not auto-discovered from the workspace

## ANTI-PATTERNS

- Do NOT use npm or yarn — preinstall hook will abort
- `recording-sdk-app-examples` examples each have their own `wrangler.jsonc` — deploy individually via `pnpm deploy:staging` / `pnpm deploy:production`
- Do NOT add shared packages or libs — every example is intentionally isolated
- Do NOT forget to register new examples in `demo-app/app/utils/` — they won't appear in the gallery

## NOTES

- `pnpm-workspace.yaml` has a stale path: `recording-sdk-app-examples/react-examples/*` (actual dir: `recording-sdk-app-examples`) — this workspace glob is broken
- `demo-app/README.md` contains only "TODO" — consult root `README.md`
- `REALTIMEKIT_BASE_URL=realtime.cloudflare.com` is the server-side API base hostname for production; public SDK example builds use `VITE_BASE_URL` with staging using `staging.realtime.cloudflare.com`
- Node version unspecified in the repo; CI uses Node 20 — match locally
