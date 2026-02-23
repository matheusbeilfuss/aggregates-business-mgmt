import { createBrowserRouter } from "react-router-dom";
import { Login } from "@/modules/auth";
import { PrivateRoute } from "@/modules/auth/components/PrivateRoute";

import { Home } from "@/modules/home";
import { Stock, StockEdit, StockReplenish } from "@/modules/stock";
import { Order } from "./modules/order/pages/Order";
import { OrderAdd } from "./modules/order/pages/OrderAdd";
import { OrderEdit } from "./modules/order/pages/OrderEdit";
import { AuthProvider } from "./modules/auth/context/AuthContext";
import { User } from "./modules/user/pages/User";
import { NotFound } from "./modules/not-found";
import { UsersManage } from "./modules/user/pages/UsersManage";
import { AdminRoute } from "./modules/auth/components/AdminRoute";
import { UserAdd } from "./modules/user/pages/UserAdd";

export const router = createBrowserRouter([
  {
    element: <AuthProvider />,
    children: [
      { path: "/login", element: <Login /> },
      {
        element: <PrivateRoute />,
        children: [
          { index: true, element: <Home /> },
          { path: "orders", element: <Order /> },
          { path: "orders/new", element: <OrderAdd /> },
          { path: "orders/:id", element: <OrderEdit /> },
          { path: "stocks", element: <Stock /> },
          { path: "stocks/:id", element: <StockEdit /> },
          { path: "stocks/:id/replenish", element: <StockReplenish /> },
          { path: "user", element: <User /> },

          {
            element: <AdminRoute />,
            children: [
              { path: "admin/users", element: <UsersManage /> },
              { path: "admin/users/new", element: <UserAdd /> },
            ],
          },
          { path: "*", element: <NotFound /> },
        ],
      },
    ],
  },
]);
