import { createBrowserRouter } from "react-router-dom";
import { Login } from "./pages/login";
import { Home } from "./pages/home";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/home",
    element: <Home />,
  },
]);
