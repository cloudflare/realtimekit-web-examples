import type { FileNode } from "../components/editor/FileTree";

const sampleFiles: FileNode[] = [
  {
    name: "create-your-own-ui",
    id: "angular-examples/create-your-own-ui",
    type: "folder",
    url: "https://angular-examples.cf-realtime.workers.dev/create-your-own-ui",
    usecase: "video",
    preset: "",
    githubUrl: "https://github.com/cloudflare/realtimekit-web-examples/tree/main/angular-examples/examples/create-your-own-ui",
    docsUrl: "",
    children: [
      {
        name: "create.ts",
        type: "file",
        content: "// creates a new meeting",
      },
      {
        name: "join.ts",
        type: "file",
        content: "// joins an existing meeting",
      },
    ],
  },
  {
    name: "default-meeting",
    id: "angular-examples/default-meeting-ui",
    type: "folder",
    url: "https:/angular-examples.cf-realtime.workers.dev/default-meeting-ui",
    usecase: "all",
    preset: "",
    githubUrl: "https://github.com/cloudflare/realtimekit-web-examples/tree/main/angular-examples/examplesdefault-meeting",
    docsUrl: "",
    children: [
      {
        name: "create.ts",
        type: "file",
        content: "// creates a new meeting",
      },
      {
        name: "join.ts",
        type: "file",
        content: "// joins an existing meeting",
      },
    ],
  },
  {
    name: "background-effects",
    id: "angular-examples/with-video-transformer",
    type: "folder",
    url: "https://angular-examples.cf-realtime.workers.dev/with-video-transformer",
    usecase: "all",
    preset: "",
    githubUrl: "https://github.com/cloudflare/realtimekit-web-examples/tree/main/angular-examples/examples/with-video-transformer",
    docsUrl: "",
    children: [
      {
        name: "create.ts",
        type: "file",
        content: "// creates a new meeting",
      },
      {
        name: "join.ts",
        type: "file",
        content: "// joins an existing meeting",
      },
    ],
  }
];

export default sampleFiles;