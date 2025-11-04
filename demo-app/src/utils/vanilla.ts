import type { FileNode } from "../components/editor/FileTree";

const sampleFiles: FileNode[] = [
  {
    name: "background-effects",
    usecase: "all",
    id: "html-examples/with-background-transformer",
    url: "https://html-examples/with-background-transformer/dist",
    preset: "",
    githubUrl: "https://github.com/cloudflare/realtimekit-web-examples/tree/main/html-examples/examples/with-background-transformer",
    docsUrl: "",
    type: "folder",
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
    usecase: "all",
    id: "html-examples/default-meeting-ui",
    url: "https://html-examples/default-meeting-ui/dist",
    preset: "",
    githubUrl: "https://github.com/cloudflare/realtimekit-web-examples/tree/main/html-examples/examples/default-meeting",
    docsUrl: "",
    type: "folder",
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
    name: "create-your-own-ui",
    usecase: "video",
    id: "html-examples/create-your-own-ui",
    url: "https://html-examples/create-your-own-ui/dist",
    preset: "",
    githubUrl: "https://github.com/cloudflare/realtimekit-web-examples/tree/main/html-examples/examples/create-your-own-ui",
    docsUrl: "",
    type: "folder",
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
    name: "ui-kit-addons",
    usecase: "all",
    id: "html-examples/with-ui-addons",
    url: "https://html-examples/with-ui-addons/dist",
    preset: "",
    githubUrl: "https://github.com/cloudflare/realtimekit-web-examples/tree/main/html-examples/examples/with-ui-addons",
    docsUrl: "",
    type: "folder",
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