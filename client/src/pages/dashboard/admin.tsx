import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import MetricsCards from "@/components/dashboard/metrics-cards";
import RevenueChart from "@/components/dashboard/revenue-chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Car, Users, Plus, FileText, Bell, Clock, CheckCircle, AlertTriangle, Wrench, CreditCard } from "lucide-react";

export default function AdminDashboard() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const { toast } = useToast();

  // Redirect if not authenticated
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

  const { data: topVehicles } = useQuery({
    queryKey: ["/api/dashboard/top-vehicles/3"],
    retry: false,
  });

  const { data: recentTrips } = useQuery({
    queryKey: ["/api/dashboard/recent-trips/5"],
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

  const alertsByType = alerts?.slice(0, 3) || [];

  return (
    <div className="flex h-screen bg-background">
      <Sidebar userRole={user?.role || "admin"} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Admin Dashboard" />
        
        <main className="flex-1 overflow-auto p-6">
          {/* Key Metrics */}
          <MetricsCards />

          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Revenue Chart */}
            <div className="lg:col-span-2">
              <RevenueChart />
            </div>

            {/* Top Performing Vehicles */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Top Performers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topVehicles?.length ? topVehicles.map((vehicle: any, index: number) => (
                    <div key={vehicle.id} className="flex items-center justify-between p-3 bg-muted rounded-md" data-testid={`card-top-vehicle-${vehicle.id}`}>
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 ${
                          index === 0 ? 'bg-green-500' : 
                          index === 1 ? 'bg-blue-500' : 
                          'bg-purple-500'
                        } rounded-full flex items-center justify-center`}>
                          <Car className="text-white h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground" data-testid={`text-vehicle-registration-${vehicle.id}`}>{vehicle.registrationNumber}</p>
                          <p className="text-sm text-muted-foreground" data-testid={`text-vehicle-model-${vehicle.id}`}>{vehicle.make} {vehicle.model}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-foreground">₹3,{450 - index * 160}</p>
                        <p className="text-xs text-green-600">+{15 - index * 7}%</p>
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Car className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No performance data available</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity and Alerts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Recent Trips */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-semibold">Recent Trips</CardTitle>
                <Button variant="ghost" size="sm" data-testid="button-view-all-trips">
                  View All
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentTrips?.length ? recentTrips.map((trip: any) => (
                    <div key={trip.id} className="flex items-center justify-between py-3 border-b border-border last:border-b-0" data-testid={`row-trip-${trip.id}`}>
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 ${
                          trip.status === 'completed' ? 'bg-green-100' : 'bg-blue-100'
                        } rounded-full flex items-center justify-center`}>
                          {trip.status === 'completed' ? 
                            <CheckCircle className="text-green-600 h-4 w-4" /> : 
                            <Clock className="text-blue-600 h-4 w-4" />
                          }
                        </div>
                        <div>
                          <p className="font-medium text-foreground" data-testid={`text-trip-vehicle-${trip.id}`}>{trip.vehicleId}</p>
                          <p className="text-sm text-muted-foreground capitalize" data-testid={`text-trip-status-${trip.id}`}>{trip.status}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-foreground" data-testid={`text-trip-amount-${trip.id}`}>₹{parseFloat(trip.totalAmount).toFixed(0)}</p>
                        <p className="text-xs text-muted-foreground" data-testid={`text-trip-time-${trip.id}`}>
                          {new Date(trip.startTime).toLocaleTimeString('en-IN', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No recent trips</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Critical Alerts */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-semibold">Critical Alerts</CardTitle>
                <Badge variant="destructive" className="text-xs" data-testid="badge-alert-count">
                  {alerts?.length || 0} Active
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {alertsByType.length ? alertsByType.map((alert: any) => (
                    <div key={alert.id} className={`p-3 rounded-md border ${
                      alert.priority === 'critical' ? 'bg-red-50 border-red-200' :
                      alert.priority === 'high' ? 'bg-amber-50 border-amber-200' :
                      'bg-blue-50 border-blue-200'
                    }`} data-testid={`alert-${alert.id}`}>
                      <div className="flex items-start space-x-3">
                        {alert.type === 'insurance_expiry' && <AlertTriangle className="text-red-600 mt-1 h-5 w-5" />}
                        {alert.type === 'service_due' && <Wrench className="text-amber-600 mt-1 h-5 w-5" />}
                        {alert.type === 'payout_pending' && <CreditCard className="text-blue-600 mt-1 h-5 w-5" />}
                        <div className="flex-1">
                          <p className="font-medium text-foreground" data-testid={`text-alert-title-${alert.id}`}>{alert.title}</p>
                          <p className="text-sm text-muted-foreground" data-testid={`text-alert-message-${alert.id}`}>{alert.message}</p>
                          <p className="text-xs text-muted-foreground mt-1" data-testid={`text-alert-time-${alert.id}`}>
                            {new Date(alert.createdAt).toLocaleString('en-IN')}
                          </p>
                        </div>
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No active alerts</p>
                    </div>
                  )}
                </div>
                
                <Button variant="ghost" size="sm" className="w-full mt-4" data-testid="button-view-all-alerts">
                  View All Alerts
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button className="flex items-center space-x-3 p-4 h-auto" data-testid="button-add-trip">
                  <Plus className="h-5 w-5" />
                  <span className="font-medium">Add Trip</span>
                </Button>
                
                <Button className="flex items-center space-x-3 p-4 h-auto bg-green-600 hover:bg-green-700" data-testid="button-add-vehicle">
                  <Car className="h-5 w-5" />
                  <span className="font-medium">Add Vehicle</span>
                </Button>
                
                <Button className="flex items-center space-x-3 p-4 h-auto bg-purple-600 hover:bg-purple-700" data-testid="button-add-driver">
                  <Users className="h-5 w-5" />
                  <span className="font-medium">Add Driver</span>
                </Button>
                
                <Button className="flex items-center space-x-3 p-4 h-auto bg-orange-600 hover:bg-orange-700" data-testid="button-generate-report">
                  <FileText className="h-5 w-5" />
                  <span className="font-medium">Generate Report</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
