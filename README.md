<!-- PROJECT LOGO -->
<p align="center">
  <a href="https://cloudflare.com">
    <img src="https://cf-assets.www.cloudflare.com/slt3lc6tev37/6EYsdkdfBcHtgPmgp3YtkD/0b203affd2053988264b9253b13de6b3/logo-thumbnail.png" alt="Logo" width="180">
  </a>
  <h3 align="center">RealtimeKit Web Samples</h3>

  <p align="center">
    A collection of sample applications to demonstrate the power of Cloudflare RealtimeKit.
    <br />
    <a href="https://developers.cloudflare.com/realtime/realtimekit/"><strong>Explore the RealtimeKit docs »</strong></a>
    <br />
    <br />
    <a href="https://demo.realtime.cloudflare.com">View Demo</a>
    ·
    <a href="https://community.cloudflare.com/">Report Bug</a>
</p>



<!-- TABLE OF CONTENTS -->

## Table of Contents

* [About the Project](#about-the-project)
* [Getting Started](#getting-started)
  * [Prerequisites](#prerequisites)
  * [Installation](#installation)
* [Running the Samples](#running-the-samples)
* [About](#about)



<!-- ABOUT THE PROJECT -->
## About The Project

This repository contains a collection of sample applications built with [Cloudflare RealtimeKit](https://github.com/cloudflare/realtimekit), a real-time video and audio SDK for building custom, collaborative communication experiences.

These samples demonstrate how to integrate RealtimeKit into various web frameworks, including:
* [React](./react-samples/)
* [Angular](./angular-samples/)
* [Vue](./vue-samples/)
* [HTML](./html-samples/)


<!-- GETTING STARTED -->
## Getting Started

To get a local copy up and running follow these simple steps.

### Prerequisites

This project uses [pnpm](https://pnpm.io/) as a package manager. You can install it with npm:
* npm
  ```sh
  npm install -g pnpm
  ```

### Installation

1. Clone the repository
```sh
git clone https://github.com/cloudflare/realtimekit-web-samples.git
```

2. Navigate to the project directory
```sh
cd realtimekit-web-samples
```

3. Install dependencies from the root of the monorepo
```sh
pnpm install
```

<!-- RUNNING THE SAMPLES -->
## Running the Samples

Each sample is a self-contained application. To run a specific sample:

1. Navigate to the sample's directory. For example:
```sh
cd react-samples/samples/default-meeting-ui
```

2. Start the development server:
```sh
pnpm run dev
```

_For more detailed instructions, please refer to the `README.md` file within each sample's directory._

## About

`@cloudflare/realtimekit` is created & maintained by Cloudflare, Inc.
