# Recording App - Recording with Watermark

A recording SDK example with a screenshare-focused layout, watermark overlay, and custom video subscription via `videoUnsubscribePresetsRegex` config.

## Local Development

```bash
pnpm install
pnpm dev
```

Open `http://localhost:5173/?authToken=<your-token>` in your browser.

### Custom Configuration

This example supports an optional base64-encoded `config` query parameter:

```ts
interface MeetingConfig {
  uiKit: boolean;                          // Use UI Kit for rendering (default: false)
  waitTimeMs: number;                      // Wait time before recording starts in ms (default: 60000)
  watermark: WatermarkConfig;              // Watermark overlay settings
  videoUnsubscribePresetsRegex?: string[]; // Regex patterns to unsubscribe video for matching presets
}
```

Example:

```js
const config = {
  uiKit: false,
  waitTimeMs: 60000,
  watermark: { enabled: false },
  videoUnsubscribePresetsRegex: ["Host$"]
};
const encoded = btoa(JSON.stringify(config));
// Use: ?authToken=<token>&config=<encoded>
```

## Deploy to Cloudflare Workers

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/cloudflare/realtimekit-web-examples/tree/staging/recording-sdk-app-samples/react-examples/recording-with-watermark)

### Staging

```bash
pnpm deploy:staging
```

### Production

```bash
pnpm deploy:production
```
