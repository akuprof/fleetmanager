import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import AdminDashboard from "@/pages/dashboard/admin";
import ManagerDashboard from "@/pages/dashboard/manager";
import DriverDashboard from "@/pages/dashboard/driver";
import Vehicles from "@/pages/vehicles";
import Drivers from "@/pages/drivers";
import Trips from "@/pages/trips";
import Expenses from "@/pages/expenses";
import Payouts from "@/pages/payouts";
import Reports from "@/pages/reports";

function Router() {
  const { user, isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Switch>
      {!isAuthenticated ? (
        <Route path="/" component={Landing} />
      ) : (
        <>
          <Route path="/">
            {user?.role === "admin" && <AdminDashboard />}
            {user?.role === "manager" && <ManagerDashboard />}
            {user?.role === "driver" && <DriverDashboard />}
          </Route>
          {(user?.role === "admin" || user?.role === "manager") && (
            <>
              <Route path="/vehicles" component={Vehicles} />
              <Route path="/drivers" component={Drivers} />
              <Route path="/trips" component={Trips} />
              <Route path="/expenses" component={Expenses} />
              <Route path="/payouts" component={Payouts} />
              <Route path="/reports" component={Reports} />
            </>
          )}
          {user?.role === "driver" && (
            <>
              <Route path="/trips" component={Trips} />
              <Route path="/payouts" component={Payouts} />
            </>
          )}
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
