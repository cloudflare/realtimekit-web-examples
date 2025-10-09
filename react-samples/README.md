# Cloudflare RealtimeKit React UI Samples

## Contents
1. [Introduction](#introduction)
2. [About This Repository](#about-this-repository)
3. [Setting Up the Project](#setting-up-the-project)
   - [Prerequisites](#prerequisites)
   - [Installation Steps](#installation-steps)
4. [Usage](#usage)
5. [Contributing](#contributing)
6. [License](#license)

## Introduction

This repository consists of all the different ways in which you can use Cloudflare RealtimeKit's
React UI and other packages to its full extent to get the best live
audio/video experience.

## Samples

Here are the list of available samples at the moment.

1. [Default Meeting UI](./samples/default-meeting-ui/)
2. [Using Background Transformer to modify your background](./samples/with-background-transformer/)
3. [Audio Room](./samples/audio-room/)
4. [Facetime](./samples/facetime/)
5. [Chat](./samples/chat/)
6. [Live Auction App](./samples/live-auction/)

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

2. Change directory to the sample you want to try, for example: in
   `default-meeting-ui`:

```sh
cd samples/default-meeting-ui
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
