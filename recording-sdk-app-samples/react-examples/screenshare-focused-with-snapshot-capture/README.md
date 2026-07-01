# Recording App - Screenshare Focused with Snapshot Capture

A recording SDK example with a screenshare-focused layout plus periodic JPEG snapshot capture. Snapshots are captured via `canvas.toDataURL` and POSTed to a configurable endpoint.

## Local Development

```bash
pnpm install
pnpm dev
```

Open `http://localhost:5173/?authToken=<your-token>` in your browser.

## Deploy to Cloudflare Workers

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/cloudflare/realtimekit-web-examples/tree/staging/recording-sdk-app-samples/react-examples/screenshare-focused-with-snapshot-capture)

### Staging

```bash
pnpm deploy:staging
```

### Production

```bash
pnpm deploy:production
```
