# Manual Subscription Example (HTML)

This example demonstrates selecting which remote participants' audio, video,
screen-share audio, and screen-share video you receive using RealtimeKit's
manual subscription APIs. It adds a **Subscriptions** dialog to the default
`<rtk-meeting>` UI using vanilla JavaScript and UI Kit web components.

See [the source](./index.html) and the
[participants API reference](https://developers.cloudflare.com/realtime/realtimekit/core/api-reference/rtkparticipants/).

## Development

From `html-examples/`:

```sh
pnpm install
pnpm run prebuild
pnpm exec serve examples --listen 3000
```

Create a meeting and participant following the
[RealtimeKit documentation](https://developers.cloudflare.com/realtime/realtimekit/),
then open the app with the participant's `authToken`:

```text
http://localhost:3000/manual-subscription/?authToken=YOUR_PARTICIPANT_TOKEN
```

To try subscriptions, join the same meeting in another tab or browser with a
different participant token, then open **Subscriptions** and enable **Manual
subscription mode**.

Optional query parameters:

- `baseURI`: overrides the SDK base URL.
- `logInConsole=true`: enables SDK console logging.

## Build

From `html-examples/`, run `pnpm run build` to prepare the HTML examples for
deployment. The build scripts set the SDK base URL and CDN package tags and copy
the examples into `dist/`.
