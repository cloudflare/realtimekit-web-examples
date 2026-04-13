# demo-app

## OVERVIEW

Gallery portal deployed at `examples.realtime.cloudflare.com`. Lists, filters, and launches all SDK examples. **Not an SDK example** — creates meeting rooms via RealtimeKit REST API and embeds examples in iframes.

## STRUCTURE

```
demo-app/
├── app/
│   ├── pages/              # Route components: home, /react, /angular, /html, /meeting
│   ├── components/         # Shared UI: Card, icons, layout, theme toggle
│   │   └── icons/
│   ├── context/            # React context providers
│   ├── api/                # Server-side helpers for meeting creation
│   └── utils/
│       ├── react.ts        # Hardcoded React example catalog (name, URL, preset, usecase)
│       ├── angular.ts      # Hardcoded Angular example catalog
│       └── vanilla.ts      # Hardcoded HTML example catalog
├── workers/
│   └── app.ts              # Cloudflare Worker entry point (SSR)
├── worker-configuration.d.ts  # Auto-generated Wrangler env bindings — do not edit manually
├── .env.example
├── vite.config.ts
└── tsconfig.cloudflare.json   # Primary TS config; includes .react-router/types/**/*
```

## WHERE TO LOOK

| Task | Location | Notes |
|------|----------|-------|
| Add example to gallery | `app/utils/react.ts` (or angular/vanilla) | Required — gallery is hardcoded, not auto-discovered |
| Meeting creation | `app/api/` + `app/pages/meeting.tsx` | Calls RealtimeKit REST API → generates authToken → loads example iframe |
| Route pages | `app/pages/` | React Router v7 file-based routing |
| Worker entry / env bindings | `workers/app.ts`, `worker-configuration.d.ts` | Run `pnpm cf-typegen` after `wrangler.toml` changes |

## CONVENTIONS

- React Router **v7 framework mode** (`@react-router/dev/vite`) — file-based routing, server actions, and typegen
- Path alias `~/*` → `./app/*` — use `~/components/Foo`, not relative `../../` imports
- `verbatimModuleSyntax: true` in tsconfig — `import type` required for all type-only imports
- Run `pnpm typecheck` after route changes — regenerates types from `.react-router/types/`
- `worker-configuration.d.ts` is Wrangler-generated — run `pnpm cf-typegen` to update it; never edit by hand

## ANTI-PATTERNS

- Do NOT import `@cloudflare/realtimekit-*` SDK packages here — this app orchestrates meetings, it does not join them
- Do NOT use relative path imports for app source — use `~/` alias consistently
- `app/components/Card.tsx` has two commented-out JSX blocks (platform badges + external collaborator samples) — deferred features; do not delete

## COMMANDS

```bash
pnpm dev         # Local dev (requires .env with valid VITE_ORG_ID + VITE_API_KEY)
pnpm build       # Production build
pnpm deploy      # Build + wrangler deploy
pnpm typecheck   # wrangler types + react-router typegen + tsc
pnpm cf-typegen  # Regenerate worker-configuration.d.ts
```

## NOTES

- `.env.example` includes a real shared demo `VITE_ORG_ID` — intentional for preset compatibility
- `VITE_BASE_URL=dyte.io/v2` in `.env.example` is a legacy URL — verify actual endpoint in CI secrets
- `demo-app/README.md` is blank ("TODO") — this file is the authoritative reference
- Stack: React 18 + React Router 7 + Tailwind CSS v4 + `@cloudflare/vite-plugin` + Wrangler