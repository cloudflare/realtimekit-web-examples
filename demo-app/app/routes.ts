import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
  layout("./layout.tsx", [
    index("./pages/index.tsx"),
    route("html", "./pages/html.tsx"),
    route("react", "./pages/react.tsx"),
    route("angular", "./pages/angular.tsx"),
    route("meeting", "./pages/meeting.tsx"),
  ]),
  
] satisfies RouteConfig;
