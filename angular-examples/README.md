# Cloudflare RealtimeKit Angular UI Examples

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

Cloudflare RealtimeKit is designed to enable seamless and efficient video interactions in various applications, ranging from virtual meetings to interactive live streaming. The offerings are known for their robust performance, scalability, and ease of integration.

## About This Repository
This repository consists of all the different ways in which you can use Cloudflare RealtimeKit's
Angular UI Kit and other packages to its full extent to get the best live
audio/video experience.

## Examples

Here are the list of available examples at the moment.

1. [Default Meeting UI](./examples/default-meeting-ui/)
2. [Using Background Transformer to modify your background](./examples/with-background-transformer/)
3. [Create Your Own UI](./examples/create-your-own-ui/)

## Usage

To use these examples you would need to do the following steps:

First, you'll need to create a meeting and add a participant to that meeting.

You can do so by following the [Cloudflare RealtimeKit documentation](https://developers.cloudflare.com/realtime/realtimekit/).

Make sure you've created your Cloudflare account at https://dash.cloudflare.com/ and have your `Account ID` and `API Token` ready.

1. Follow the [Cloudflare RealtimeKit documentation](https://developers.cloudflare.com/realtime/realtimekit/) to create a new Room.
2. Create a new Session Token to join the room.

Once you're done, you'll get an `authToken`, which you can use in an example as
explained below.

### Trying out an example

Here are steps to try out the examples:

1. Clone the repo:

```sh
git clone https://github.com/cloudflare/realtimekit-web-examples.git
```

2. Change directory to the example you want to try, for example: in
   `default-meeting-ui`:

```sh
cd examples/default-meeting-ui
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
http://localhost:4200/?authToken=<your-token>
```
