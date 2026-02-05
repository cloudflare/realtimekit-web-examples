const env = import.meta.env.VITE_ENV;
const htmlExamplesDomain =
  env === "production"
    ? "html-examples.realtime.cloudflare.com"
    : "html-examples-staging.realtime.cloudflare.com";
const sampleFiles = [
  {
    name: "background-effects",
    platform: "web",
    usecase: "all",
    id: "html-examples/with-background-transformer",
    url: `https://${htmlExamplesDomain}/with-background-transformer`,
    preset: "",
    picture: "https://rtk-assets.realtime.cloudflare.com/examples/Video%20Calling%20App%20with%20AR%20Filters.png",
    githubUrl: "https://github.com/cloudflare/realtimekit-web-examples/tree/main/html-examples/examples/with-background-transformer",
    description: "Add background blur/replacement to live video in a vanilla JS calling UI.",
    blogUrl:"",
  },
  {
    name: "default-meeting",
    platform: "web",
    usecase: "all",
    id: "html-examples/default-meeting-ui",
    url: `https://${htmlExamplesDomain}/default-meeting-ui`,
    preset: "",
    githubUrl: "https://github.com/cloudflare/realtimekit-web-examples/tree/main/html-examples/examples/default-meeting",
    picture: "https://rtk-assets.realtime.cloudflare.com/examples/Video%20Calling%20App%20-%20React.png",
    description: "A ready-to-run vanilla JS meeting UI using the default RealtimeKit experience.",
    blogUrl:"",
  },
  {
    name: "create-your-own-ui",
    platform: "web",
    usecase: "video",
    id: "html-examples/create-your-own-ui",
    url: `https://${htmlExamplesDomain}/create-your-own-ui`,
    preset: "Video Call Host Demo",
    githubUrl: "https://github.com/cloudflare/realtimekit-web-examples/tree/main/html-examples/examples/create-your-own-ui",
    description: "A vanilla JS starter for building a custom meeting UI without a framework.",
    blogUrl:"",
    picture: "https://rtk-assets.realtime.cloudflare.com/examples/Transcription%20in%20Video%20Calling%20App.png",
  },
  {
    name: "ui-kit-addons",
    platform: "web",
    usecase: "all",
    id: "html-examples/with-ui-addons",
    url: `https://${htmlExamplesDomain}/with-ui-addons`,
    preset: "",
    picture: "https://rtk-assets.realtime.cloudflare.com/examples/Chess%20with%20Live%20Video%20Calling.png",
    githubUrl: "https://github.com/cloudflare/realtimekit-web-examples/tree/main/html-examples/examples/with-ui-addons",
    description: "A vanilla JS meeting UI showcasing optional UI add-ons and enhancements.",
    blogUrl:"",
  }
];

export default sampleFiles;