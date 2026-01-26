import { createBrowserRouter } from "react-router-dom";
import { Login } from "./modules/auth/pages/Login";
import { Home } from "./modules/home/pages/Home";
import { Stock } from "./modules/stock/pages/Stock";
import { StockEdit } from "./modules/stock/pages/StockEdit";
import { StockReplenish } from "./modules/stock/pages/StockReplenish";

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
