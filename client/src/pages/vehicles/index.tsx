import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import VehicleForm from "@/components/forms/vehicle-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Car, Calendar, AlertTriangle, Edit, Trash2 } from "lucide-react";
import type { Vehicle, InsertVehicle } from "@shared/schema";

export default function Vehicles() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: vehicles, isLoading } = useQuery({
    queryKey: ["/api/vehicles"],
    retry: false,
  });

  const addMutation = useMutation({
    mutationFn: async (data: InsertVehicle) => {
      await apiRequest("POST", "/api/vehicles", data);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Vehicle added successfully",
      });
      setIsAddDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["/api/vehicles"] });
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
        description: "Failed to add vehicle",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<InsertVehicle> }) => {
      await apiRequest("PUT", `/api/vehicles/${id}`, data);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Vehicle updated successfully",
      });
      setEditingVehicle(null);
      queryClient.invalidateQueries({ queryKey: ["/api/vehicles"] });
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
        description: "Failed to update vehicle",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/vehicles/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Vehicle deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/vehicles"] });
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
        description: "Failed to delete vehicle",
        variant: "destructive",
      });
    },
  });

  const handleAddSubmit = (data: InsertVehicle) => {
    addMutation.mutate(data);
  };

  const handleUpdateSubmit = (data: InsertVehicle) => {
    if (editingVehicle) {
      updateMutation.mutate({ id: editingVehicle.id, data });
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this vehicle?")) {
      deleteMutation.mutate(id);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800";
      case "on_duty":
        return "bg-blue-100 text-blue-800";
      case "in_service":
        return "bg-amber-100 text-amber-800";
      case "accident":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const isExpiringSoon = (date: Date | string | null) => {
    if (!date) return false;
    const expiry = new Date(date);
    const today = new Date();
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30;
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar userRole={user?.role || "admin"} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Vehicle Management" />
        
        <main className="flex-1 overflow-auto p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Vehicles</p>
                    <p className="text-2xl font-bold" data-testid="text-total-vehicles">
                      {vehicles?.length || 0}
                    </p>
                  </div>
                  <Car className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Available</p>
                    <p className="text-2xl font-bold text-green-600" data-testid="text-available-vehicles">
                      {vehicles?.filter((v: Vehicle) => v.status === "available").length || 0}
                    </p>
                  </div>
                  <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Car className="h-5 w-5 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">On Duty</p>
                    <p className="text-2xl font-bold text-blue-600" data-testid="text-onduty-vehicles">
                      {vehicles?.filter((v: Vehicle) => v.status === "on_duty").length || 0}
                    </p>
                  </div>
                  <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Car className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Need Service</p>
                    <p className="text-2xl font-bold text-amber-600" data-testid="text-service-vehicles">
                      {vehicles?.filter((v: Vehicle) => v.status === "in_service").length || 0}
                    </p>
                  </div>
                  <div className="h-8 w-8 bg-amber-100 rounded-full flex items-center justify-center">
                    <AlertTriangle className="h-5 w-5 text-amber-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Vehicles Table */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>All Vehicles</CardTitle>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button data-testid="button-add-vehicle">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Vehicle
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-screen overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add New Vehicle</DialogTitle>
                  </DialogHeader>
                  <VehicleForm
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
                  <p className="mt-2 text-muted-foreground">Loading vehicles...</p>
                </div>
              ) : vehicles?.length ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Registration</TableHead>
                      <TableHead>Make & Model</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Odometer</TableHead>
                      <TableHead>Insurance Expiry</TableHead>
                      <TableHead>Fitness Expiry</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {vehicles.map((vehicle: Vehicle) => (
                      <TableRow key={vehicle.id} data-testid={`row-vehicle-${vehicle.id}`}>
                        <TableCell className="font-medium">
                          {vehicle.registrationNumber}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{vehicle.make} {vehicle.model}</p>
                            <p className="text-sm text-muted-foreground">{vehicle.year} • {vehicle.color}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(vehicle.status)} variant="secondary">
                            {vehicle.status?.replace('_', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell>{vehicle.odometer?.toLocaleString()} km</TableCell>
                        <TableCell>
                          {vehicle.insuranceExpiryDate ? (
                            <div className="flex items-center gap-2">
                              <span className="text-sm">
                                {new Date(vehicle.insuranceExpiryDate).toLocaleDateString('en-IN')}
                              </span>
                              {isExpiringSoon(vehicle.insuranceExpiryDate) && (
                                <AlertTriangle className="h-4 w-4 text-amber-500" />
                              )}
                            </div>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {vehicle.fitnessExpiryDate ? (
                            <div className="flex items-center gap-2">
                              <span className="text-sm">
                                {new Date(vehicle.fitnessExpiryDate).toLocaleDateString('en-IN')}
                              </span>
                              {isExpiringSoon(vehicle.fitnessExpiryDate) && (
                                <AlertTriangle className="h-4 w-4 text-amber-500" />
                              )}
                            </div>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditingVehicle(vehicle)}
                              data-testid={`button-edit-vehicle-${vehicle.id}`}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(vehicle.id)}
                              className="text-destructive hover:text-destructive"
                              data-testid={`button-delete-vehicle-${vehicle.id}`}
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
                  <Car className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium">No vehicles found</h3>
                  <p className="text-muted-foreground">Add your first vehicle to get started.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingVehicle} onOpenChange={() => setEditingVehicle(null)}>
        <DialogContent className="max-w-4xl max-h-screen overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Vehicle</DialogTitle>
          </DialogHeader>
          {editingVehicle && (
            <VehicleForm
              onSubmit={handleUpdateSubmit}
              onCancel={() => setEditingVehicle(null)}
              defaultValues={editingVehicle}
              isSubmitting={updateMutation.isPending}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
