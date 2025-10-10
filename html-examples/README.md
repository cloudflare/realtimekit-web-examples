# Cloudflare RealtimeKit - HTML Examples

This repository consists of all the different ways in which you can use Cloudflare RealtimeKit and other packages to its full extent to get the best live audio/video experience.

## Examples

Here are the list of available examples at the moment.

1. [Default Meeting UI](./examples/default-meeting-ui/)
2. [Using Background Transformer to modify your background](./examples/with-background-transformer/)
3. [Background Transformer UI example](./examples/background-transformer-ui/)
4. [Create Your Own UI](./examples/create-your-own-ui/)
5. [With UI Addons](./examples/with-ui-addons/)

## Usage

First, you'll need to create a meeting and add a participant to that meeting.

You can do so by following the [Cloudflare RealtimeKit documentation](https://developers.cloudflare.com/realtime/realtimekit/).

Make sure you've created your Cloudflare account at https://dash.cloudflare.com/ and have your `Account ID` and `API Token` ready.

1. Follow the [Cloudflare RealtimeKit documentation](https://developers.cloudflare.com/realtime/realtimekit/) to create a new Room.
2. Create a new Session Token to join the room.

Once you're done, you'll get an `authToken`, which you can use in an example as explained below.

### Trying out an example

Here are steps to try out the examples:

1. Clone the repo:

```sh
git clone https://github.com/cloudflare/realtimekit-web-examples.git
cd html-examples
```

2. Install the packages with your preferred package manager and start a server,
   for example: `default-meeting-ui`.

```sh
npm install
# and to start a server
npx serve examples/default-meeting-ui
```

3. Load the server in your browser and make sure you pass the `authToken` query
   in the URL.

```
http://localhost:3000/?authToken=<your-token>
```
