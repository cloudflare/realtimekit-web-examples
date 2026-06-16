import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
  route("api/meetings", "./api/meeting.ts"),
  route("api/participants", "./api/participant.ts"),
  route("api/presets", "./api/preset.ts"),
  layout("./layout.tsx", [
    index("./pages/index.tsx"),
    route("html", "./pages/html.tsx"),
    route("react", "./pages/react.tsx"),
    route("angular", "./pages/angular.tsx"),
    route("meeting", "./pages/meeting.tsx"),
  ]),
  
] satisfies RouteConfig;
