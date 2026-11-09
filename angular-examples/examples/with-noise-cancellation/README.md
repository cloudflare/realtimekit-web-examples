# Noise Cancellation Example

The [default meeting UI](../default-meeting-ui/) with [`@cloudflare/realtimekit-noise-cancellation@0.1.0`](https://www.npmjs.com/package/@cloudflare/realtimekit-noise-cancellation/v/0.1.0).

After `RealtimeKitClient.init()` resolves, attach the meeting to the UI and start noise cancellation without awaiting it:

```ts
void RealtimeKitNoiseCancellation.init({ meeting }).catch(console.warn);
```

The library's default `autoManage: true` enables processing when the microphone is available, handles mute/unmute and reconnections, and disposes on meeting leave. It does not unmute the microphone. Joining stays available while processing loads; initialization failures are logged to the console.

From the repository root, run `pnpm install`, then:

```sh
cd angular-examples/examples/with-noise-cancellation
pnpm dev
```

Open `http://localhost:4200/?authToken=<your-token>`. Use `baseURI` in the query string for a different API hostname, or set `VITE_BASE_URL` before running `pnpm set-env` or `pnpm build`.

[See source](./src/app/app.component.ts)
