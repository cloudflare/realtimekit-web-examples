import { renderToString } from "react-dom/server";
import {
  createStaticHandler,
  createStaticRouter,
  StaticRouterProvider,
  type StaticHandlerContext,
} from "react-router-dom";
import routes from "./routes";

export async function handleRequest(request: Request) {
  const handler = createStaticHandler(routes);
  const context = (await handler.query(request)) as StaticHandlerContext;
  const router = createStaticRouter(handler.dataRoutes, context);

  const html = renderToString(
    <StaticRouterProvider router={router} context={context} />
  );

  return new Response(
    `<!DOCTYPE html>
    <html>
      <head><meta charset="utf-8" /><title>React Router Worker</title></head>
      <body><div id="root">${html}</div>
      <script type="module" src="/src/entry-client.tsx"></script></body>
    </html>`,
    { headers: { "Content-Type": "text/html" } }
  );
}
