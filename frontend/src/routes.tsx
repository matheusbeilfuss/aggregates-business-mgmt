import { createBrowserRouter } from "react-router-dom";

import { Login } from "@/modules/auth";
import { Home } from "@/modules/home";
import { Stock, StockEdit, StockReplenish } from "@/modules/stock";
import { Order } from "./modules/order/pages/Order";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/home",
    element: <Home />,
  },
  {
    path: "/orders",
    element: <Order />,
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
