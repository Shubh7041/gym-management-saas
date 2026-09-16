import {
  BarChart3,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Dumbbell,
  LayoutDashboard,
  Settings,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import { NavLink } from "react-router-dom";

type NavigationItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

const navigationItems: NavigationItem[] = [
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
    label: "Membership Plans",
    href: "/dashboard/membership-plans",
    icon: CreditCard,
  },
  {
    label: "Subscriptions",
    href: "/dashboard/subscriptions",
    icon: CreditCard,
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
  const renderNavigation = (mobile = false) => (
    <nav className="flex-1 overflow-y-auto px-3 py-4">
      <div className="space-y-1">
        {navigationItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.href}
              to={item.href}
              end={item.href === "/dashboard"}
              onClick={onMobileClose}
              title={!mobile && collapsed ? item.label : undefined}
              className={({ isActive }) =>
                [
                  "group relative flex items-center rounded-xl",
                  "py-2.5 text-sm font-medium",
                  "transition-all duration-150",
                  mobile || !collapsed
                    ? "gap-3 px-3"
                    : "justify-center px-2",
                  isActive
                    ? [
                        "bg-primary/10 text-primary",
                        "before:absolute before:left-0 before:h-6 before:w-1",
                        "before:rounded-r-full before:bg-primary",
                      ].join(" ")
                    : [
                        "text-slate-600",
                        "hover:bg-slate-100 hover:text-slate-900",
                      ].join(" "),
                ].join(" ")
              }
            >
              <Icon className="h-5 w-5 shrink-0" />

              {(mobile || !collapsed) && (
                <span className="truncate">{item.label}</span>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={[
          "hidden h-screen shrink-0 border-r border-slate-200 bg-white",
          "lg:flex lg:flex-col",
          "transition-[width] duration-200 ease-in-out",
          collapsed ? "w-20" : "w-64",
        ].join(" ")}
      >
        {/* Logo */}
        <div
          className={[
            "flex h-16 shrink-0 items-center border-b border-slate-200",
            collapsed
              ? "justify-center px-3"
              : "gap-3 px-5",
          ].join(" ")}
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <Dumbbell className="h-5 w-5" />
          </div>

          {!collapsed && (
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-900">
                Gym Management
              </p>

              <p className="truncate text-xs text-slate-500">
                Admin Panel
              </p>
            </div>
          )}
        </div>

        {/* Navigation */}
        {renderNavigation()}

        {/* Bottom Section */}
        <div className="shrink-0 border-t border-slate-200 p-3">
          {!collapsed && (
            <div className="mb-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs font-semibold text-slate-700">
                Gym Management SaaS
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Pilot version
              </p>
            </div>
          )}

          <button
            type="button"
            onClick={onToggleCollapse}
            title={
              collapsed
                ? "Expand sidebar"
                : "Collapse sidebar"
            }
            className={[
              "flex w-full items-center rounded-xl",
              "py-2.5 text-sm font-medium",
              "text-slate-500",
              "transition-colors",
              "hover:bg-slate-100 hover:text-slate-900",
              collapsed
                ? "justify-center px-2"
                : "gap-3 px-3",
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
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-[1px] lg:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={[
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col",
          "border-r border-slate-200 bg-white shadow-2xl",
          "transition-transform duration-200 ease-in-out",
          "lg:hidden",
          mobileOpen
            ? "translate-x-0"
            : "-translate-x-full",
        ].join(" ")}
      >
        {/* Mobile Header */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 px-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <Dumbbell className="h-5 w-5" />
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-900">
                Gym Management
              </p>

              <p className="truncate text-xs text-slate-500">
                Admin Panel
              </p>
            </div>
          </div>

          <button
            type="button"
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
            aria-label="Close navigation"
            onClick={onMobileClose}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Mobile Navigation */}
        {renderNavigation(true)}

        {/* Mobile Bottom */}
        <div className="shrink-0 border-t border-slate-200 p-4">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs font-semibold text-slate-700">
              Gym Management SaaS
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Pilot version
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}