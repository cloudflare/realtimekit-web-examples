# Recording App - Record Single Preset (Angular)

Recording SDK based example application that records only participants with the `LEAD` preset. Uses `<rtk-simple-grid>` for camera-only views and `<rtk-mixed-grid>` when a screenshare is active.

## How Recording Works in RealtimeKit

In Cloudflare RealtimeKit, recording is powered by a **virtual hidden participant** (the recorder). When a recording is started, RealtimeKit spins up a headless Chrome browser, loads your recording app's hosted URL, and records the browser viewport using Chrome DevTools Protocol. The output is a video of exactly what your app renders — giving you full control over the recording layout.

This means:

1. **You build a web app** that renders the meeting UI however you want (this example).
2. **You deploy it** to a publicly accessible URL (e.g., Cloudflare Workers).
3. **You start a recording** via the [Start Recording API](https://developers.cloudflare.com/api/resources/realtime_kit/subresources/recordings/methods/start_recordings/), passing your app's URL.
4. The recorder opens your URL in a headless browser, appends `authToken` as a query parameter, joins the meeting as a hidden participant, and records the viewport.

For more details, see the [Recording Guide — Create a Recording App Using SDKs](https://developers.cloudflare.com/realtime/realtimekit/recording-guide/create-record-app-using-sdks/).

### Authentication

The recorder authenticates using a participant token created with the `recorder_preset_v2` preset. If this preset doesn't exist in your app, a default one is used. The `authToken` is appended to your app's URL as a query parameter automatically by the recorder:

- If your URL has no query params: `https://your-app.example.com/?authToken=<token>`
- If your URL already has query params: `https://your-app.example.com/?config=CUSTOM_CONFIG&authToken=<token>`

**Your app must read `authToken` from the URL query parameters** to initialize the RealtimeKit client.

### Passing Custom Configuration

You can pass additional configuration to your recording app via query parameters in the URL you provide to the Start Recording API. The recorder will preserve your existing query parameters and append `authToken` (using `?` or `&` as appropriate).

For example, if you start a recording with:

```
https://your-app.example.com/?config=CUSTOM_CONFIG_HERE&otherParam=otherValue
```

The recorder will load:

```
https://your-app.example.com/?config=CUSTOM_CONFIG_HERE&otherParam=otherValue&authToken=<token>
```

## Local Development

```bash
pnpm install
pnpm dev
```

Open `http://localhost:4200/?authToken=<your-token>` in your browser.

## Deploy to Cloudflare Workers

### Staging

```bash
pnpm deploy:staging
```

### Production

```bash
pnpm deploy:production
```
