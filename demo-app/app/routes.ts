import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
  layout("./layout.tsx", [
    index("./pages/index.tsx"),
    route("vanilla", "./pages/vanilla/index.tsx"),
    route("react", "./pages/react/index.tsx"),
    route("angular", "./pages/angular/index.tsx"),
    route("meeting", "./pages/meeting/index.tsx"),
  ]),
] satisfies RouteConfig;
