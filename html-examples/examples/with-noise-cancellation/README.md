# Noise Cancellation Example

The [default meeting UI](../default-meeting-ui/) with
[`@cloudflare/realtimekit-noise-cancellation@0.1.0-staging.0`](https://www.npmjs.com/package/@cloudflare/realtimekit-noise-cancellation/v/0.1.0-staging.0).

After meeting initialization, attach the meeting to `<rtk-meeting>`, then load
the noise cancellation package with a dynamic import and call
`RealtimeKitNoiseCancellation.init({ meeting })`. Neither loading the package
nor initializing it delays joining. Failures are logged to the console.

The library's default `autoManage: true` enables processing when the microphone
is available, handles mute/unmute and reconnections, and disposes on meeting
leave. It does not unmute the microphone.

From the repository root, run `pnpm install`, then:

```sh
cd html-examples
pnpm set-env
pnpm exec serve examples/with-noise-cancellation
```

Open `http://localhost:3000/?authToken=<your-token>` (use the port printed by
the server). Use `baseURI` in the query string or set `VITE_BASE_URL` before
running `pnpm set-env` for a different API hostname.

[See source](./index.html)
