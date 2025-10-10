# Cloudflare RealtimeKit - HTML Samples

This repository consists of all the different ways in which you can use Cloudflare RealtimeKit and other packages to its full extent to get the best live audio/video experience.

## Samples

Here are the list of available samples at the moment.

1. [Default Meeting UI](./samples/default-meeting-ui/)
2. [Using Background Transformer to modify your background](./samples/with-background-transformer/)
3. [Background Transformer UI sample](./samples/background-transformer-ui/)
4. [Create Your Own UI](./samples/create-your-own-ui/)
5. [With UI Addons](./samples/with-ui-addons/)

## Usage

First, you'll need to create a meeting and add a participant to that meeting.

You can do so by following the [Cloudflare RealtimeKit documentation](https://developers.cloudflare.com/realtime/realtimekit/).

Make sure you've created your Cloudflare account at https://dash.cloudflare.com/ and have your `Account ID` and `API Token` ready.

1. Follow the [Cloudflare RealtimeKit documentation](https://developers.cloudflare.com/realtime/realtimekit/) to create a new Room.
2. Create a new Session Token to join the room.

Once you're done, you'll get an `authToken`, which you can use in a sample as explained below.

### Trying out a sample

Here are steps to try out the samples:

1. Clone the repo:

```sh
git clone https://github.com/cloudflare/realtimekit-web-samples.git
cd html-samples
```

2. Install the packages with your preferred package manager and start a server,
   for example: `default-meeting-ui`.

```sh
npm install
# and to start a server
npx serve samples/default-meeting-ui
```

3. Load the server in your browser and make sure you pass the `authToken` query
   in the URL.

```
http://localhost:3000/?authToken=<your-token>
```
