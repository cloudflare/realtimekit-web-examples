import { writeFileSync, cpSync, mkdirSync } from 'fs';
import { join } from 'path';

// Copy server build to client directory
const serverSrc = join(process.cwd(), 'build/server');
const serverDest = join(process.cwd(), 'build/client/server');

mkdirSync(serverDest, { recursive: true });
cpSync(serverSrc, serverDest, { recursive: true });

// Create _worker.js that imports the server build
const workerContent = `import { createRequestHandler } from "react-router";
import * as build from "./client/server/index.js";

const requestHandler = createRequestHandler(build, "production");

export default {
  async fetch(request, env, ctx) {
    return requestHandler(request, {
      cloudflare: { env, ctx },
    });
  },
};
`;

writeFileSync(
  join(process.cwd(), 'build/_worker.js'),
  workerContent,
  'utf-8'
);

console.log('✓ Copied server build to client directory');
console.log('✓ Created _worker.js for Workers deployment');
