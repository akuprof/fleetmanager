
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertDutyLogSchema, type InsertDutyLog } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Camera, Upload, Clock, Fuel, Car, FileText } from "lucide-react";
import { useState } from "react";

interface DutyFormProps {
  onSubmit: (data: InsertDutyLog) => void;
  onCancel: () => void;
  dutyType: "start" | "end";
  driverId: string;
  defaultValues?: Partial<InsertDutyLog>;
  isSubmitting?: boolean;
}

export default function DutyForm({ onSubmit, onCancel, dutyType, driverId, defaultValues, isSubmitting }: DutyFormProps) {
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [receiptPreviews, setReceiptPreviews] = useState<string[]>([]);

  const { data: vehicles } = useQuery({
    queryKey: ["/api/vehicles"],
    retry: false,
  });

  const { data: assignedVehicle } = useQuery({
    queryKey: ["/api/vehicle-assignments/active", driverId],
    retry: false,
  });

  const form = useForm<InsertDutyLog>({
    resolver: zodResolver(insertDutyLogSchema),
    defaultValues: {
      driverId,
      vehicleId: assignedVehicle?.vehicleId || "",
      dutyStatus: dutyType === "start" ? "on_duty" : "off_duty",
      startTime: dutyType === "start" ? new Date() : undefined,
      endTime: dutyType === "end" ? new Date() : undefined,
      startOdometer: 0,
      startCngLevel: "0",
      carCondition: "good",
      endOdometer: 0,
      endCngLevel: "0",
      totalExpenses: "0",
      ...defaultValues,
    },
  });

  const availableVehicles = vehicles?.filter((v: any) => 
    v.status === 'available' || v.status === 'on_duty'
  ) || [];

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>, field: any) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        setPhotoPreview(dataUrl);
        field.onChange(dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleReceiptUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const newPreviews: string[] = [];
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        newPreviews.push(dataUrl);
        if (newPreviews.length === files.length) {
          setReceiptPreviews(prev => [...prev, ...newPreviews]);
          form.setValue("expenseReceipts", JSON.stringify([...receiptPreviews, ...newPreviews]));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              {dutyType === "start" ? "Start Duty" : "End Duty"}
              <Badge variant={dutyType === "start" ? "default" : "destructive"}>
                {dutyType === "start" ? "ON DUTY" : "OFF DUTY"}
              </Badge>
            </CardTitle>
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
                name={dutyType === "start" ? "startTime" : "endTime"}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{dutyType === "start" ? "Start Time" : "End Time"}</FormLabel>
                    <FormControl>
                      <Input 
                        type="datetime-local" 
                        {...field}
                        value={field.value ? new Date(field.value.getTime() - field.value.getTimezoneOffset() * 60000).toISOString().slice(0, -1) : ''}
                        onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value) : new Date())}
                        data-testid="input-duty-time"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {dutyType === "start" && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="startOdometer"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Dashboard Odometer (km)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="125000" 
                            {...field}
                            value={field.value || ''}
                            onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : 0)}
                            data-testid="input-start-odometer"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="startCngLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CNG Level (%)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.1"
                            placeholder="75.5" 
                            {...field}
                            value={field.value || ''}
                            data-testid="input-start-cng-level"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="carCondition"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Car Condition</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-car-condition">
                            <SelectValue placeholder="Select condition" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="excellent">Excellent</SelectItem>
                          <SelectItem value="good">Good</SelectItem>
                          <SelectItem value="fair">Fair</SelectItem>
                          <SelectItem value="needs_attention">Needs Attention</SelectItem>
                          <SelectItem value="poor">Poor</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="odometerPhoto"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Camera className="h-4 w-4" />
                        Odometer Photo (Required)
                      </FormLabel>
                      <FormControl>
                        <div className="space-y-2">
                          <Input 
                            type="file" 
                            accept="image/*"
                            onChange={(e) => handlePhotoUpload(e, field)}
                            data-testid="input-odometer-photo"
                            className="cursor-pointer"
                          />
                          {photoPreview && (
                            <div className="relative">
                              <img 
                                src={photoPreview} 
                                alt="Odometer" 
                                className="w-32 h-32 object-cover rounded border"
                              />
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="startNotes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Duty Notes</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Any observations about the vehicle or starting conditions..." 
                          className="resize-none"
                          {...field}
                          value={field.value || ''}
                          data-testid="textarea-start-notes"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            {dutyType === "end" && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="endOdometer"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Closing Odometer (km)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="125150" 
                            {...field}
                            value={field.value || ''}
                            onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : 0)}
                            data-testid="input-end-odometer"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="endCngLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Closing CNG Level (%)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.1"
                            placeholder="25.0" 
                            {...field}
                            value={field.value || ''}
                            data-testid="input-end-cng-level"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="totalExpenses"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Expenses (₹)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01"
                          placeholder="500.00" 
                          {...field} 
                          data-testid="input-total-expenses"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="expenseReceipts"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Expense Receipt Attachments
                      </FormLabel>
                      <FormControl>
                        <div className="space-y-2">
                          <Input 
                            type="file" 
                            accept="image/*"
                            multiple
                            onChange={handleReceiptUpload}
                            data-testid="input-expense-receipts"
                            className="cursor-pointer"
                          />
                          {receiptPreviews.length > 0 && (
                            <div className="grid grid-cols-4 gap-2">
                              {receiptPreviews.map((preview, index) => (
                                <img 
                                  key={index}
                                  src={preview} 
                                  alt={`Receipt ${index + 1}`} 
                                  className="w-16 h-16 object-cover rounded border"
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="paymentDetails"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Details</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Payment method, transaction details, etc..." 
                          className="resize-none"
                          {...field}
                          value={field.value || ''}
                          data-testid="textarea-payment-details"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="endNotes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Duty Notes</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Any issues, observations, or feedback about the duty..." 
                          className="resize-none"
                          {...field}
                          value={field.value || ''}
                          data-testid="textarea-end-notes"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
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
            variant={dutyType === "start" ? "default" : "destructive"}
          >
            {isSubmitting ? "Saving..." : dutyType === "start" ? "Start Duty" : "End Duty"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
