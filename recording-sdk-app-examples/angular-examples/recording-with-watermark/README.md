# Recording App - Recording with Watermark (Angular)

A recording SDK example with a screenshare-focused layout, watermark overlay, and custom video subscription via `videoUnsubscribePresetsRegex` config.

## Local Development

```bash
pnpm install
pnpm dev
```

Open `http://localhost:4200/?authToken=<your-token>` in your browser.

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

Example with watermark enabled:

```js
const config = {
  watermark: { enabled: true }
};
const encoded = btoa(JSON.stringify(config));
// Use: ?authToken=<token>&config=<encoded>
```

Pre-built URL with watermark enabled (default Cloudflare favicon, 200px, top-left):

```
?authToken=<token>&config=eyJ3YXRlcm1hcmsiOnsiZW5hYmxlZCI6dHJ1ZX19
```

Example with all options:

```js
const config = {
  uiKit: false,
  waitTimeMs: 60000,
  watermark: {
    enabled: true,
    url: "https://dash.cloudflare.com/favicon.ico",
    position: "left top",    // "left top" | "right top" | "left bottom" | "right bottom"
    size: { width: 200 },
    opacity: 1
  },
  videoUnsubscribePresetsRegex: ["Host$"]
};
const encoded = btoa(JSON.stringify(config));
// Use: ?authToken=<token>&config=<encoded>
```

## Deploy to Cloudflare Workers

### Staging

```bash
pnpm deploy:staging
```

### Production

```bash
pnpm deploy:production
```
