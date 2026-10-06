# Manual Subscription Example (React)

This example demonstrates selecting which remote participants' audio, video,
screen-share audio, and screen-share video you receive using RealtimeKit's manual
subscription APIs. It adds a **Subscriptions** dialog to the default
`<RtkMeeting />` UI.

See [the subscription handlers](./src/components/ManualSubscriptionsDialog.tsx),
[the control-bar integration](./src/App.tsx), and the
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
http://localhost:5173/manual-subscription/?authToken=YOUR_PARTICIPANT_TOKEN
```

Use the port shown by Vite. To try subscriptions, join the same meeting in another
tab or browser with a different participant token, then open **Subscriptions**
and enable **Manual subscription mode**.

Optional query parameters:

- `baseURI`: overrides the SDK base URL.
- `logInConsole=true`: enables SDK console logging.

## Build

```sh
pnpm run build
pnpm run preview
```
