import { createBrowserRouter } from "react-router-dom";
import App from "./App";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <div>Home Page</div>,
  },
  {
    path: "/login",
    element: <div>Login Page</div>,
  },
  {
    path: "/dashboard",
    element: <div>Dashboard Page</div>,
  },
  {
    path: "/test",
    element: (
      <div>
        <App />
      </div>
    ),
  },
]);
