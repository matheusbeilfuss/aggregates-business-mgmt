import { createBrowserRouter } from "react-router-dom";
import { Login } from "./pages/Login";
import { Home } from "./pages/Home";
import { Stock } from "./pages/Stock";
import { StockEdit } from "./pages/StockEdit";
import { StockReplenish } from "./pages/StockReplenish";

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
  {
    path: "/stocks/:id",
    element: <StockEdit />,
  },
  {
    path: "/stocks/:id/replenish",
    element: <StockReplenish />,
  },
]);
