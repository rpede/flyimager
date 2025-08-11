import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router";
import { router } from "./router.ts";
import { Configuration, DefaultConfig } from "./api/runtime.ts";

DefaultConfig.config = new Configuration({
  credentials: "include",
  basePath: `${location.origin}/api`,
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
