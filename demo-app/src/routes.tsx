// @ts-expect-error - NOTE(ikabra): React is needed for JSX transformation in Workers build
import React from "react";
import { type RouteObject } from "react-router-dom";
import Layout from "./layout";
import VanillaExample from "./pages/vanilla";
import ReactExample from "./pages/react";
import AngularExample from "./pages/angular";
import Meeting from "./pages/meeting";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Layout />, // wraps Header/Footer etc.
    children: [
      { path: "vanilla", element: <VanillaExample /> },
      { path: "react", element: <ReactExample /> },
      { path: "angular", element: <AngularExample /> },
      { path: "/meeting", element: <Meeting /> },
      { index: true, element: <ReactExample /> }, // redirect "/" to "/react"
    ],
  },
];

export default routes;
