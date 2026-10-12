# Manual Subscription Example (Angular)

This example demonstrates selecting which remote participants' audio, video,
screen-share audio, and screen-share video you receive using RealtimeKit's
manual subscription APIs. It adds a **Subscriptions** dialog to the default
`<rtk-meeting>` UI.

See
[the subscription handlers](./src/app/manual-subscriptions-dialog.component.ts),
[the control-bar integration](./src/app/app.component.ts), and the
[participants API reference](https://developers.cloudflare.com/realtime/realtimekit/core/api-reference/rtkparticipants/).

## Development

From this directory:

```sh
pnpm install
pnpm run dev
```

Create a meeting and participant following the
[RealtimeKit documentation](https://developers.cloudflare.com/realtime/realtimekit/),
then open the app with the participant's `authToken`:

```text
http://localhost:4200/?authToken=YOUR_PARTICIPANT_TOKEN
```

To try subscriptions, join the same meeting in another tab or browser with a
different participant token, then open **Subscriptions** and enable **Manual
subscription mode**.

Optional query parameters:

- `baseURI`: overrides the SDK base URL.
- `logInConsole=true`: enables SDK console logging.

## Build

Run `pnpm run build` to produce `dist/`, configured for deployment at
`/manual-subscription/`. The development and build scripts generate the SDK base
URL from `VITE_BASE_URL` or the Angular examples' `.env`, defaulting to
`realtime.cloudflare.com`.
