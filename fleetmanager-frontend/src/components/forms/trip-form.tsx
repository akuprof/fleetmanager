import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertTripSchema, type InsertTrip } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { calculateRevenueSplit, formatCurrency } from "@/lib/revenue-calculator";
import { useEffect, useState } from "react";

interface TripFormProps {
  onSubmit: (data: InsertTrip) => void;
  onCancel: () => void;
  defaultValues?: Partial<InsertTrip>;
  isSubmitting?: boolean;
}

export default function TripForm({ onSubmit, onCancel, defaultValues, isSubmitting }: TripFormProps) {
  const [revenuePreview, setRevenuePreview] = useState<ReturnType<typeof calculateRevenueSplit> | null>(null);

  const { data: vehicles } = useQuery({
    queryKey: ["/api/vehicles"],
    retry: false,
  });

  const { data: drivers } = useQuery({
    queryKey: ["/api/drivers"],
    retry: false,
  });

  const form = useForm<InsertTrip>({
    resolver: zodResolver(insertTripSchema),
    defaultValues: {
      vehicleId: "",
      driverId: "",
      startTime: new Date(),
      totalAmount: "0",
      status: "pending",
      startLocation: "",
      endLocation: "",
      distance: "0",
      duration: 0,
      notes: "",
      ...defaultValues,
    },
  });

  const watchedAmount = form.watch("totalAmount");

  useEffect(() => {
    if (watchedAmount && parseFloat(watchedAmount) > 0) {
      const split = calculateRevenueSplit(parseFloat(watchedAmount));
      setRevenuePreview(split);
    } else {
      setRevenuePreview(null);
    }
  }, [watchedAmount]);

  const availableVehicles = vehicles?.filter((v: any) => 
    v.status === 'available' || v.status === 'on_duty'
  ) || [];
  
  const activeDrivers = drivers?.filter((d: any) => d.isActive) || [];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Trip Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="vehicleId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vehicle</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-vehicle">
                          <SelectValue placeholder="Select vehicle" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableVehicles.map((vehicle: any) => (
                          <SelectItem key={vehicle.id} value={vehicle.id}>
                            {vehicle.registrationNumber} - {vehicle.make} {vehicle.model}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="driverId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Driver</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-driver">
                          <SelectValue placeholder="Select driver" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {activeDrivers.map((driver: any) => (
                          <SelectItem key={driver.id} value={driver.id}>
                            {driver.licenseNumber} - {driver.phoneNumber}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Time</FormLabel>
                    <FormControl>
                      <Input 
                        type="datetime-local" 
                        {...field}
                        value={field.value ? new Date(field.value.getTime() - field.value.getTimezoneOffset() * 60000).toISOString().slice(0, -1) : ''}
                        onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value) : new Date())}
                        data-testid="input-start-time"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Time</FormLabel>
                    <FormControl>
                      <Input 
                        type="datetime-local" 
                        {...field}
                        value={field.value ? new Date(field.value.getTime() - field.value.getTimezoneOffset() * 60000).toISOString().slice(0, -1) : ''}
                        onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value) : null)}
                        data-testid="input-end-time"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startLocation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Location</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter start location" 
                        {...field}
                        value={field.value || ''}
                        data-testid="input-start-location"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endLocation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Location</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter end location" 
                        {...field}
                        value={field.value || ''}
                        data-testid="input-end-location"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="distance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Distance (km)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.1"
                        placeholder="25.5" 
                        {...field}
                        value={field.value || ''}
                        data-testid="input-distance"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration (minutes)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="45" 
                        {...field}
                        value={field.value || ''}
                        onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : null)}
                        data-testid="input-duration"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-trip-status">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Additional trip notes..." 
                      className="resize-none"
                      {...field}
                      value={field.value || ''}
                      data-testid="textarea-notes"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="totalAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Amount (₹)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.01"
                      placeholder="1000.00" 
                      {...field} 
                      data-testid="input-total-amount"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {revenuePreview && (
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-3">Revenue Split Preview</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-background rounded">
                    <p className="text-sm text-muted-foreground">Driver Share ({revenuePreview.driverPercentage}%)</p>
                    <p className="text-xl font-bold text-green-600" data-testid="text-driver-share-preview">
                      {formatCurrency(revenuePreview.driverShare)}
                    </p>
                  </div>
                  <div className="text-center p-3 bg-background rounded">
                    <p className="text-sm text-muted-foreground">Company Share ({revenuePreview.companyPercentage}%)</p>
                    <p className="text-xl font-bold text-blue-600" data-testid="text-company-share-preview">
                      {formatCurrency(revenuePreview.companyShare)}
                    </p>
                  </div>
                </div>
                <div className="mt-3 text-center">
                  <Badge variant={parseFloat(watchedAmount) > 2500 ? "default" : "secondary"}>
                    {parseFloat(watchedAmount) > 2500 ? "Performance Bonus Rate" : "Standard Rate"}
                  </Badge>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            data-testid="button-cancel"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            data-testid="button-submit"
          >
            {isSubmitting ? "Saving..." : defaultValues ? "Update Trip" : "Add Trip"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
