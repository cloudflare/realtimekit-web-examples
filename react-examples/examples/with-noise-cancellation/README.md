# Noise Cancellation Example

The [default meeting UI](../default-meeting-ui/) with
[`@cloudflare/realtimekit-noise-cancellation`](https://www.npmjs.com/package/@cloudflare/realtimekit-noise-cancellation).

After `initMeeting()` resolves, start noise cancellation without awaiting it:

```ts
void RealtimeKitNoiseCancellation.init({ meeting }).catch(console.warn);
```

The library's default `autoManage: true` enables processing when the microphone
is available, handles mute/unmute and reconnections, and disposes on meeting
leave. It does not unmute the microphone. Joining stays available while
processing loads; initialization failures are logged to the console.

From the repository root, run `pnpm install`, then:

```sh
cd react-examples/examples/with-noise-cancellation
pnpm dev
```

Open `http://localhost:5173/with-noise-cancellation/?authToken=<your-token>`.
Use `baseURI` in the query string or `VITE_BASE_URL` for a different API
hostname.

[See source](./src/App.tsx)
