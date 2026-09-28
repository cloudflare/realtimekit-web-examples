# Cloudflare RealtimeKit SDK Media Middleware Examples

This repository consists of media middleware example apps created using Cloudflare RealtimeKit Core SDKs, fully customizable UI kits, and third-party media processing libraries.

Guide: https://developers.cloudflare.com/realtime/realtimekit/media-middleware/

## Examples

Here are a few available examples.

1. HTML examples
   A. longpipe-video: virtual backgrounds and blur using [Longpipe](https://longpipe.dev/) <br>

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

2. Change directory to the example you want to try, for example: to use longpipe-video html-example use the following command:

```sh
cd media-middlewares/html-examples/longpipe-video
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

5. Deploy to Cloudflare Workers.

```sh
# Deploy to staging
pnpm deploy:staging

# Deploy to production
pnpm deploy:production
```

## Media Middleware

Media middleware lets you process the local participant's audio and video before RealtimeKit publishes it to other participants in a meeting. Other participants receive the processed `meeting.self.audioTrack` and `meeting.self.videoTrack`, while `meeting.self.rawAudioTrack` and `meeting.self.rawVideoTrack` stay unprocessed.

```js
await meeting.self.addVideoMiddleware(middleware);
await meeting.self.removeVideoMiddleware(middleware);
```

For the full API, frame rendering options and examples, refer to [Media Middleware](https://developers.cloudflare.com/realtime/realtimekit/media-middleware/).
