# Cloudflare RealtimeKit SDK Recording App Examples 

This repository consists of recording example apps created using Cloudflare RealtimeKit Recording SDK, our Core SDKs, and, fully customizeable UI kits.

Guide: https://docs.realtime.cloudflare.com/guides/recording/create-record-app-using-sdks

## Examples

Here are a few available examples.

1. React examples
  A. recording-with-watermark <br>
  B. screenshare-focused <br>
  C. screenshare-focused-with-snapshot-capture <br>
  D. record-single-preset <br>

## Usage

First, you'll need to create a meeting and add a participant to that meeting.

You can do so by following the [Cloudflare RealtimeKit documentation](https://developers.cloudflare.com/realtime/realtimekit/).

Make sure you've created your Cloudflare account at https://dash.cloudflare.com/ and have your `Account ID` and `API Token` ready.

1. Follow the [Cloudflare RealtimeKit documentation](https://developers.cloudflare.com/realtime/realtimekit/) to create a new Room.
2. Create a new Session Token to join the room.

Once you're done, you'll get an `authToken`, which you can use in an example as explained below.

Here are steps to try out the examples:

1. Clone the repo:

```sh
git clone https://github.com/cloudflare/realtimekit-web-examples.git
```

2. Change directory to the example you want to try, for example: to use recording-with-watermark react-example use the following command:

```sh
cd react-examples/recording-with-watermark
```

3. Install the packages with your preferred package manager and start a
   development server and open up the page.

```sh
pnpm install
# and to start a dev server
pnpm dev
```

4. Load the dev server in your browser and make sure you pass the `authToken`
   query in the URL.

```
http://localhost:5173/?authToken=<your-token>
```

### Custom Configuration (recording-with-watermark)

The `recording-with-watermark` example supports an optional base64-encoded `config` query parameter to customize behavior:

```ts
interface MeetingConfig {
  uiKit: boolean;                          // Use UI Kit for rendering (default: false)
  waitTimeMs: number;                      // Wait time before recording starts in ms (default: 60000)
  watermark: WatermarkConfig;              // Watermark overlay settings (position, size, opacity, etc.)
  videoUnsubscribePresetsRegex?: string[]; // Regex patterns to unsubscribe video for matching presets
}
```

**`videoUnsubscribePresetsRegex`** — an array of regex patterns to selectively unsubscribe video for participants whose preset name matches any pattern. For example, `["Host$", "^interviewer"]` would unsubscribe video for participants with presets ending in "Host" or starting with "interviewer".

To use it, base64-encode the JSON config and pass it as a query parameter:

```
http://localhost:5173/?authToken=<your-token>&config=<base64-encoded-json>
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

5. Deploy to Cloudflare Workers.

```sh
# Deploy to staging
pnpm deploy:staging

# Deploy to production
pnpm deploy:production
```
