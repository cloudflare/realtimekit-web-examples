# Recording App - Record Single Preset

A recording SDK example that records only participants with the `LEAD` preset. Uses `RtkSimpleGrid` for camera-only views and `RtkMixedGrid` when a screenshare is active.

## Local Development

```bash
pnpm install
pnpm dev
```

## Deploy to Cloudflare Workers

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/cloudflare/realtimekit-web-examples/tree/staging/recording-sdk-app-samples/react-examples/record-single-preset)

### Staging

```bash
pnpm deploy:staging
```

### Production

```bash
pnpm deploy:production
```
