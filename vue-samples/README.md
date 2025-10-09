# Cloudflare RealtimeKit Vue UI Samples

## Contents

1. [Introduction](#introduction)
2. [About This Repository](#about-this-repository)
3. [Setting Up the Project](#setting-up-the-project)
   - [Prerequisites](#prerequisites)
   - [Running a Sample](#running-a-sample)
4. [Contributing](#contributing)
5. [License](#license)


## Introduction

This repository consists of all the different ways in which you can use Cloudflare RealtimeKit's
Vue UI and other packages to its full extent to get the best live audio/video experience.

## Samples

Here are the list of available samples at the moment.

1. [Default Meeting UI](./samples/default-meeting-ui/)
1. [Default Meeting UI TypeScript](./samples/default-meeting-ts/)

## Setting Up the Project

To use these samples you would need to do the following steps:

### Prerequisites

First, you'll need to create a meeting and add a participant to that meeting.

You can do so by going to https://developers.cloudflare.com/realtime/realtimekit/api-reference/ and run the APIs in the
API runner itself so you can quickly get started.

Make sure you've created your Cloudflare account at https://dash.cloudflare.com/ and have your `Account ID` and `API Token` ready.

1. Follow the [Cloudflare RealtimeKit documentation](https://developers.cloudflare.com/realtime/realtimekit/) to create a new Room.
2. Create a new Session Token to join the room.

Once you're done, you'll get an `authToken`, which you can use in a sample as
explained below.

### Running a Sample

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

### Contributing

Contributions to enhance the functionality or fix issues are welcome. Please adhere to the project's contribution guidelines and code of conduct.

### License

This project is released under the [Apache-2](LICENSE). Please review the license terms before using or contributing to the project.
