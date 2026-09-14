import {
  BarChart3,
  CreditCard,
  Dumbbell,
  LayoutDashboard,
  Settings,
  Users,
  UserCheck,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const navigationItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Members",
    href: "/dashboard/members",
    icon: Users,
  },
  {
    label: "Memberships",
    href: "/dashboard/memberships",
    icon: UserCheck,
  },
  {
    label: "Payments",
    href: "/dashboard/payments",
    icon: CreditCard,
  },
  {
    label: "Attendance",
    href: "/dashboard/attendance",
    icon: Dumbbell,
  },
  {
    label: "Reports",
    href: "/dashboard/reports",
    icon: BarChart3,
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export default function AppSidebar() {
  return (
    <aside className="hidden h-screen w-64 shrink-0 border-r bg-background lg:flex lg:flex-col">
      {/* Logo / Gym Name */}
      <div className="flex h-16 items-center gap-3 border-b px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Dumbbell className="h-5 w-5" />
        </div>

        <div className="min-w-0">
          <p className="truncate font-semibold">
            Gym Management
          </p>

          <p className="truncate text-xs text-muted-foreground">
            Admin Panel
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {navigationItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.href}
              to={item.href}
              end={item.href === "/dashboard"}
              className={({ isActive }) =>
                [
                  "flex items-center gap-3 rounded-lg px-3 py-2.5",
                  "text-sm font-medium transition-colors",
                  "hover:bg-muted",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground",
                ].join(" ")
              }
            >
              <Icon className="h-5 w-5 shrink-0" />

              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t p-4">
        <div className="rounded-lg bg-muted/50 p-3">
          <p className="text-xs font-medium">
            Gym Management SaaS
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            Pilot version
          </p>
        </div>
      </div>
    </aside>
  );
}