# Demo App

Gallery portal for the Cloudflare RealtimeKit Web Examples. Live at [examples.realtime.cloudflare.com](https://examples.realtime.cloudflare.com).

This application lists, filters, and launches all SDK examples. It creates meeting rooms via the RealtimeKit REST API and embeds examples in iframes for live interaction.

## Stack

- **Framework**: React 18 + React Router 7 (framework mode with SSR)
- **Styling**: Tailwind CSS v4
- **Platform**: Cloudflare Workers (`@cloudflare/vite-plugin` + Wrangler)
- **Package Manager**: pnpm

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm
- Cloudflare RealtimeKit API credentials

### Environment Setup

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

Required environment variables:

| Variable | Description |
|----------|-------------|
| `VITE_ORG_ID` | Your RealtimeKit organization ID |
| `VITE_API_KEY` | Your RealtimeKit API key |
| `VITE_BASE_URL` | RealtimeKit API base URL (e.g., `https://api.cloudflare.com/client/v2` or legacy `https://api.dyte.io/v2`) |
| `VITE_ENV` | Environment identifier (e.g., `staging`, `production`) |

### Development

```bash
# Install dependencies
pnpm install

# Start dev server (requires .env with valid credentials)
pnpm dev
```

The app will be available at `http://localhost:5173` (or another port if 5173 is in use).

### Build & Deploy

```bash
# Production build
pnpm build

# Build and deploy to Cloudflare Workers
pnpm deploy

# Type check (runs automatically on postinstall)
pnpm typecheck
```

## Project Structure

```
demo-app/
├── app/
│   ├── pages/              # Route components (home, /react, /angular, /html, /meeting)
│   ├── components/         # Shared UI components (Card, icons, layout, theme toggle)
│   ├── context/            # React context providers
│   ├── api/                # Server-side helpers for meeting creation
│   └── utils/
│       ├── react.ts         # React example catalog (hardcoded)
│       ├── angular.ts       # Angular example catalog (hardcoded)
│       └── vanilla.ts       # HTML example catalog (hardcoded)
├── workers/
│   └── app.ts               # Cloudflare Worker entry point (SSR)
├── worker-configuration.d.ts # Auto-generated Wrangler env bindings
├── vite.config.ts
├── wrangler.jsonc
└── .env.example
```

## Adding Examples to the Gallery

The gallery catalog is **hardcoded** (not auto-discovered). To add a new example:

1. Add the example to the appropriate catalog file in `app/utils/`:
   - React examples: `app/utils/react.ts`
   - Angular examples: `app/utils/angular.ts`
   - HTML examples: `app/utils/vanilla.ts`

2. Each example entry follows this structure:
   ```typescript
   {
     name: "example-name",
     url: "/react-examples/example-name/",
     preset: "YOUR_PRESET_NAME",
     usecase: "category-tag"
   }
   ```

3. Rebuild and redeploy:
   ```bash
   pnpm build && pnpm deploy
   ```

## Key Conventions

- **Path alias**: Use `~/*` → `./app/*` for all imports (e.g., `~/components/Card`, not `../../components/Card`)
- **Type imports**: Use `import type` for type-only imports (required by `verbatimModuleSyntax: true`)
- **Routing**: File-based routing via React Router v7
- **No SDK imports**: Do NOT import `@cloudflare/realtimekit-*` packages here — this app orchestrates meetings, it does not join them

## Commands Reference

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start local development server |
| `pnpm build` | Production build |
| `pnpm deploy` | Build and deploy to Cloudflare Workers |
| `pnpm lint` | Run ESLint |
| `pnpm preview` | Build and preview locally |
| `pnpm typecheck` | Run Wrangler typegen + React Router typegen + TypeScript |
| `pnpm cf-typegen` | Regenerate `worker-configuration.d.ts` from Wrangler config |

## Troubleshooting

- **Type errors after route changes**: Run `pnpm typecheck` to regenerate `.react-router/types/`
- **Wrangler env binding errors**: Run `pnpm cf-typegen` to update `worker-configuration.d.ts`
- **Meeting creation fails**: Verify your `.env` contains valid `VITE_ORG_ID` and `VITE_API_KEY`

## Related

- [RealtimeKit Documentation](https://developers.cloudflare.com/realtime/realtimekit/)
- [Main repository README](../README.md)