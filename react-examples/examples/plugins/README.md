# RealtimeKit Custom Plugins Example

This example demonstrates how to register and use custom plugins in a RealtimeKit meeting.

Custom plugins are interactive apps that run inside a RealtimeKit meeting. You build and maintain them to meet your application's requirements.

> [!WARNING]
> The Whiteboard, DocShare, and Streamer plugins in this example are for demonstration purposes only. They are not actively maintained or supported for production use. Do not rely on them in your application; they may change or stop working without notice.

## What this example demonstrates

- Creating plugin components with iframes
- Registering plugins through `defaults.plugins` during `initMeeting()`
- Rendering plugins with the RealtimeKit UI Kit

A custom plugin can be any `HTMLElement`, including a custom web component, a React application mounted in a container, or an iframe.

## Learn more

- [Build your own plugins](https://developers.cloudflare.com/realtime/realtimekit/custom-plugins/build-your-own-plugins/)
- [Plugins API reference](https://developers.cloudflare.com/realtime/realtimekit/core/plugins/)

## Run locally

From the repository root:

```bash
pnpm install-all
cd react-examples/examples/plugins
pnpm dev
```

Open the app with a RealtimeKit authentication token:

```text
http://localhost:5173/plugins/?authToken=<your-auth-token>
```
