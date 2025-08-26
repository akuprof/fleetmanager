import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IndianRupee, Car, Clock, Calendar, TrendingUp, CreditCard } from "lucide-react";

export default function DriverDashboard() {
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

  const { data: driver } = useQuery({
    queryKey: ["/api/drivers"],
    retry: false,
    select: (drivers: any[]) => drivers?.find((d: any) => d.userId === user?.id),
  });

  const { data: driverTrips } = useQuery({
    queryKey: ["/api/trips/driver", driver?.id],
    enabled: !!driver?.id,
    retry: false,
  });

  const { data: driverPayouts } = useQuery({
    queryKey: ["/api/payouts"],
    retry: false,
    select: (payouts: any[]) => payouts?.filter((p: any) => p.driverId === driver?.id),
  });

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Calculate today's earnings
  const today = new Date().toDateString();
  const todaysTrips = driverTrips?.filter((trip: any) => 
    new Date(trip.startTime).toDateString() === today && trip.status === 'completed'
  ) || [];
  
  const todaysRevenue = todaysTrips.reduce((sum: number, trip: any) => 
    sum + parseFloat(trip.totalAmount), 0
  );
  
  const todaysDriverShare = todaysTrips.reduce((sum: number, trip: any) => 
    sum + parseFloat(trip.driverShare || '0'), 0
  );
  
  const todaysCompanyShare = todaysTrips.reduce((sum: number, trip: any) => 
    sum + parseFloat(trip.companyShare || '0'), 0
  );

  // Calculate weekly earnings
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  weekStart.setHours(0, 0, 0, 0);
  
  const weeklyTrips = driverTrips?.filter((trip: any) => 
    new Date(trip.startTime) >= weekStart && trip.status === 'completed'
  ) || [];
  
  const weeklyDriverShare = weeklyTrips.reduce((sum: number, trip: any) => 
    sum + parseFloat(trip.driverShare || '0'), 0
  );

  // Get recent completed trips
  const recentTrips = driverTrips?.filter((trip: any) => trip.status === 'completed')
    .sort((a: any, b: any) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
    .slice(0, 5) || [];

  // Get recent payouts
  const recentPayouts = driverPayouts?.sort((a: any, b: any) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ).slice(0, 3) || [];

  return (
    <div className="flex h-screen bg-background">
      <Sidebar userRole={user?.role || "driver"} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Driver Dashboard" />
        
        <main className="flex-1 overflow-auto p-6">
          {/* Daily Earnings Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-green-800">Today's Earnings</CardTitle>
                <IndianRupee className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-800" data-testid="text-today-earnings">
                  ₹{todaysDriverShare.toFixed(0)}
                </div>
                <p className="text-xs text-green-600">
                  From ₹{todaysRevenue.toFixed(0)} total revenue
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-blue-800">Company Share</CardTitle>
                <TrendingUp className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-800" data-testid="text-company-share">
                  ₹{todaysCompanyShare.toFixed(0)}
                </div>
                <p className="text-xs text-blue-600">
                  Today's company portion
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-purple-800">Today's Trips</CardTitle>
                <Car className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-800" data-testid="text-today-trips">
                  {todaysTrips.length}
                </div>
                <p className="text-xs text-purple-600">
                  Completed trips
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Weekly Summary */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Weekly Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-foreground" data-testid="text-weekly-earnings">
                    ₹{weeklyDriverShare.toFixed(0)}
                  </div>
                  <p className="text-sm text-muted-foreground">Total Earnings</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-foreground" data-testid="text-weekly-trips">
                    {weeklyTrips.length}
                  </div>
                  <p className="text-sm text-muted-foreground">Completed Trips</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-foreground" data-testid="text-avg-per-trip">
                    ₹{weeklyTrips.length ? (weeklyDriverShare / weeklyTrips.length).toFixed(0) : '0'}
                  </div>
                  <p className="text-sm text-muted-foreground">Avg per Trip</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Content Grid */}
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
                  {recentTrips.length ? recentTrips.map((trip: any) => (
                    <div key={trip.id} className="flex items-center justify-between p-3 bg-muted rounded-md" data-testid={`card-trip-${trip.id}`}>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <Car className="text-green-600 h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground" data-testid={`text-trip-date-${trip.id}`}>
                            {new Date(trip.startTime).toLocaleDateString('en-IN')}
                          </p>
                          <p className="text-sm text-muted-foreground" data-testid={`text-trip-time-${trip.id}`}>
                            {new Date(trip.startTime).toLocaleTimeString('en-IN', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-foreground" data-testid={`text-trip-earnings-${trip.id}`}>
                          ₹{parseFloat(trip.driverShare || '0').toFixed(0)}
                        </p>
                        <p className="text-xs text-muted-foreground" data-testid={`text-trip-total-${trip.id}`}>
                          of ₹{parseFloat(trip.totalAmount).toFixed(0)}
                        </p>
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Car className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No trips completed yet</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Payout History */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-semibold">Payout History</CardTitle>
                <Button variant="ghost" size="sm" data-testid="button-view-all-payouts">
                  View All
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentPayouts.length ? recentPayouts.map((payout: any) => (
                    <div key={payout.id} className="flex items-center justify-between p-3 bg-muted rounded-md" data-testid={`card-payout-${payout.id}`}>
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 ${
                          payout.status === 'paid' ? 'bg-green-100' : 
                          payout.status === 'pending' ? 'bg-amber-100' : 
                          'bg-red-100'
                        } rounded-full flex items-center justify-center`}>
                          <CreditCard className={`h-5 w-5 ${
                            payout.status === 'paid' ? 'text-green-600' : 
                            payout.status === 'pending' ? 'text-amber-600' : 
                            'text-red-600'
                          }`} />
                        </div>
                        <div>
                          <p className="font-medium text-foreground" data-testid={`text-payout-period-${payout.id}`}>
                            {new Date(payout.fromDate).toLocaleDateString('en-IN')} - {new Date(payout.toDate).toLocaleDateString('en-IN')}
                          </p>
                          <p className="text-sm text-muted-foreground" data-testid={`text-payout-trips-${payout.id}`}>
                            {payout.totalTrips} trips
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-foreground" data-testid={`text-payout-amount-${payout.id}`}>
                          ₹{parseFloat(payout.amount).toFixed(0)}
                        </p>
                        <Badge 
                          variant={
                            payout.status === 'paid' ? 'default' : 
                            payout.status === 'pending' ? 'outline' : 
                            'destructive'
                          }
                          className="text-xs"
                          data-testid={`badge-payout-status-${payout.id}`}
                        >
                          {payout.status}
                        </Badge>
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No payouts yet</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Performance Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Performance Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground" data-testid="text-total-trips">
                    {driver?.totalTrips || 0}
                  </div>
                  <p className="text-sm text-muted-foreground">Total Trips</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground" data-testid="text-total-earnings">
                    ₹{parseFloat(driver?.totalEarnings || '0').toFixed(0)}
                  </div>
                  <p className="text-sm text-muted-foreground">Total Earnings</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground" data-testid="text-avg-trip-earnings">
                    ₹{driver?.totalTrips ? (parseFloat(driver?.totalEarnings || '0') / driver.totalTrips).toFixed(0) : '0'}
                  </div>
                  <p className="text-sm text-muted-foreground">Avg per Trip</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground" data-testid="text-weekly-avg">
                    ₹{(weeklyDriverShare / 7).toFixed(0)}
                  </div>
                  <p className="text-sm text-muted-foreground">Daily Average</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
