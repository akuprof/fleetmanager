import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IndianRupee, TrendingUp, Car, Users } from "lucide-react";

export default function MetricsCards() {
  const { data: metrics, isLoading } = useQuery({
    queryKey: ["/api/dashboard/metrics"],
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-muted rounded w-24 mb-2"></div>
                <div className="h-8 bg-muted rounded w-16 mb-2"></div>
                <div className="h-3 bg-muted rounded w-32"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const {
    totalRevenue = 0,
    netProfit = 0,
    activeVehicles = 0,
    totalDrivers = 0,
  } = metrics || {};

  const revenueChange = 12.5; // This would come from API in real implementation
  const profitChange = 8.3;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Revenue</p>
              <p className="text-2xl font-bold text-foreground" data-testid="text-total-revenue">
                ₹{totalRevenue.toLocaleString('en-IN')}
              </p>
              <p className="text-sm text-green-600 mt-1">
                <TrendingUp className="inline h-3 w-3 mr-1" />
                +{revenueChange}% from yesterday
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <IndianRupee className="text-green-600 text-xl" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Net Profit</p>
              <p className="text-2xl font-bold text-foreground" data-testid="text-net-profit">
                ₹{netProfit.toLocaleString('en-IN')}
              </p>
              <p className="text-sm text-green-600 mt-1">
                <TrendingUp className="inline h-3 w-3 mr-1" />
                +{profitChange}% from yesterday
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="text-blue-600 text-xl" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active Vehicles</p>
              <p className="text-2xl font-bold text-foreground" data-testid="text-active-vehicles">
                {activeVehicles}
              </p>
              <p className="text-sm text-amber-600 mt-1">
                <span className="inline-block w-2 h-2 bg-amber-500 rounded-full mr-1"></span>
                View details
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Car className="text-orange-600 text-xl" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Drivers</p>
              <p className="text-2xl font-bold text-foreground" data-testid="text-total-drivers">
                {totalDrivers}
              </p>
              <p className="text-sm text-green-600 mt-1">
                <Users className="inline h-3 w-3 mr-1" />
                All active
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Users className="text-purple-600 text-xl" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
