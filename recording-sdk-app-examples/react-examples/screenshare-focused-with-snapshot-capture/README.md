# Recording App - Screenshare Focused with Snapshot Capture

A recording SDK example with a screenshare-focused layout plus periodic JPEG snapshot capture. Snapshots are captured via `canvas.toDataURL` and POSTed to a configurable endpoint.

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
