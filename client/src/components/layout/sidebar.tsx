import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { 
  Truck, 
  LayoutDashboard, 
  Car, 
  Users, 
  Route, 
  IndianRupee, 
  CreditCard, 
  CreditCard as PayoutIcon, 
  BarChart3, 
  Bell, 
  LogOut 
} from "lucide-react";

interface SidebarProps {
  userRole: string;
}

export default function Sidebar({ userRole }: SidebarProps) {
  const [location] = useLocation();
  const { user } = useAuth();

  const { data: alerts } = useQuery({
    queryKey: ["/api/alerts/unread"],
    retry: false,
  });

  const { data: pendingPayouts } = useQuery({
    queryKey: ["/api/payouts/pending"],
    retry: false,
  });

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  const menuItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      href: "/",
      roles: ["admin", "manager", "driver"],
    },
    {
      title: "Vehicles",
      icon: Car,
      href: "/vehicles",
      roles: ["admin", "manager"],
      badge: alerts?.filter((alert: any) => alert.type === "service_due").length || 0,
      badgeVariant: "destructive" as const,
    },
    {
      title: "Drivers",
      icon: Users,
      href: "/drivers",
      roles: ["admin", "manager"],
    },
    {
      title: "Trips",
      icon: Route,
      href: "/trips",
      roles: ["admin", "manager", "driver"],
      badge: alerts?.filter((alert: any) => alert.type === "accident").length || 0,
      badgeVariant: "default" as const,
    },
    {
      title: "Revenue",
      icon: IndianRupee,
      href: "/revenue",
      roles: ["admin"],
    },
    {
      title: "Expenses",
      icon: CreditCard,
      href: "/expenses",
      roles: ["admin", "manager"],
    },
    {
      title: "Payouts",
      icon: PayoutIcon,
      href: "/payouts",
      roles: ["admin", "manager", "driver"],
      badge: pendingPayouts?.length || 0,
      badgeVariant: "secondary" as const,
    },
    {
      title: "Reports",
      icon: BarChart3,
      href: "/reports",
      roles: ["admin", "manager"],
    },
    {
      title: "Alerts",
      icon: Bell,
      href: "/alerts",
      roles: ["admin", "manager"],
      badge: alerts?.length || 0,
      badgeVariant: "destructive" as const,
    },
  ];

  const visibleItems = menuItems.filter(item => item.roles.includes(userRole));

  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border flex-shrink-0">
      <div className="flex flex-col h-full">
        {/* Logo and Brand */}
        <div className="p-6 border-b border-sidebar-border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-sidebar-primary rounded-lg flex items-center justify-center">
              <Truck className="text-sidebar-primary-foreground text-xl" data-testid="icon-logo" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-sidebar-foreground" data-testid="text-brand-name">FleetFlow</h1>
              <p className="text-sm text-muted-foreground capitalize" data-testid="text-user-role">{userRole} Panel</p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 space-y-2">
          {visibleItems.map((item) => {
            const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
            const Icon = item.icon;
            
            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={cn(
                    "flex items-center space-x-3 p-3 rounded-md transition-colors cursor-pointer",
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )}
                  data-testid={`nav-${item.title.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="flex-1">{item.title}</span>
                  {item.badge && item.badge > 0 && (
                    <Badge 
                      variant={item.badgeVariant} 
                      className="text-xs px-2 py-1 rounded-full"
                      data-testid={`badge-${item.title.toLowerCase().replace(/\s+/g, '-')}-count`}
                    >
                      {item.badge}
                    </Badge>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-sidebar-primary rounded-full flex items-center justify-center">
              <Users className="text-sidebar-primary-foreground h-5 w-5" data-testid="icon-user-avatar" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-sm text-sidebar-foreground" data-testid="text-user-name">
                {user?.firstName || user?.email || "User"}
              </p>
              <p className="text-xs text-muted-foreground capitalize" data-testid="text-user-role-footer">{userRole}</p>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleLogout}
              className="text-muted-foreground hover:text-sidebar-foreground p-2"
              data-testid="button-logout"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </aside>
  );
}
