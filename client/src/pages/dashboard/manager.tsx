import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import MetricsCards from "@/components/dashboard/metrics-cards";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Car, Clock, CheckCircle, AlertTriangle, CreditCard } from "lucide-react";

export default function ManagerDashboard() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: drivers } = useQuery({
    queryKey: ["/api/drivers"],
    retry: false,
  });

  const { data: recentTrips } = useQuery({
    queryKey: ["/api/dashboard/recent-trips/5"],
    retry: false,
  });

  const { data: pendingPayouts } = useQuery({
    queryKey: ["/api/payouts/pending"],
    retry: false,
  });

  const { data: alerts } = useQuery({
    queryKey: ["/api/alerts/unread"],
    retry: false,
  });

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const activeDrivers = drivers?.filter((driver: any) => driver.isActive) || [];
  const inactiveDrivers = drivers?.filter((driver: any) => !driver.isActive) || [];

  return (
    <div className="flex h-screen bg-background">
      <Sidebar userRole={user?.role || "manager"} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Manager Dashboard" />
        
        <main className="flex-1 overflow-auto p-6">
          <MetricsCards />

          {/* Manager Specific Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Drivers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" data-testid="text-active-drivers">
                  {activeDrivers.length}
                </div>
                <p className="text-xs text-muted-foreground">
                  {inactiveDrivers.length} inactive
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Payouts</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" data-testid="text-pending-payouts">
                  {pendingPayouts?.length || 0}
                </div>
                <p className="text-xs text-green-600">
                  ₹{pendingPayouts?.reduce((sum: number, p: any) => sum + parseFloat(p.amount), 0).toFixed(0) || 0} total
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Service Alerts</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" data-testid="text-service-alerts">
                  {alerts?.filter((alert: any) => alert.type === 'service_due').length || 0}
                </div>
                <p className="text-xs text-amber-600">
                  Vehicles need attention
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Today's Trips</CardTitle>
                <Car className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" data-testid="text-todays-trips">
                  {recentTrips?.filter((trip: any) => {
                    const today = new Date().toDateString();
                    return new Date(trip.startTime).toDateString() === today;
                  }).length || 0}
                </div>
                <p className="text-xs text-blue-600">
                  Completed today
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Driver Overview */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-semibold">Driver Overview</CardTitle>
                <Button variant="ghost" size="sm" data-testid="button-manage-drivers">
                  Manage All
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activeDrivers.slice(0, 5).map((driver: any) => (
                    <div key={driver.id} className="flex items-center justify-between p-3 bg-muted rounded-md" data-testid={`card-driver-${driver.id}`}>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                          <Users className="text-primary-foreground h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground" data-testid={`text-driver-name-${driver.id}`}>
                            Driver #{driver.id.slice(0, 8)}
                          </p>
                          <p className="text-sm text-muted-foreground" data-testid={`text-driver-stats-${driver.id}`}>
                            {driver.totalTrips} trips • ₹{parseFloat(driver.totalEarnings || '0').toFixed(0)}
                          </p>
                        </div>
                      </div>
                      <Badge variant={driver.isActive ? "default" : "secondary"} data-testid={`badge-driver-status-${driver.id}`}>
                        {driver.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  ))}
                  {activeDrivers.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No active drivers</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
                <Button variant="ghost" size="sm" data-testid="button-view-all-activity">
                  View All
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentTrips?.slice(0, 5).map((trip: any) => (
                    <div key={trip.id} className="flex items-center justify-between py-3 border-b border-border last:border-b-0" data-testid={`row-activity-${trip.id}`}>
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 ${
                          trip.status === 'completed' ? 'bg-green-100' : 
                          trip.status === 'in_progress' ? 'bg-blue-100' : 
                          'bg-gray-100'
                        } rounded-full flex items-center justify-center`}>
                          {trip.status === 'completed' ? 
                            <CheckCircle className="text-green-600 h-4 w-4" /> : 
                            <Clock className="text-blue-600 h-4 w-4" />
                          }
                        </div>
                        <div>
                          <p className="font-medium text-foreground" data-testid={`text-activity-description-${trip.id}`}>
                            Trip completed
                          </p>
                          <p className="text-sm text-muted-foreground capitalize" data-testid={`text-activity-vehicle-${trip.id}`}>
                            Vehicle: {trip.vehicleId?.slice(0, 8)}...
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-foreground" data-testid={`text-activity-amount-${trip.id}`}>
                          ₹{parseFloat(trip.totalAmount).toFixed(0)}
                        </p>
                        <p className="text-xs text-muted-foreground" data-testid={`text-activity-time-${trip.id}`}>
                          {new Date(trip.startTime).toLocaleTimeString('en-IN', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                      </div>
                    </div>
                  )) || (
                    <div className="text-center py-8 text-muted-foreground">
                      <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No recent activity</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Pending Tasks */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Pending Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-amber-800">Pending Payouts</h4>
                    <Badge variant="outline" className="text-amber-600 border-amber-300" data-testid="badge-pending-payouts">
                      {pendingPayouts?.length || 0}
                    </Badge>
                  </div>
                  <p className="text-sm text-amber-600 mb-3">
                    Total: ₹{pendingPayouts?.reduce((sum: number, p: any) => sum + parseFloat(p.amount), 0).toFixed(0) || 0}
                  </p>
                  <Button size="sm" variant="outline" className="w-full" data-testid="button-process-payouts">
                    Process Payouts
                  </Button>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-red-800">Service Alerts</h4>
                    <Badge variant="outline" className="text-red-600 border-red-300" data-testid="badge-service-alerts">
                      {alerts?.filter((alert: any) => alert.type === 'service_due').length || 0}
                    </Badge>
                  </div>
                  <p className="text-sm text-red-600 mb-3">
                    Vehicles require immediate attention
                  </p>
                  <Button size="sm" variant="outline" className="w-full" data-testid="button-view-service-alerts">
                    View Details
                  </Button>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-blue-800">Document Expiry</h4>
                    <Badge variant="outline" className="text-blue-600 border-blue-300" data-testid="badge-document-alerts">
                      {alerts?.filter((alert: any) => alert.type === 'insurance_expiry').length || 0}
                    </Badge>
                  </div>
                  <p className="text-sm text-blue-600 mb-3">
                    Insurance renewals due
                  </p>
                  <Button size="sm" variant="outline" className="w-full" data-testid="button-view-document-alerts">
                    Review Documents
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
