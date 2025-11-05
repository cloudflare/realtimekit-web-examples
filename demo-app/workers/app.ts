import { createRequestHandler, type ServerBuild } from "react-router";
import * as build from "../build/server/index.js";

declare module "react-router" {
  export interface AppLoadContext {
    cloudflare: {
      env: Env;
      ctx: ExecutionContext;
    };
  }
}

const requestHandler = createRequestHandler(build as unknown as ServerBuild, "production");

export default {
  async fetch(request, env, ctx) {
    // Handle static assets first
    const url = new URL(request.url);
    if (url.pathname.startsWith("/assets/") || url.pathname === "/favicon.ico") {
      return env.ASSETS.fetch(request);
    }

    return requestHandler(request, {
      cloudflare: { env, ctx },
    });
  },
} satisfies ExportedHandler<Env>;
