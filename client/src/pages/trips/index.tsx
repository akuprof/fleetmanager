import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import TripForm from "@/components/forms/trip-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Route, Clock, CheckCircle, XCircle, Edit, Trash2 } from "lucide-react";
import { formatCurrency } from "@/lib/revenue-calculator";
import type { Trip, InsertTrip } from "@shared/schema";

export default function Trips() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: trips, isLoading } = useQuery({
    queryKey: user?.role === "driver" ? ["/api/trips/driver", user?.id] : ["/api/trips"],
    retry: false,
  });

  const { data: vehicles } = useQuery({
    queryKey: ["/api/vehicles"],
    retry: false,
    enabled: user?.role !== "driver",
  });

  const { data: drivers } = useQuery({
    queryKey: ["/api/drivers"],
    retry: false,
    enabled: user?.role !== "driver",
  });

  const addMutation = useMutation({
    mutationFn: async (data: InsertTrip) => {
      await apiRequest("POST", "/api/trips", data);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Trip added successfully",
      });
      setIsAddDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["/api/trips"] });
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
        description: "Failed to add trip",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<InsertTrip> }) => {
      await apiRequest("PUT", `/api/trips/${id}`, data);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Trip updated successfully",
      });
      setEditingTrip(null);
      queryClient.invalidateQueries({ queryKey: ["/api/trips"] });
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
        description: "Failed to update trip",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/trips/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Trip deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/trips"] });
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
        description: "Failed to delete trip",
        variant: "destructive",
      });
    },
  });

  const handleAddSubmit = (data: InsertTrip) => {
    addMutation.mutate(data);
  };

  const handleUpdateSubmit = (data: InsertTrip) => {
    if (editingTrip) {
      updateMutation.mutate({ id: editingTrip.id, data });
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this trip?")) {
      deleteMutation.mutate(id);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-amber-100 text-amber-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4" />;
      case "in_progress":
        return <Clock className="h-4 w-4" />;
      case "cancelled":
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getVehicleInfo = (vehicleId: string) => {
    const vehicle = vehicles?.find((v: any) => v.id === vehicleId);
    return vehicle ? `${vehicle.registrationNumber} - ${vehicle.make} ${vehicle.model}` : vehicleId;
  };

  const getDriverInfo = (driverId: string) => {
    const driver = drivers?.find((d: any) => d.id === driverId);
    return driver ? `${driver.licenseNumber} - ${driver.phoneNumber}` : driverId;
  };

  const completedTrips = trips?.filter((t: Trip) => t.status === "completed") || [];
  const inProgressTrips = trips?.filter((t: Trip) => t.status === "in_progress") || [];
  const pendingTrips = trips?.filter((t: Trip) => t.status === "pending") || [];
  const totalRevenue = completedTrips.reduce((sum, t: Trip) => sum + parseFloat(t.totalAmount), 0);

  return (
    <div className="flex h-screen bg-background">
      <Sidebar userRole={user?.role || "admin"} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Trip Management" />
        
        <main className="flex-1 overflow-auto p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Trips</p>
                    <p className="text-2xl font-bold" data-testid="text-total-trips">
                      {trips?.length || 0}
                    </p>
                  </div>
                  <Route className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Completed</p>
                    <p className="text-2xl font-bold text-green-600" data-testid="text-completed-trips">
                      {completedTrips.length}
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
                    <p className="text-sm text-muted-foreground">In Progress</p>
                    <p className="text-2xl font-bold text-blue-600" data-testid="text-inprogress-trips">
                      {inProgressTrips.length}
                    </p>
                  </div>
                  <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Clock className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Revenue</p>
                    <p className="text-2xl font-bold text-purple-600" data-testid="text-trips-revenue">
                      {formatCurrency(totalRevenue)}
                    </p>
                  </div>
                  <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <Route className="h-5 w-5 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Trips Table */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>All Trips</CardTitle>
              {user?.role !== "driver" && (
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button data-testid="button-add-trip">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Trip
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-screen overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Add New Trip</DialogTitle>
                    </DialogHeader>
                    <TripForm
                      onSubmit={handleAddSubmit}
                      onCancel={() => setIsAddDialogOpen(false)}
                      isSubmitting={addMutation.isPending}
                    />
                  </DialogContent>
                </Dialog>
              )}
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-2 text-muted-foreground">Loading trips...</p>
                </div>
              ) : trips?.length ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Vehicle</TableHead>
                      {user?.role !== "driver" && <TableHead>Driver</TableHead>}
                      <TableHead>Route</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Start Time</TableHead>
                      <TableHead>Distance</TableHead>
                      <TableHead>Total Amount</TableHead>
                      {user?.role === "driver" && <TableHead>Your Share</TableHead>}
                      {user?.role !== "driver" && <TableHead>Actions</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {trips.map((trip: Trip) => (
                      <TableRow key={trip.id} data-testid={`row-trip-${trip.id}`}>
                        <TableCell className="font-medium">
                          {user?.role !== "driver" ? getVehicleInfo(trip.vehicleId) : trip.vehicleId?.substring(0, 8)}
                        </TableCell>
                        {user?.role !== "driver" && (
                          <TableCell>
                            {getDriverInfo(trip.driverId)}
                          </TableCell>
                        )}
                        <TableCell>
                          <div>
                            <p className="font-medium text-sm">
                              {trip.startLocation || "N/A"} → {trip.endLocation || "N/A"}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(trip.status)} variant="secondary">
                            <div className="flex items-center gap-1">
                              {getStatusIcon(trip.status)}
                              {trip.status?.replace('_', ' ')}
                            </div>
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(trip.startTime).toLocaleString('en-IN')}
                        </TableCell>
                        <TableCell>
                          {trip.distance ? `${trip.distance} km` : "-"}
                        </TableCell>
                        <TableCell className="font-medium">
                          {formatCurrency(parseFloat(trip.totalAmount))}
                        </TableCell>
                        {user?.role === "driver" && (
                          <TableCell className="font-medium text-green-600">
                            {trip.driverShare ? formatCurrency(parseFloat(trip.driverShare)) : "-"}
                          </TableCell>
                        )}
                        {user?.role !== "driver" && (
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setEditingTrip(trip)}
                                data-testid={`button-edit-trip-${trip.id}`}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(trip.id)}
                                className="text-destructive hover:text-destructive"
                                data-testid={`button-delete-trip-${trip.id}`}
                              >
                                <Trash2 className="h-4 w-4" />
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
                  <Route className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium">No trips found</h3>
                  <p className="text-muted-foreground">
                    {user?.role === "driver" ? "No trips assigned to you yet." : "Add your first trip to get started."}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>

      {/* Edit Dialog */}
      {user?.role !== "driver" && (
        <Dialog open={!!editingTrip} onOpenChange={() => setEditingTrip(null)}>
          <DialogContent className="max-w-4xl max-h-screen overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Trip</DialogTitle>
            </DialogHeader>
            {editingTrip && (
              <TripForm
                onSubmit={handleUpdateSubmit}
                onCancel={() => setEditingTrip(null)}
                defaultValues={editingTrip}
                isSubmitting={updateMutation.isPending}
              />
            )}
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
