import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreditCard, Users, Clock, CheckCircle, XCircle, Plus, Edit } from "lucide-react";
import { formatCurrency } from "@/lib/revenue-calculator";
import type { Payout } from "@shared/schema";

export default function Payouts() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingPayout, setEditingPayout] = useState<Payout | null>(null);
  const [paymentReference, setPaymentReference] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: payouts, isLoading } = useQuery({
    queryKey: user?.role === "driver" ? ["/api/payouts"] : ["/api/payouts"],
    retry: false,
    select: (data: Payout[]) => {
      if (user?.role === "driver") {
        // For drivers, we need to get their driver record first
        return data; // This would need to be filtered by driver ID in a real implementation
      }
      return data;
    },
  });

  const { data: drivers } = useQuery({
    queryKey: ["/api/drivers"],
    retry: false,
    enabled: user?.role !== "driver",
  });

  const { data: pendingPayouts } = useQuery({
    queryKey: ["/api/payouts/pending"],
    retry: false,
  });

  const updatePayoutMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Payout> }) => {
      await apiRequest("PUT", `/api/payouts/${id}`, data);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Payout updated successfully",
      });
      setEditingPayout(null);
      setPaymentReference("");
      setPaymentMethod("");
      queryClient.invalidateQueries({ queryKey: ["/api/payouts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/payouts/pending"] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
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
      toast({
        title: "Error",
        description: "Failed to update payout",
        variant: "destructive",
      });
    },
  });

  const markAsPaidMutation = useMutation({
    mutationFn: async (payout: Payout) => {
      await apiRequest("PUT", `/api/payouts/${payout.id}`, {
        status: "paid",
        payoutDate: new Date().toISOString(),
        paymentReference,
        paymentMethod,
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Payout marked as paid",
      });
      setPaymentReference("");
      setPaymentMethod("");
      queryClient.invalidateQueries({ queryKey: ["/api/payouts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/payouts/pending"] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
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
      toast({
        title: "Error",
        description: "Failed to mark payout as paid",
        variant: "destructive",
      });
    },
  });

  const handleMarkAsPaid = (payout: Payout) => {
    if (!paymentReference || !paymentMethod) {
      toast({
        title: "Missing Information",
        description: "Please provide payment reference and method",
        variant: "destructive",
      });
      return;
    }
    markAsPaidMutation.mutate(payout);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-amber-100 text-amber-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
        return <CheckCircle className="h-4 w-4" />;
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "failed":
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getDriverInfo = (driverId: string) => {
    const driver = drivers?.find((d: any) => d.id === driverId);
    return driver ? `${driver.licenseNumber} - ${driver.phoneNumber}` : driverId;
  };

  // Calculate payout statistics
  const totalPayouts = payouts?.reduce((sum: number, payout: Payout) => 
    sum + parseFloat(payout.amount), 0
  ) || 0;

  const paidPayouts = payouts?.filter((p: Payout) => p.status === "paid") || [];
  const totalPaid = paidPayouts.reduce((sum: number, payout: Payout) => 
    sum + parseFloat(payout.amount), 0
  );

  const pendingAmount = pendingPayouts?.reduce((sum: number, payout: Payout) => 
    sum + parseFloat(payout.amount), 0
  ) || 0;

  return (
    <div className="flex h-screen bg-background">
      <Sidebar userRole={user?.role || "admin"} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Payout Management" />
        
        <main className="flex-1 overflow-auto p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Payouts</p>
                    <p className="text-2xl font-bold" data-testid="text-total-payouts">
                      {formatCurrency(totalPayouts)}
                    </p>
                  </div>
                  <CreditCard className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Paid Payouts</p>
                    <p className="text-2xl font-bold text-green-600" data-testid="text-paid-payouts">
                      {formatCurrency(totalPaid)}
                    </p>
                  </div>
                  <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Pending Payouts</p>
                    <p className="text-2xl font-bold text-amber-600" data-testid="text-pending-payouts">
                      {formatCurrency(pendingAmount)}
                    </p>
                  </div>
                  <div className="h-8 w-8 bg-amber-100 rounded-full flex items-center justify-center">
                    <Clock className="h-5 w-5 text-amber-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Drivers</p>
                    <p className="text-2xl font-bold text-blue-600" data-testid="text-drivers-with-payouts">
                      {new Set(payouts?.map((p: Payout) => p.driverId)).size || 0}
                    </p>
                  </div>
                  <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Payment Section for Pending Payouts */}
          {user?.role !== "driver" && pendingPayouts?.length > 0 && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Quick Payment Processing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <Label htmlFor="payment-reference">Payment Reference</Label>
                    <Input
                      id="payment-reference"
                      placeholder="UPI/Bank Reference ID"
                      value={paymentReference}
                      onChange={(e) => setPaymentReference(e.target.value)}
                      data-testid="input-payment-reference"
                    />
                  </div>
                  <div>
                    <Label htmlFor="payment-method">Payment Method</Label>
                    <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                      <SelectTrigger data-testid="select-payment-method">
                        <SelectValue placeholder="Select method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="upi">UPI Transfer</SelectItem>
                        <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                        <SelectItem value="cash">Cash</SelectItem>
                        <SelectItem value="cheque">Cheque</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {pendingPayouts.slice(0, 3).map((payout: Payout) => (
                    <div key={payout.id} className="p-4 border border-amber-200 rounded-lg bg-amber-50">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium text-sm">
                            {user?.role !== "driver" && getDriverInfo(payout.driverId)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {payout.totalTrips} trips
                          </p>
                        </div>
                        <p className="font-bold text-amber-800">
                          {formatCurrency(parseFloat(payout.amount))}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleMarkAsPaid(payout)}
                        disabled={markAsPaidMutation.isPending}
                        className="w-full"
                        data-testid={`button-mark-paid-${payout.id}`}
                      >
                        Mark as Paid
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Payouts Table */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>All Payouts</CardTitle>
              {user?.role !== "driver" && (
                <Button variant="outline" data-testid="button-generate-payouts">
                  <Plus className="h-4 w-4 mr-2" />
                  Generate Payouts
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-2 text-muted-foreground">Loading payouts...</p>
                </div>
              ) : payouts?.length ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      {user?.role !== "driver" && <TableHead>Driver</TableHead>}
                      <TableHead>Period</TableHead>
                      <TableHead>Trips</TableHead>
                      <TableHead>Revenue</TableHead>
                      <TableHead>Payout Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Payment Date</TableHead>
                      {user?.role !== "driver" && <TableHead>Actions</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payouts.map((payout: Payout) => (
                      <TableRow key={payout.id} data-testid={`row-payout-${payout.id}`}>
                        {user?.role !== "driver" && (
                          <TableCell className="font-medium">
                            {getDriverInfo(payout.driverId)}
                          </TableCell>
                        )}
                        <TableCell>
                          <div>
                            <p className="text-sm font-medium">
                              {new Date(payout.fromDate).toLocaleDateString('en-IN')} - {new Date(payout.toDate).toLocaleDateString('en-IN')}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="font-medium">{payout.totalTrips}</span>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium">
                            {formatCurrency(parseFloat(payout.totalRevenue))}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium text-green-600">
                            {formatCurrency(parseFloat(payout.amount))}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(payout.status)} variant="secondary">
                            <div className="flex items-center gap-1">
                              {getStatusIcon(payout.status)}
                              {payout.status}
                            </div>
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {payout.payoutDate ? (
                            <div>
                              <p className="text-sm">
                                {new Date(payout.payoutDate).toLocaleDateString('en-IN')}
                              </p>
                              {payout.paymentMethod && (
                                <p className="text-xs text-muted-foreground">
                                  via {payout.paymentMethod}
                                </p>
                              )}
                            </div>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        {user?.role !== "driver" && (
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setEditingPayout(payout)}
                                data-testid={`button-edit-payout-${payout.id}`}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8">
                  <CreditCard className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium">No payouts found</h3>
                  <p className="text-muted-foreground">
                    {user?.role === "driver" ? "No payouts available yet." : "Generate payouts to get started."}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>

      {/* Edit Payout Dialog */}
      <Dialog open={!!editingPayout} onOpenChange={() => setEditingPayout(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Payout</DialogTitle>
          </DialogHeader>
          {editingPayout && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-payment-reference">Payment Reference</Label>
                <Input
                  id="edit-payment-reference"
                  placeholder="UPI/Bank Reference ID"
                  defaultValue={editingPayout.paymentReference || ""}
                  data-testid="input-edit-payment-reference"
                />
              </div>
              <div>
                <Label htmlFor="edit-payment-method">Payment Method</Label>
                <Select defaultValue={editingPayout.paymentMethod || ""}>
                  <SelectTrigger data-testid="select-edit-payment-method">
                    <SelectValue placeholder="Select method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="upi">UPI Transfer</SelectItem>
                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="cheque">Cheque</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-status">Status</Label>
                <Select defaultValue={editingPayout.status}>
                  <SelectTrigger data-testid="select-edit-status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-4">
                <Button
                  variant="outline"
                  onClick={() => setEditingPayout(null)}
                  data-testid="button-cancel-edit"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    // This would need proper form handling in a real implementation
                    setEditingPayout(null);
                  }}
                  data-testid="button-save-payout"
                >
                  Update Payout
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
