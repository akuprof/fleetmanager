import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useState } from "react";

const mockData = {
  daily: [
    { name: 'Mon', revenue: 12000, profit: 8400 },
    { name: 'Tue', revenue: 15000, profit: 10500 },
    { name: 'Wed', revenue: 18000, profit: 12600 },
    { name: 'Thu', revenue: 22000, profit: 15400 },
    { name: 'Fri', revenue: 25000, profit: 17500 },
    { name: 'Sat', revenue: 28000, profit: 19600 },
    { name: 'Sun', revenue: 24000, profit: 16800 },
  ],
  weekly: [
    { name: 'W1', revenue: 120000, profit: 84000 },
    { name: 'W2', revenue: 135000, profit: 94500 },
    { name: 'W3', revenue: 148000, profit: 103600 },
    { name: 'W4', revenue: 162000, profit: 113400 },
  ],
  monthly: [
    { name: 'Jan', revenue: 480000, profit: 336000 },
    { name: 'Feb', revenue: 520000, profit: 364000 },
    { name: 'Mar', revenue: 565000, profit: 395500 },
    { name: 'Apr', revenue: 610000, profit: 427000 },
    { name: 'May', revenue: 645000, profit: 451500 },
    { name: 'Jun', revenue: 680000, profit: 476000 },
  ],
};

export default function RevenueChart() {
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  const data = mockData[period];

  return (
    <Card className="lg:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Revenue Trends</CardTitle>
        <div className="flex space-x-2">
          {(['daily', 'weekly', 'monthly'] as const).map((p) => (
            <Button
              key={p}
              variant={period === p ? "default" : "ghost"}
              size="sm"
              onClick={() => setPeriod(p)}
              className="capitalize"
              data-testid={`button-chart-${p}`}
            >
              {p}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis 
                dataKey="name" 
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
                formatter={(value: number, name: string) => [
                  `₹${value.toLocaleString('en-IN')}`,
                  name === 'revenue' ? 'Revenue' : 'Profit'
                ]}
              />
              <Bar 
                dataKey="revenue" 
                fill="hsl(var(--primary))" 
                name="revenue"
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                dataKey="profit" 
                fill="hsl(var(--chart-2))" 
                name="profit"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
