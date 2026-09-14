import {
  BarChart3,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Dumbbell,
  LayoutDashboard,
  Settings,
  UserCheck,
  Users,
  X,
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

interface AppSidebarProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export default function AppSidebar({
  collapsed = false,
  onToggleCollapse,
  mobileOpen = false,
  onMobileClose,
}: AppSidebarProps) {
  const navigation = (
    <nav className="flex-1 space-y-1 overflow-y-auto p-4">
      {navigationItems.map((item) => {
        const Icon = item.icon;

        return (
          <NavLink
            key={item.href}
            to={item.href}
            end={item.href === "/dashboard"}
            onClick={onMobileClose}
            title={collapsed ? item.label : undefined}
            className={({ isActive }) =>
              [
                "flex items-center rounded-lg py-2.5 text-sm font-medium transition-colors",
                "hover:bg-muted",
                collapsed ? "justify-center px-2" : "gap-3 px-3",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground",
              ].join(" ")
            }
          >
            <Icon className="h-5 w-5 shrink-0" />

            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={[
          "hidden h-screen shrink-0 border-r bg-background lg:flex lg:flex-col",
          "transition-[width] duration-200 ease-in-out",
          collapsed ? "w-20" : "w-64",
        ].join(" ")}
      >
        {/* Logo / Header */}
        <div
          className={[
            "flex h-16 items-center border-b",
            collapsed ? "justify-center px-3" : "gap-3 px-6",
          ].join(" ")}
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Dumbbell className="h-5 w-5" />
          </div>

          {!collapsed && (
            <div className="min-w-0">
              <p className="truncate font-semibold">Gym Management</p>
              <p className="truncate text-xs text-muted-foreground">
                Admin Panel
              </p>
            </div>
          )}
        </div>

        {navigation}

        {/* Bottom section */}
        <div className="border-t p-3">
          {!collapsed && (
            <div className="mb-3 rounded-lg bg-muted/50 p-3">
              <p className="text-xs font-medium">Gym Management SaaS</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Pilot version
              </p>
            </div>
          )}

          <button
            type="button"
            onClick={onToggleCollapse}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className={[
              "flex w-full items-center rounded-lg py-2.5 text-sm",
              "text-muted-foreground hover:bg-muted hover:text-foreground",
              collapsed ? "justify-center px-2" : "gap-3 px-3",
            ].join(" ")}
          >
            {collapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <>
                <ChevronLeft className="h-5 w-5" />
                <span>Collapse sidebar</span>
              </>
            )}
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={[
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col",
          "border-r bg-background shadow-xl",
          "transition-transform duration-200 ease-in-out",
          "lg:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        <div className="flex h-16 items-center justify-between border-b px-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Dumbbell className="h-5 w-5" />
            </div>

            <div className="min-w-0">
              <p className="truncate font-semibold">Gym Management</p>
              <p className="truncate text-xs text-muted-foreground">
                Admin Panel
              </p>
            </div>
          </div>

          <button
            type="button"
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md hover:bg-muted"
            aria-label="Close navigation"
            onClick={onMobileClose}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Mobile navigation always expanded */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {navigationItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.href}
                to={item.href}
                end={item.href === "/dashboard"}
                onClick={onMobileClose}
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

        <div className="border-t p-4">
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="text-xs font-medium">Gym Management SaaS</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Pilot version
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}