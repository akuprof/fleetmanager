import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck, Users, Route, TrendingUp, Shield, Clock } from "lucide-react";

export default function Landing() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Truck className="text-primary-foreground h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">FleetFlow</h1>
              <p className="text-sm text-muted-foreground">Fleet Management System</p>
            </div>
          </div>
          <Button onClick={handleLogin} data-testid="button-login">
            Sign In
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Manage Your Fleet
            <span className="text-primary block">Like Never Before</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Comprehensive fleet rental and driver management system with automated revenue sharing, 
            real-time tracking, and powerful analytics for your business growth.
          </p>
          <Button size="lg" onClick={handleLogin} className="text-lg px-8 py-3" data-testid="button-get-started">
            Get Started Today
          </Button>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6 bg-muted/50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            Everything You Need to Manage Your Fleet
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Truck className="text-primary h-6 w-6" />
                </div>
                <CardTitle>Vehicle Management</CardTitle>
                <CardDescription>
                  Complete vehicle lifecycle management with documents, maintenance schedules, and status tracking.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Users className="text-primary h-6 w-6" />
                </div>
                <CardTitle>Driver Management</CardTitle>
                <CardDescription>
                  Driver onboarding, assignments, performance tracking, and automated payout calculations.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Route className="text-primary h-6 w-6" />
                </div>
                <CardTitle>Trip Management</CardTitle>
                <CardDescription>
                  Manual trip logging with automatic revenue sharing based on intelligent business rules.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="text-primary h-6 w-6" />
                </div>
                <CardTitle>Smart Analytics</CardTitle>
                <CardDescription>
                  Real-time dashboards, performance metrics, and insights to optimize your fleet operations.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="text-primary h-6 w-6" />
                </div>
                <CardTitle>Role-Based Access</CardTitle>
                <CardDescription>
                  Secure access control with different permissions for admins, managers, and drivers.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Clock className="text-primary h-6 w-6" />
                </div>
                <CardTitle>Smart Alerts</CardTitle>
                <CardDescription>
                  Proactive notifications for insurance renewals, maintenance schedules, and pending payouts.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Revenue Sharing Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-foreground mb-8">
              Automated Revenue Sharing
            </h2>
            <p className="text-lg text-muted-foreground mb-12">
              Our intelligent system automatically calculates driver and company shares based on daily revenue targets.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl text-green-800">Up to ₹2,500/day</CardTitle>
                  <CardDescription className="text-green-600">Standard Sharing</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="space-y-4">
                    <div>
                      <p className="text-3xl font-bold text-green-800">30%</p>
                      <p className="text-green-600">Driver Share</p>
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-green-800">70%</p>
                      <p className="text-green-600">Company Share</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl text-blue-800">Above ₹2,500/day</CardTitle>
                  <CardDescription className="text-blue-600">Performance Bonus</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="space-y-4">
                    <div>
                      <p className="text-3xl font-bold text-blue-800">70%</p>
                      <p className="text-blue-600">Driver Share</p>
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-blue-800">30%</p>
                      <p className="text-blue-600">Company Share</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-primary text-primary-foreground">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Transform Your Fleet Management?
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Join hundreds of fleet operators who trust FleetFlow to manage their operations efficiently.
          </p>
          <Button 
            size="lg" 
            variant="secondary" 
            onClick={handleLogin}
            className="text-lg px-8 py-3"
            data-testid="button-start-now"
          >
            Start Now
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-card border-t border-border">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Truck className="text-primary-foreground h-5 w-5" />
            </div>
            <span className="text-lg font-semibold text-foreground">FleetFlow</span>
          </div>
          <p className="text-muted-foreground">
            © 2024 FleetFlow. All rights reserved. Empowering fleet operations worldwide.
          </p>
        </div>
      </footer>
    </div>
  );
}
