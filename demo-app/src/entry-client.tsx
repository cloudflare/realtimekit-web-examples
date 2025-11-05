import { hydrateRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import routes from "./routes";

const router = createBrowserRouter(routes);
hydrateRoot(document, <RouterProvider router={router} />);
