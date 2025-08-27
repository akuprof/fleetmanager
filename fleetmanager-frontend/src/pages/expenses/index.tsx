import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import ExpenseForm from "@/components/forms/expense-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, CreditCard, Fuel, Car, Wrench, FileText, Edit, Trash2, ExternalLink } from "lucide-react";
import { formatCurrency } from "@/lib/revenue-calculator";
import type { Expense, InsertExpense } from "@shared/schema";

export default function Expenses() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: expenses, isLoading } = useQuery({
    queryKey: ["/api/expenses"],
    retry: false,
  });

  const { data: vehicles } = useQuery({
    queryKey: ["/api/vehicles"],
    retry: false,
  });

  const addMutation = useMutation({
    mutationFn: async (data: InsertExpense) => {
      await apiRequest("POST", "/api/expenses", data);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Expense added successfully",
      });
      setIsAddDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["/api/expenses"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/metrics"] });
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
        description: "Failed to add expense",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<InsertExpense> }) => {
      await apiRequest("PUT", `/api/expenses/${id}`, data);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Expense updated successfully",
      });
      setEditingExpense(null);
      queryClient.invalidateQueries({ queryKey: ["/api/expenses"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/metrics"] });
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
        description: "Failed to update expense",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/expenses/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Expense deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/expenses"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/metrics"] });
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
        description: "Failed to delete expense",
        variant: "destructive",
      });
    },
  });

  const handleAddSubmit = (data: InsertExpense) => {
    addMutation.mutate(data);
  };

  const handleUpdateSubmit = (data: InsertExpense) => {
    if (editingExpense) {
      updateMutation.mutate({ id: editingExpense.id, data });
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      deleteMutation.mutate(id);
    }
  };

  const getExpenseTypeIcon = (type: string) => {
    switch (type) {
      case "fuel":
        return <Fuel className="h-4 w-4" />;
      case "repairs":
      case "maintenance":
        return <Wrench className="h-4 w-4" />;
      default:
        return <CreditCard className="h-4 w-4" />;
    }
  };

  const getExpenseTypeColor = (type: string) => {
    switch (type) {
      case "fuel":
        return "bg-blue-100 text-blue-800";
      case "repairs":
      case "maintenance":
        return "bg-amber-100 text-amber-800";
      case "insurance":
        return "bg-green-100 text-green-800";
      case "emi":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getVehicleInfo = (vehicleId: string) => {
    const vehicle = vehicles?.find((v: any) => v.id === vehicleId);
    return vehicle ? `${vehicle.registrationNumber} - ${vehicle.make} ${vehicle.model}` : vehicleId;
  };

  // Calculate expense statistics
  const totalExpenses = expenses?.reduce((sum: number, expense: Expense) => 
    sum + parseFloat(expense.amount), 0
  ) || 0;

  const expensesByType = expenses?.reduce((acc: Record<string, number>, expense: Expense) => {
    acc[expense.type] = (acc[expense.type] || 0) + parseFloat(expense.amount);
    return acc;
  }, {}) || {};

  // Get this month's expenses
  const thisMonth = new Date();
  const monthStart = new Date(thisMonth.getFullYear(), thisMonth.getMonth(), 1);
  const monthExpenses = expenses?.filter((expense: Expense) => 
    new Date(expense.expenseDate) >= monthStart
  ) || [];
  const monthlyTotal = monthExpenses.reduce((sum: number, expense: Expense) => 
    sum + parseFloat(expense.amount), 0
  );

  return (
    <div className="flex h-screen bg-background">
      <Sidebar userRole={user?.role || "admin"} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Expense Management" />
        
        <main className="flex-1 overflow-auto p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Expenses</p>
                    <p className="text-2xl font-bold text-red-600" data-testid="text-total-expenses">
                      {formatCurrency(totalExpenses)}
                    </p>
                  </div>
                  <CreditCard className="h-8 w-8 text-red-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">This Month</p>
                    <p className="text-2xl font-bold text-orange-600" data-testid="text-monthly-expenses">
                      {formatCurrency(monthlyTotal)}
                    </p>
                  </div>
                  <div className="h-8 w-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <CreditCard className="h-5 w-5 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Fuel Expenses</p>
                    <p className="text-2xl font-bold text-blue-600" data-testid="text-fuel-expenses">
                      {formatCurrency(expensesByType.fuel || 0)}
                    </p>
                  </div>
                  <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Fuel className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Maintenance</p>
                    <p className="text-2xl font-bold text-amber-600" data-testid="text-maintenance-expenses">
                      {formatCurrency((expensesByType.repairs || 0) + (expensesByType.maintenance || 0))}
                    </p>
                  </div>
                  <div className="h-8 w-8 bg-amber-100 rounded-full flex items-center justify-center">
                    <Wrench className="h-5 w-5 text-amber-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Expenses Table */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>All Expenses</CardTitle>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button data-testid="button-add-expense">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Expense
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-screen overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add New Expense</DialogTitle>
                  </DialogHeader>
                  <ExpenseForm
                    onSubmit={handleAddSubmit}
                    onCancel={() => setIsAddDialogOpen(false)}
                    isSubmitting={addMutation.isPending}
                  />
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-2 text-muted-foreground">Loading expenses...</p>
                </div>
              ) : expenses?.length ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Vehicle</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Receipt</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {expenses.map((expense: Expense) => (
                      <TableRow key={expense.id} data-testid={`row-expense-${expense.id}`}>
                        <TableCell className="font-medium">
                          <div>
                            <p className="font-medium">{getVehicleInfo(expense.vehicleId)}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getExpenseTypeColor(expense.type)} variant="secondary">
                            <div className="flex items-center gap-1">
                              {getExpenseTypeIcon(expense.type)}
                              {expense.type}
                            </div>
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-xs">
                            <p className="text-sm truncate" title={expense.description || ""}>
                              {expense.description || "-"}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Date(expense.expenseDate).toLocaleDateString('en-IN')}
                        </TableCell>
                        <TableCell className="font-medium text-red-600">
                          {formatCurrency(parseFloat(expense.amount))}
                        </TableCell>
                        <TableCell>
                          {expense.receiptDocument ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => window.open(expense.receiptDocument!, '_blank')}
                              data-testid={`button-view-receipt-${expense.id}`}
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditingExpense(expense)}
                              data-testid={`button-edit-expense-${expense.id}`}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(expense.id)}
                              className="text-destructive hover:text-destructive"
                              data-testid={`button-delete-expense-${expense.id}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8">
                  <CreditCard className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium">No expenses found</h3>
                  <p className="text-muted-foreground">Add your first expense to get started.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingExpense} onOpenChange={() => setEditingExpense(null)}>
        <DialogContent className="max-w-2xl max-h-screen overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Expense</DialogTitle>
          </DialogHeader>
          {editingExpense && (
            <ExpenseForm
              onSubmit={handleUpdateSubmit}
              onCancel={() => setEditingExpense(null)}
              defaultValues={editingExpense}
              isSubmitting={updateMutation.isPending}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
