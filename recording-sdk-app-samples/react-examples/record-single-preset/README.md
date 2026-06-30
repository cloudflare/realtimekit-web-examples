# Recording App - Record Single Preset

A recording SDK example that records only participants with the `LEAD` preset. Uses `RtkSimpleGrid` for camera-only views and `RtkMixedGrid` when a screenshare is active.

## Local Development

```bash
pnpm install
pnpm dev
```

Open `http://localhost:5173/?authToken=<your-token>` in your browser.

## Deploy to Cloudflare Workers

### Staging

```bash
pnpm deploy:staging
```

### Production

```bash
pnpm deploy:production
```
