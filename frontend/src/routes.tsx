import { createBrowserRouter } from "react-router-dom";
import { Login } from "./pages/login";
import { Home } from "./pages/home";
import { Stock } from "./pages/stock";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/home",
    element: <Home />,
  },
  {
    path: "/stocks",
    element: <Stock />,
  },
]);
