import { sql } from "drizzle-orm";
import { relations } from "drizzle-orm";
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  decimal,
  integer,
  boolean,
  pgEnum,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Enums
export const userRoleEnum = pgEnum("user_role", ["admin", "manager", "driver"]);
export const vehicleStatusEnum = pgEnum("vehicle_status", ["available", "on_duty", "in_service", "accident"]);
export const tripStatusEnum = pgEnum("trip_status", ["pending", "in_progress", "completed", "cancelled"]);
export const expenseTypeEnum = pgEnum("expense_type", ["fuel", "tolls", "repairs", "emi", "insurance", "maintenance", "other"]);
export const payoutStatusEnum = pgEnum("payout_status", ["pending", "paid", "failed"]);
export const alertTypeEnum = pgEnum("alert_type", ["insurance_expiry", "fitness_expiry", "service_due", "accident", "breakdown", "payout_pending"]);

// Session storage table (mandatory for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table (mandatory for Replit Auth)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: userRoleEnum("role").notNull().default("driver"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Vehicles table
export const vehicles = pgTable("vehicles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  registrationNumber: varchar("registration_number").notNull().unique(),
  model: varchar("model").notNull(),
  make: varchar("make").notNull(),
  year: integer("year").notNull(),
  color: varchar("color"),
  rcDocument: varchar("rc_document"),
  insuranceDocument: varchar("insurance_document"),
  permitDocument: varchar("permit_document"),
  fitnessDocument: varchar("fitness_document"),
  insuranceExpiryDate: timestamp("insurance_expiry_date"),
  fitnessExpiryDate: timestamp("fitness_expiry_date"),
  permitExpiryDate: timestamp("permit_expiry_date"),
  lastServiceDate: timestamp("last_service_date"),
  nextServiceDate: timestamp("next_service_date"),
  odometer: integer("odometer").default(0),
  status: vehicleStatusEnum("status").notNull().default("available"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Drivers table
export const drivers = pgTable("drivers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  licenseNumber: varchar("license_number").notNull().unique(),
  licenseExpiryDate: timestamp("license_expiry_date"),
  licenseDocument: varchar("license_document"),
  aadharNumber: varchar("aadhar_number"),
  aadharDocument: varchar("aadhar_document"),
  bankAccountNumber: varchar("bank_account_number"),
  bankIfscCode: varchar("bank_ifsc_code"),
  bankName: varchar("bank_name"),
  phoneNumber: varchar("phone_number"),
  address: text("address"),
  isActive: boolean("is_active").default(true),
  totalTrips: integer("total_trips").default(0),
  totalEarnings: decimal("total_earnings", { precision: 10, scale: 2 }).default("0"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Vehicle assignments
export const vehicleAssignments = pgTable("vehicle_assignments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  vehicleId: varchar("vehicle_id").references(() => vehicles.id).notNull(),
  driverId: varchar("driver_id").references(() => drivers.id).notNull(),
  assignedDate: timestamp("assigned_date").defaultNow(),
  unassignedDate: timestamp("unassigned_date"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Trips table
export const trips = pgTable("trips", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  vehicleId: varchar("vehicle_id").references(() => vehicles.id).notNull(),
  driverId: varchar("driver_id").references(() => drivers.id).notNull(),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time"),
  startLocation: text("start_location"),
  endLocation: text("end_location"),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  driverShare: decimal("driver_share", { precision: 10, scale: 2 }),
  companyShare: decimal("company_share", { precision: 10, scale: 2 }),
  distance: decimal("distance", { precision: 10, scale: 2 }),
  duration: integer("duration"), // in minutes
  status: tripStatusEnum("status").notNull().default("pending"),
  notes: text("notes"),
  createdBy: varchar("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Expenses table
export const expenses = pgTable("expenses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  vehicleId: varchar("vehicle_id").references(() => vehicles.id).notNull(),
  type: expenseTypeEnum("type").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  description: text("description"),
  receiptDocument: varchar("receipt_document"),
  expenseDate: timestamp("expense_date").notNull(),
  createdBy: varchar("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Payouts table
export const payouts = pgTable("payouts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  driverId: varchar("driver_id").references(() => drivers.id).notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  payoutDate: timestamp("payout_date"),
  status: payoutStatusEnum("status").notNull().default("pending"),
  paymentReference: varchar("payment_reference"),
  paymentMethod: varchar("payment_method"),
  fromDate: timestamp("from_date").notNull(),
  toDate: timestamp("to_date").notNull(),
  totalTrips: integer("total_trips").notNull(),
  totalRevenue: decimal("total_revenue", { precision: 10, scale: 2 }).notNull(),
  createdBy: varchar("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Maintenance logs
export const maintenanceLogs = pgTable("maintenance_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  vehicleId: varchar("vehicle_id").references(() => vehicles.id).notNull(),
  type: varchar("type").notNull(), // oil_change, tire_replacement, general_service
  description: text("description"),
  cost: decimal("cost", { precision: 10, scale: 2 }),
  serviceDate: timestamp("service_date").notNull(),
  nextServiceDate: timestamp("next_service_date"),
  odometerReading: integer("odometer_reading"),
  serviceCenter: varchar("service_center"),
  createdBy: varchar("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Alerts table
export const alerts = pgTable("alerts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  type: alertTypeEnum("type").notNull(),
  title: varchar("title").notNull(),
  message: text("message").notNull(),
  vehicleId: varchar("vehicle_id").references(() => vehicles.id),
  driverId: varchar("driver_id").references(() => drivers.id),
  isRead: boolean("is_read").default(false),
  priority: varchar("priority").notNull().default("medium"), // low, medium, high, critical
  expiryDate: timestamp("expiry_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  driver: one(drivers, { fields: [users.id], references: [drivers.userId] }),
  trips: many(trips),
  expenses: many(expenses),
  payouts: many(payouts),
  maintenanceLogs: many(maintenanceLogs),
}));

export const driversRelations = relations(drivers, ({ one, many }) => ({
  user: one(users, { fields: [drivers.userId], references: [users.id] }),
  assignments: many(vehicleAssignments),
  trips: many(trips),
  payouts: many(payouts),
}));

export const vehiclesRelations = relations(vehicles, ({ many }) => ({
  assignments: many(vehicleAssignments),
  trips: many(trips),
  expenses: many(expenses),
  maintenanceLogs: many(maintenanceLogs),
}));

export const vehicleAssignmentsRelations = relations(vehicleAssignments, ({ one }) => ({
  vehicle: one(vehicles, { fields: [vehicleAssignments.vehicleId], references: [vehicles.id] }),
  driver: one(drivers, { fields: [vehicleAssignments.driverId], references: [drivers.id] }),
}));

export const tripsRelations = relations(trips, ({ one }) => ({
  vehicle: one(vehicles, { fields: [trips.vehicleId], references: [vehicles.id] }),
  driver: one(drivers, { fields: [trips.driverId], references: [drivers.id] }),
  createdBy: one(users, { fields: [trips.createdBy], references: [users.id] }),
}));

export const expensesRelations = relations(expenses, ({ one }) => ({
  vehicle: one(vehicles, { fields: [expenses.vehicleId], references: [vehicles.id] }),
  createdBy: one(users, { fields: [expenses.createdBy], references: [users.id] }),
}));

export const payoutsRelations = relations(payouts, ({ one }) => ({
  driver: one(drivers, { fields: [payouts.driverId], references: [drivers.id] }),
  createdBy: one(users, { fields: [payouts.createdBy], references: [users.id] }),
}));

export const maintenanceLogsRelations = relations(maintenanceLogs, ({ one }) => ({
  vehicle: one(vehicles, { fields: [maintenanceLogs.vehicleId], references: [vehicles.id] }),
  createdBy: one(users, { fields: [maintenanceLogs.createdBy], references: [users.id] }),
}));

export const alertsRelations = relations(alerts, ({ one }) => ({
  vehicle: one(vehicles, { fields: [alerts.vehicleId], references: [vehicles.id] }),
  driver: one(drivers, { fields: [alerts.driverId], references: [drivers.id] }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  firstName: true,
  lastName: true,
  profileImageUrl: true,
  role: true,
});

export const insertVehicleSchema = createInsertSchema(vehicles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertDriverSchema = createInsertSchema(drivers).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  totalTrips: true,
  totalEarnings: true,
});

export const insertTripSchema = createInsertSchema(trips).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  driverShare: true,
  companyShare: true,
});

export const insertExpenseSchema = createInsertSchema(expenses).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPayoutSchema = createInsertSchema(payouts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMaintenanceLogSchema = createInsertSchema(maintenanceLogs).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAlertSchema = createInsertSchema(alerts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type Vehicle = typeof vehicles.$inferSelect;
export type InsertVehicle = z.infer<typeof insertVehicleSchema>;
export type Driver = typeof drivers.$inferSelect;
export type InsertDriver = z.infer<typeof insertDriverSchema>;
export type Trip = typeof trips.$inferSelect;
export type InsertTrip = z.infer<typeof insertTripSchema>;
export type Expense = typeof expenses.$inferSelect;
export type InsertExpense = z.infer<typeof insertExpenseSchema>;
export type Payout = typeof payouts.$inferSelect;
export type InsertPayout = z.infer<typeof insertPayoutSchema>;
export type MaintenanceLog = typeof maintenanceLogs.$inferSelect;
export type InsertMaintenanceLog = z.infer<typeof insertMaintenanceLogSchema>;
export type Alert = typeof alerts.$inferSelect;
export type InsertAlert = z.infer<typeof insertAlertSchema>;
export type VehicleAssignment = typeof vehicleAssignments.$inferSelect;
