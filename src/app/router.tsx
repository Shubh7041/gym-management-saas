import { createBrowserRouter, Navigate } from "react-router-dom";

import { ProtectedRoute } from "@/features/auth/components/ProtectedRoute";
import { LoginPage } from "@/features/auth/pages/LoginPage";
import { DashboardPage } from "@/pages/DashboardPage";
import DashboardLayout from "@/layouts/DashboardLayout";
import MembersPage from "@/features/members/pages/MembersPage";
import AddMemberPage from "@/features/members/pages/AddMemberPage";
import MemberDetailsPage from "@/features/members/pages/MemberDetailsPage";
import EditMemberPage from "@/features/members/pages/EditMemberPage";
import AddMembershipPlanPage from "@/features/memberships/pages/AddMembershipPlanPage";
import MembershipPlansPage from "@/features/memberships/pages/MembershipPlansPage";
import EditMembershipPlanPage from "@/features/memberships/pages/EditMembershipPlanPage";
import MembershipPlanDetailsPage from "@/features/memberships/pages/MembershipPlanDetailsPage";
import AddMemberSubscriptionPage from "@/features/memberships/pages/AddMemberSubscriptionPage";
import { PublicRoute } from "@/features/auth/components/PublicRoute";

export const router = createBrowserRouter([
  {
    element: <PublicRoute />,
    children: [
      {
        path: "/login",
        element: <LoginPage />,
      },
    ],
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
          {
            path: "membership-plans/new",
            element: <AddMembershipPlanPage />,
          },
          {
            path: "membership-plans",
            element: <MembershipPlansPage />,
          },
          {
            path: "membership-plans/:id/edit",
            element: <EditMembershipPlanPage />,
          },
          {
            path: "membership-plans/:id",
            element: <MembershipPlanDetailsPage />,
          },
          {
            path: "subscriptions/new",
            element: <AddMemberSubscriptionPage />,
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/login" replace />,
  },
  // {
  //   path: "*",
  //   element: <LoginPage />,
  // },
]);
