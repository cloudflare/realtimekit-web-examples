# Cloudflare RealtimeKit SDK Recording App Samples 

This repository consists of recording sample apps created using Cloudflare RealtimeKit Recording SDK, our Core SDKs, and, fully customizeable UI kits.

Guide: https://docs.realtime.cloudflare.com/guides/recording/create-record-app-using-sdks

## Samples

Here are a few available samples.

1. React samples
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

Once you're done, you'll get an `authToken`, which you can use in a sample as explained below.

Here are steps to try out the samples:

1. Clone the repo:

```sh
git clone https://github.com/cloudflare/realtimekit-web-samples.git
```

2. Change directory to the sample you want to try, for example: to use recording-with-watermark react-sample use the following command:

```sh
cd react-samples/recording-with-watermark
```

3. Install the packages with your preferred package manager and start a
   development server and open up the page.

```sh
npm install
# and to start a dev server
npm run dev
```

4. Load the dev server in your browser and make sure you pass the `authToken`
   query in the URL.

```
http://localhost:5173/?authToken=<your-token>
```
5. Deploy your app using Vercel.

```sh
npm install -g vercel
vercel
```
