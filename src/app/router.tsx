import { createBrowserRouter } from "react-router-dom";

import { ProtectedRoute } from "@/features/auth/components/ProtectedRoute";
import { LoginPage } from "@/features/auth/pages/LoginPage";
import { DashboardPage } from "@/pages/DashboardPage";
import DashboardLayout from "@/layouts/DashboardLayout";
import MembersPage from "@/features/members/pages/MembersPage";
import AddMemberPage from "@/features/members/pages/AddMemberPage";
import MemberDetailsPage from "@/features/members/pages/MemberDetailsPage";
import EditMemberPage from "@/features/members/pages/EditMemberPage";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },

  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/dashboard",
        element: <DashboardLayout />,
        children: [
          {
            index: true,
            element: <DashboardPage />,
          },
          {
            path: "members",
            element: <MembersPage />,
          },
          {
            path: "members/new",
            element: <AddMemberPage />,
          },
          {
            path: "members/:id",
            element: <MemberDetailsPage />,
          },
          {
            path: "members/:id/edit",
            element: <EditMemberPage />,
          },
        ],
      },
    ],
  },

  {
    path: "*",
    element: <LoginPage />,
  },
]);
