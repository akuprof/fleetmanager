import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  FileText, 
  Download, 
  TrendingUp, 
  Car, 
  Users, 
  CreditCard,
  BarChart3,
  Calendar,
  DollarSign
} from "lucide-react";
import { formatCurrency } from "@/lib/revenue-calculator";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import type { DateRange } from "react-day-picker";

export default function Reports() {
  const [reportType, setReportType] = useState("revenue");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [selectedVehicle, setSelectedVehicle] = useState<string>("all");
  const [selectedDriver, setSelectedDriver] = useState<string>("all");
  const { user } = useAuth();

  const { data: trips } = useQuery({
    queryKey: ["/api/trips"],
    retry: false,
  });

  const { data: vehicles } = useQuery({
    queryKey: ["/api/vehicles"],
    retry: false,
  });

  const { data: drivers } = useQuery({
    queryKey: ["/api/drivers"],
    retry: false,
  });

  const { data: expenses } = useQuery({
    queryKey: ["/api/expenses"],
    retry: false,
  });

  const { data: payouts } = useQuery({
    queryKey: ["/api/payouts"],
    retry: false,
  });

  // Filter data based on selected criteria
  const filteredTrips = trips?.filter((trip: any) => {
    const tripDate = new Date(trip.startTime);
    let dateFilter = true;
    
    if (dateRange?.from && dateRange?.to) {
      dateFilter = tripDate >= dateRange.from && tripDate <= dateRange.to;
    }

    const vehicleFilter = selectedVehicle === "all" || trip.vehicleId === selectedVehicle;
    const driverFilter = selectedDriver === "all" || trip.driverId === selectedDriver;

    return dateFilter && vehicleFilter && driverFilter && trip.status === "completed";
  }) || [];

  // Generate report data based on type
  const generateReportData = () => {
    switch (reportType) {
      case "revenue":
        return generateRevenueReport();
      case "vehicle_performance":
        return generateVehiclePerformanceReport();
      case "driver_performance":
        return generateDriverPerformanceReport();
      case "expense_analysis":
        return generateExpenseAnalysisReport();
      case "profit_loss":
        return generateProfitLossReport();
      default:
        return { chartData: [], tableData: [], summary: {} };
    }
  };

  const generateRevenueReport = () => {
    // Group trips by date
    const revenueByDate = filteredTrips.reduce((acc: any, trip: any) => {
      const date = new Date(trip.startTime).toLocaleDateString('en-IN');
      if (!acc[date]) {
        acc[date] = { date, totalRevenue: 0, driverShare: 0, companyShare: 0, trips: 0 };
      }
      acc[date].totalRevenue += parseFloat(trip.totalAmount);
      acc[date].driverShare += parseFloat(trip.driverShare || '0');
      acc[date].companyShare += parseFloat(trip.companyShare || '0');
      acc[date].trips += 1;
      return acc;
    }, {});

    const chartData = Object.values(revenueByDate).sort((a: any, b: any) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const tableData = chartData.map((item: any) => ({
      date: item.date,
      trips: item.trips,
      revenue: formatCurrency(item.totalRevenue),
      driverShare: formatCurrency(item.driverShare),
      companyShare: formatCurrency(item.companyShare),
    }));

    const summary = {
      totalRevenue: filteredTrips.reduce((sum: number, trip: any) => sum + parseFloat(trip.totalAmount), 0),
      totalTrips: filteredTrips.length,
      avgTripRevenue: filteredTrips.length > 0 ? 
        filteredTrips.reduce((sum: number, trip: any) => sum + parseFloat(trip.totalAmount), 0) / filteredTrips.length : 0,
    };

    return { chartData, tableData, summary };
  };

  const generateVehiclePerformanceReport = () => {
    // Group trips by vehicle
    const vehiclePerformance = filteredTrips.reduce((acc: any, trip: any) => {
      const vehicleId = trip.vehicleId;
      if (!acc[vehicleId]) {
        const vehicle = vehicles?.find((v: any) => v.id === vehicleId);
        acc[vehicleId] = {
          vehicle: vehicle ? `${vehicle.registrationNumber} - ${vehicle.make} ${vehicle.model}` : vehicleId,
          trips: 0,
          revenue: 0,
          distance: 0,
          utilization: 0,
        };
      }
      acc[vehicleId].trips += 1;
      acc[vehicleId].revenue += parseFloat(trip.totalAmount);
      acc[vehicleId].distance += parseFloat(trip.distance || '0');
      return acc;
    }, {});

    const chartData = Object.values(vehiclePerformance)
      .sort((a: any, b: any) => b.revenue - a.revenue)
      .slice(0, 10);

    const tableData = chartData.map((item: any) => ({
      vehicle: item.vehicle,
      trips: item.trips,
      revenue: formatCurrency(item.revenue),
      distance: `${item.distance.toFixed(1)} km`,
      avgPerTrip: formatCurrency(item.revenue / item.trips),
    }));

    const summary = {
      topVehicle: chartData[0]?.vehicle || "N/A",
      totalVehiclesActive: Object.keys(vehiclePerformance).length,
      avgRevenuePerVehicle: Object.values(vehiclePerformance)
        .reduce((sum: number, v: any) => sum + v.revenue, 0) / Object.keys(vehiclePerformance).length,
    };

    return { chartData, tableData, summary };
  };

  const generateDriverPerformanceReport = () => {
    // Group trips by driver
    const driverPerformance = filteredTrips.reduce((acc: any, trip: any) => {
      const driverId = trip.driverId;
      if (!acc[driverId]) {
        const driver = drivers?.find((d: any) => d.id === driverId);
        acc[driverId] = {
          driver: driver ? `${driver.licenseNumber} - ${driver.phoneNumber}` : driverId,
          trips: 0,
          revenue: 0,
          earnings: 0,
        };
      }
      acc[driverId].trips += 1;
      acc[driverId].revenue += parseFloat(trip.totalAmount);
      acc[driverId].earnings += parseFloat(trip.driverShare || '0');
      return acc;
    }, {});

    const chartData = Object.values(driverPerformance)
      .sort((a: any, b: any) => b.earnings - a.earnings)
      .slice(0, 10);

    const tableData = chartData.map((item: any) => ({
      driver: item.driver,
      trips: item.trips,
      revenue: formatCurrency(item.revenue),
      earnings: formatCurrency(item.earnings),
      avgPerTrip: formatCurrency(item.earnings / item.trips),
    }));

    const summary = {
      topDriver: chartData[0]?.driver || "N/A",
      totalDriversActive: Object.keys(driverPerformance).length,
      avgEarningsPerDriver: Object.values(driverPerformance)
        .reduce((sum: number, d: any) => sum + d.earnings, 0) / Object.keys(driverPerformance).length,
    };

    return { chartData, tableData, summary };
  };

  const generateExpenseAnalysisReport = () => {
    // Filter expenses by date range
    const filteredExpenses = expenses?.filter((expense: any) => {
      const expenseDate = new Date(expense.expenseDate);
      if (dateRange?.from && dateRange?.to) {
        return expenseDate >= dateRange.from && expenseDate <= dateRange.to;
      }
      return true;
    }) || [];

    // Group expenses by type
    const expensesByType = filteredExpenses.reduce((acc: any, expense: any) => {
      const type = expense.type;
      if (!acc[type]) {
        acc[type] = { type, amount: 0, count: 0 };
      }
      acc[type].amount += parseFloat(expense.amount);
      acc[type].count += 1;
      return acc;
    }, {});

    const chartData = Object.values(expensesByType);
    
    const tableData = chartData.map((item: any) => ({
      type: item.type,
      count: item.count,
      amount: formatCurrency(item.amount),
      avgExpense: formatCurrency(item.amount / item.count),
    }));

    const summary = {
      totalExpenses: filteredExpenses.reduce((sum: number, exp: any) => sum + parseFloat(exp.amount), 0),
      expenseCount: filteredExpenses.length,
      topExpenseType: chartData.sort((a: any, b: any) => b.amount - a.amount)[0]?.type || "N/A",
    };

    return { chartData, tableData, summary };
  };

  const generateProfitLossReport = () => {
    const totalRevenue = filteredTrips.reduce((sum: number, trip: any) => 
      sum + parseFloat(trip.totalAmount), 0
    );
    
    const companyRevenue = filteredTrips.reduce((sum: number, trip: any) => 
      sum + parseFloat(trip.companyShare || '0'), 0
    );

    const filteredExpenses = expenses?.filter((expense: any) => {
      const expenseDate = new Date(expense.expenseDate);
      if (dateRange?.from && dateRange?.to) {
        return expenseDate >= dateRange.from && expenseDate <= dateRange.to;
      }
      return true;
    }) || [];

    const totalExpenses = filteredExpenses.reduce((sum: number, exp: any) => 
      sum + parseFloat(exp.amount), 0
    );

    const netProfit = companyRevenue - totalExpenses;
    const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

    const chartData = [
      { name: "Company Revenue", value: companyRevenue },
      { name: "Expenses", value: totalExpenses },
      { name: "Net Profit", value: netProfit },
    ];

    const tableData = [
      { metric: "Total Revenue", value: formatCurrency(totalRevenue) },
      { metric: "Company Share", value: formatCurrency(companyRevenue) },
      { metric: "Total Expenses", value: formatCurrency(totalExpenses) },
      { metric: "Net Profit", value: formatCurrency(netProfit) },
      { metric: "Profit Margin", value: `${profitMargin.toFixed(2)}%` },
    ];

    const summary = {
      netProfit,
      profitMargin,
      totalRevenue,
      totalExpenses,
    };

    return { chartData, tableData, summary };
  };

  const reportData = generateReportData();

  const handleExportPDF = () => {
    // In a real implementation, this would generate and download a PDF
    alert("PDF export functionality would be implemented here");
  };

  const handleExportExcel = () => {
    // In a real implementation, this would generate and download an Excel file
    alert("Excel export functionality would be implemented here");
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="flex h-screen bg-background">
      <Sidebar userRole={user?.role || "admin"} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Reports & Analytics" />
        
        <main className="flex-1 overflow-auto p-6">
          {/* Report Configuration */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Report Configuration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div>
                  <Label htmlFor="report-type">Report Type</Label>
                  <Select value={reportType} onValueChange={setReportType}>
                    <SelectTrigger data-testid="select-report-type">
                      <SelectValue placeholder="Select report type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="revenue">Revenue Analysis</SelectItem>
                      <SelectItem value="vehicle_performance">Vehicle Performance</SelectItem>
                      <SelectItem value="driver_performance">Driver Performance</SelectItem>
                      <SelectItem value="expense_analysis">Expense Analysis</SelectItem>
                      <SelectItem value="profit_loss">Profit & Loss</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="vehicle-filter">Vehicle Filter</Label>
                  <Select value={selectedVehicle} onValueChange={setSelectedVehicle}>
                    <SelectTrigger data-testid="select-vehicle-filter">
                      <SelectValue placeholder="All vehicles" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Vehicles</SelectItem>
                      {vehicles?.map((vehicle: any) => (
                        <SelectItem key={vehicle.id} value={vehicle.id}>
                          {vehicle.registrationNumber} - {vehicle.make} {vehicle.model}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="driver-filter">Driver Filter</Label>
                  <Select value={selectedDriver} onValueChange={setSelectedDriver}>
                    <SelectTrigger data-testid="select-driver-filter">
                      <SelectValue placeholder="All drivers" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Drivers</SelectItem>
                      {drivers?.map((driver: any) => (
                        <SelectItem key={driver.id} value={driver.id}>
                          {driver.licenseNumber} - {driver.phoneNumber}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Date Range</Label>
                  <div className="mt-1">
                    <Input
                      type="date"
                      placeholder="Select date range"
                      className="w-full"
                      data-testid="input-date-range"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Button onClick={handleExportPDF} variant="outline" data-testid="button-export-pdf">
                  <FileText className="h-4 w-4 mr-2" />
                  Export PDF
                </Button>
                <Button onClick={handleExportExcel} variant="outline" data-testid="button-export-excel">
                  <Download className="h-4 w-4 mr-2" />
                  Export Excel
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Report Summary */}
          {reportType === "revenue" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Revenue</p>
                      <p className="text-2xl font-bold" data-testid="text-summary-revenue">
                        {formatCurrency(reportData.summary.totalRevenue || 0)}
                      </p>
                    </div>
                    <DollarSign className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Trips</p>
                      <p className="text-2xl font-bold" data-testid="text-summary-trips">
                        {reportData.summary.totalTrips || 0}
                      </p>
                    </div>
                    <Car className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Avg Trip Revenue</p>
                      <p className="text-2xl font-bold" data-testid="text-summary-avg">
                        {formatCurrency(reportData.summary.avgTripRevenue || 0)}
                      </p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Chart Visualization */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>
                {reportType === "revenue" && "Revenue Trends"}
                {reportType === "vehicle_performance" && "Vehicle Performance"}
                {reportType === "driver_performance" && "Driver Performance"}
                {reportType === "expense_analysis" && "Expense Breakdown"}
                {reportType === "profit_loss" && "Profit & Loss Overview"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                {reportType === "expense_analysis" ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={reportData.chartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ type, amount }: any) => `${type}: ${formatCurrency(amount)}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="amount"
                      >
                        {reportData.chartData.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => formatCurrency(value)} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={reportData.chartData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis 
                        dataKey={reportType === "revenue" ? "date" : reportType === "vehicle_performance" ? "vehicle" : "driver"} 
                        className="text-muted-foreground"
                        fontSize={12}
                      />
                      <YAxis 
                        className="text-muted-foreground"
                        fontSize={12}
                        tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: 'var(--radius)',
                        }}
                        formatter={(value: number) => formatCurrency(value)}
                      />
                      <Bar 
                        dataKey={reportType === "driver_performance" ? "earnings" : reportType === "revenue" ? "totalRevenue" : "revenue"}
                        fill="hsl(var(--primary))" 
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Detailed Table */}
          <Card>
            <CardHeader>
              <CardTitle>Detailed Report Data</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    {reportType === "revenue" && (
                      <>
                        <TableHead>Date</TableHead>
                        <TableHead>Trips</TableHead>
                        <TableHead>Revenue</TableHead>
                        <TableHead>Driver Share</TableHead>
                        <TableHead>Company Share</TableHead>
                      </>
                    )}
                    {reportType === "vehicle_performance" && (
                      <>
                        <TableHead>Vehicle</TableHead>
                        <TableHead>Trips</TableHead>
                        <TableHead>Revenue</TableHead>
                        <TableHead>Distance</TableHead>
                        <TableHead>Avg per Trip</TableHead>
                      </>
                    )}
                    {reportType === "driver_performance" && (
                      <>
                        <TableHead>Driver</TableHead>
                        <TableHead>Trips</TableHead>
                        <TableHead>Revenue</TableHead>
                        <TableHead>Earnings</TableHead>
                        <TableHead>Avg per Trip</TableHead>
                      </>
                    )}
                    {reportType === "expense_analysis" && (
                      <>
                        <TableHead>Type</TableHead>
                        <TableHead>Count</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Avg Expense</TableHead>
                      </>
                    )}
                    {reportType === "profit_loss" && (
                      <>
                        <TableHead>Metric</TableHead>
                        <TableHead>Value</TableHead>
                      </>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reportData.tableData.map((row: any, index: number) => (
                    <TableRow key={index} data-testid={`row-report-data-${index}`}>
                      {Object.values(row).map((value: any, cellIndex: number) => (
                        <TableCell key={cellIndex} className={cellIndex === 0 ? "font-medium" : ""}>
                          {value}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
