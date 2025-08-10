import { createBrowserRouter } from "react-router";
import Root from "./root";
import { HomePage, homePageLoader } from "./pages/home-page";
import LoginPage from "./pages/login-page";
import RegisterPage from "./pages/register-page";
import UploadsPage, { uploadsLoader } from "./pages/uploads-page";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      {
        index: true,
        Component: HomePage,
        loader: homePageLoader,
      },
      {
        path: "/login",
        Component: LoginPage,
      },
      {
        path: "/register",
        Component: RegisterPage,
      },
      {
        path: "/uploads",
        Component: UploadsPage,
        loader: uploadsLoader,
      },
    ],
  },
]);
