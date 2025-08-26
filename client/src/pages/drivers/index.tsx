import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import DriverForm from "@/components/forms/driver-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Users, UserCheck, UserX, Edit, Trash2, Calendar } from "lucide-react";
import type { Driver, InsertDriver } from "@shared/schema";

export default function Drivers() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: drivers, isLoading } = useQuery({
    queryKey: ["/api/drivers"],
    retry: false,
  });

  const addMutation = useMutation({
    mutationFn: async (data: InsertDriver) => {
      await apiRequest("POST", "/api/drivers", data);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Driver added successfully",
      });
      setIsAddDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["/api/drivers"] });
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
        description: "Failed to add driver",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<InsertDriver> }) => {
      await apiRequest("PUT", `/api/drivers/${id}`, data);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Driver updated successfully",
      });
      setEditingDriver(null);
      queryClient.invalidateQueries({ queryKey: ["/api/drivers"] });
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
        description: "Failed to update driver",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/drivers/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Driver deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/drivers"] });
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
        description: "Failed to delete driver",
        variant: "destructive",
      });
    },
  });

  const handleAddSubmit = (data: InsertDriver) => {
    addMutation.mutate(data);
  };

  const handleUpdateSubmit = (data: InsertDriver) => {
    if (editingDriver) {
      updateMutation.mutate({ id: editingDriver.id, data });
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this driver?")) {
      deleteMutation.mutate(id);
    }
  };

  const isLicenseExpiringSoon = (date: Date | string | null) => {
    if (!date) return false;
    const expiry = new Date(date);
    const today = new Date();
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30;
  };

  const activeDrivers = drivers?.filter((d: Driver) => d.isActive) || [];
  const inactiveDrivers = drivers?.filter((d: Driver) => !d.isActive) || [];

  return (
    <div className="flex h-screen bg-background">
      <Sidebar userRole={user?.role || "admin"} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Driver Management" />
        
        <main className="flex-1 overflow-auto p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Drivers</p>
                    <p className="text-2xl font-bold" data-testid="text-total-drivers">
                      {drivers?.length || 0}
                    </p>
                  </div>
                  <Users className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Drivers</p>
                    <p className="text-2xl font-bold text-green-600" data-testid="text-active-drivers">
                      {activeDrivers.length}
                    </p>
                  </div>
                  <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                    <UserCheck className="h-5 w-5 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Inactive Drivers</p>
                    <p className="text-2xl font-bold text-gray-600" data-testid="text-inactive-drivers">
                      {inactiveDrivers.length}
                    </p>
                  </div>
                  <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <UserX className="h-5 w-5 text-gray-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Earnings</p>
                    <p className="text-2xl font-bold text-blue-600" data-testid="text-total-earnings">
                      ₹{drivers?.reduce((sum, d: Driver) => 
                        sum + parseFloat(d.totalEarnings || '0'), 0
                      ).toLocaleString('en-IN') || '0'}
                    </p>
                  </div>
                  <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Drivers Table */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>All Drivers</CardTitle>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button data-testid="button-add-driver">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Driver
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-screen overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add New Driver</DialogTitle>
                  </DialogHeader>
                  <DriverForm
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
                  <p className="mt-2 text-muted-foreground">Loading drivers...</p>
                </div>
              ) : drivers?.length ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>License Number</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>License Expiry</TableHead>
                      <TableHead>Total Trips</TableHead>
                      <TableHead>Total Earnings</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {drivers.map((driver: Driver) => (
                      <TableRow key={driver.id} data-testid={`row-driver-${driver.id}`}>
                        <TableCell className="font-medium">
                          {driver.licenseNumber}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{driver.phoneNumber}</p>
                            <p className="text-sm text-muted-foreground">
                              {driver.address?.substring(0, 50)}...
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={driver.isActive ? "default" : "secondary"}>
                            {driver.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {driver.licenseExpiryDate ? (
                            <div className="flex items-center gap-2">
                              <span className="text-sm">
                                {new Date(driver.licenseExpiryDate).toLocaleDateString('en-IN')}
                              </span>
                              {isLicenseExpiringSoon(driver.licenseExpiryDate) && (
                                <Calendar className="h-4 w-4 text-amber-500" />
                              )}
                            </div>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="font-medium">{driver.totalTrips || 0}</span>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium text-green-600">
                            ₹{parseFloat(driver.totalEarnings || '0').toLocaleString('en-IN')}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditingDriver(driver)}
                              data-testid={`button-edit-driver-${driver.id}`}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(driver.id)}
                              className="text-destructive hover:text-destructive"
                              data-testid={`button-delete-driver-${driver.id}`}
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
                  <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium">No drivers found</h3>
                  <p className="text-muted-foreground">Add your first driver to get started.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingDriver} onOpenChange={() => setEditingDriver(null)}>
        <DialogContent className="max-w-4xl max-h-screen overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Driver</DialogTitle>
          </DialogHeader>
          {editingDriver && (
            <DriverForm
              onSubmit={handleUpdateSubmit}
              onCancel={() => setEditingDriver(null)}
              defaultValues={editingDriver}
              isSubmitting={updateMutation.isPending}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
