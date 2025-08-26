import {
  users,
  vehicles,
  drivers,
  trips,
  expenses,
  payouts,
  maintenanceLogs,
  alerts,
  vehicleAssignments,
  type User,
  type UpsertUser,
  type Vehicle,
  type InsertVehicle,
  type Driver,
  type InsertDriver,
  type Trip,
  type InsertTrip,
  type Expense,
  type InsertExpense,
  type Payout,
  type InsertPayout,
  type MaintenanceLog,
  type InsertMaintenanceLog,
  type Alert,
  type InsertAlert,
  type VehicleAssignment,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, gte, lte, sql, or } from "drizzle-orm";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Vehicle operations
  getVehicles(): Promise<Vehicle[]>;
  getVehicle(id: string): Promise<Vehicle | undefined>;
  createVehicle(vehicle: InsertVehicle): Promise<Vehicle>;
  updateVehicle(id: string, vehicle: Partial<InsertVehicle>): Promise<Vehicle>;
  deleteVehicle(id: string): Promise<void>;
  getVehiclesByStatus(status: string): Promise<Vehicle[]>;
  
  // Driver operations
  getDrivers(): Promise<Driver[]>;
  getDriver(id: string): Promise<Driver | undefined>;
  getDriverByUserId(userId: string): Promise<Driver | undefined>;
  createDriver(driver: InsertDriver): Promise<Driver>;
  updateDriver(id: string, driver: Partial<InsertDriver>): Promise<Driver>;
  deleteDriver(id: string): Promise<void>;
  
  // Trip operations
  getTrips(): Promise<Trip[]>;
  getTrip(id: string): Promise<Trip | undefined>;
  createTrip(trip: InsertTrip): Promise<Trip>;
  updateTrip(id: string, trip: Partial<InsertTrip>): Promise<Trip>;
  deleteTrip(id: string): Promise<void>;
  getTripsByDriver(driverId: string): Promise<Trip[]>;
  getTripsByVehicle(vehicleId: string): Promise<Trip[]>;
  getTripsByDateRange(startDate: Date, endDate: Date): Promise<Trip[]>;
  
  // Expense operations
  getExpenses(): Promise<Expense[]>;
  getExpense(id: string): Promise<Expense | undefined>;
  createExpense(expense: InsertExpense): Promise<Expense>;
  updateExpense(id: string, expense: Partial<InsertExpense>): Promise<Expense>;
  deleteExpense(id: string): Promise<void>;
  getExpensesByVehicle(vehicleId: string): Promise<Expense[]>;
  
  // Payout operations
  getPayouts(): Promise<Payout[]>;
  getPayout(id: string): Promise<Payout | undefined>;
  createPayout(payout: InsertPayout): Promise<Payout>;
  updatePayout(id: string, payout: Partial<InsertPayout>): Promise<Payout>;
  deletePayout(id: string): Promise<void>;
  getPayoutsByDriver(driverId: string): Promise<Payout[]>;
  getPendingPayouts(): Promise<Payout[]>;
  
  // Maintenance operations
  getMaintenanceLogs(): Promise<MaintenanceLog[]>;
  getMaintenanceLog(id: string): Promise<MaintenanceLog | undefined>;
  createMaintenanceLog(log: InsertMaintenanceLog): Promise<MaintenanceLog>;
  updateMaintenanceLog(id: string, log: Partial<InsertMaintenanceLog>): Promise<MaintenanceLog>;
  deleteMaintenanceLog(id: string): Promise<void>;
  getMaintenanceLogsByVehicle(vehicleId: string): Promise<MaintenanceLog[]>;
  
  // Alert operations
  getAlerts(): Promise<Alert[]>;
  getAlert(id: string): Promise<Alert | undefined>;
  createAlert(alert: InsertAlert): Promise<Alert>;
  updateAlert(id: string, alert: Partial<InsertAlert>): Promise<Alert>;
  deleteAlert(id: string): Promise<void>;
  getUnreadAlerts(): Promise<Alert[]>;
  markAlertAsRead(id: string): Promise<void>;
  
  // Vehicle Assignment operations
  assignVehicleToDriver(vehicleId: string, driverId: string): Promise<VehicleAssignment>;
  unassignVehicleFromDriver(assignmentId: string): Promise<void>;
  getActiveAssignments(): Promise<VehicleAssignment[]>;
  getDriverCurrentVehicle(driverId: string): Promise<VehicleAssignment | undefined>;
  
  // Analytics operations
  getDashboardMetrics(): Promise<{
    totalRevenue: number;
    netProfit: number;
    activeVehicles: number;
    totalDrivers: number;
  }>;
  getTopPerformingVehicles(limit: number): Promise<Vehicle[]>;
  getRecentTrips(limit: number): Promise<Trip[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Vehicle operations
  async getVehicles(): Promise<Vehicle[]> {
    return await db.select().from(vehicles).orderBy(desc(vehicles.createdAt));
  }

  async getVehicle(id: string): Promise<Vehicle | undefined> {
    const [vehicle] = await db.select().from(vehicles).where(eq(vehicles.id, id));
    return vehicle;
  }

  async createVehicle(vehicle: InsertVehicle): Promise<Vehicle> {
    const [newVehicle] = await db.insert(vehicles).values(vehicle).returning();
    return newVehicle;
  }

  async updateVehicle(id: string, vehicle: Partial<InsertVehicle>): Promise<Vehicle> {
    const [updatedVehicle] = await db
      .update(vehicles)
      .set({ ...vehicle, updatedAt: new Date() })
      .where(eq(vehicles.id, id))
      .returning();
    return updatedVehicle;
  }

  async deleteVehicle(id: string): Promise<void> {
    await db.delete(vehicles).where(eq(vehicles.id, id));
  }

  async getVehiclesByStatus(status: string): Promise<Vehicle[]> {
    return await db.select().from(vehicles).where(eq(vehicles.status, status as any));
  }

  // Driver operations
  async getDrivers(): Promise<Driver[]> {
    return await db.select().from(drivers).orderBy(desc(drivers.createdAt));
  }

  async getDriver(id: string): Promise<Driver | undefined> {
    const [driver] = await db.select().from(drivers).where(eq(drivers.id, id));
    return driver;
  }

  async getDriverByUserId(userId: string): Promise<Driver | undefined> {
    const [driver] = await db.select().from(drivers).where(eq(drivers.userId, userId));
    return driver;
  }

  async createDriver(driver: InsertDriver): Promise<Driver> {
    const [newDriver] = await db.insert(drivers).values(driver).returning();
    return newDriver;
  }

  async updateDriver(id: string, driver: Partial<InsertDriver>): Promise<Driver> {
    const [updatedDriver] = await db
      .update(drivers)
      .set({ ...driver, updatedAt: new Date() })
      .where(eq(drivers.id, id))
      .returning();
    return updatedDriver;
  }

  async deleteDriver(id: string): Promise<void> {
    await db.delete(drivers).where(eq(drivers.id, id));
  }

  // Trip operations
  async getTrips(): Promise<Trip[]> {
    return await db.select().from(trips).orderBy(desc(trips.createdAt));
  }

  async getTrip(id: string): Promise<Trip | undefined> {
    const [trip] = await db.select().from(trips).where(eq(trips.id, id));
    return trip;
  }

  async createTrip(trip: InsertTrip): Promise<Trip> {
    const [newTrip] = await db.insert(trips).values(trip).returning();
    return newTrip;
  }

  async updateTrip(id: string, trip: Partial<InsertTrip>): Promise<Trip> {
    const [updatedTrip] = await db
      .update(trips)
      .set({ ...trip, updatedAt: new Date() })
      .where(eq(trips.id, id))
      .returning();
    return updatedTrip;
  }

  async deleteTrip(id: string): Promise<void> {
    await db.delete(trips).where(eq(trips.id, id));
  }

  async getTripsByDriver(driverId: string): Promise<Trip[]> {
    return await db.select().from(trips).where(eq(trips.driverId, driverId)).orderBy(desc(trips.createdAt));
  }

  async getTripsByVehicle(vehicleId: string): Promise<Trip[]> {
    return await db.select().from(trips).where(eq(trips.vehicleId, vehicleId)).orderBy(desc(trips.createdAt));
  }

  async getTripsByDateRange(startDate: Date, endDate: Date): Promise<Trip[]> {
    return await db
      .select()
      .from(trips)
      .where(and(gte(trips.startTime, startDate), lte(trips.startTime, endDate)))
      .orderBy(desc(trips.startTime));
  }

  // Expense operations
  async getExpenses(): Promise<Expense[]> {
    return await db.select().from(expenses).orderBy(desc(expenses.createdAt));
  }

  async getExpense(id: string): Promise<Expense | undefined> {
    const [expense] = await db.select().from(expenses).where(eq(expenses.id, id));
    return expense;
  }

  async createExpense(expense: InsertExpense): Promise<Expense> {
    const [newExpense] = await db.insert(expenses).values(expense).returning();
    return newExpense;
  }

  async updateExpense(id: string, expense: Partial<InsertExpense>): Promise<Expense> {
    const [updatedExpense] = await db
      .update(expenses)
      .set({ ...expense, updatedAt: new Date() })
      .where(eq(expenses.id, id))
      .returning();
    return updatedExpense;
  }

  async deleteExpense(id: string): Promise<void> {
    await db.delete(expenses).where(eq(expenses.id, id));
  }

  async getExpensesByVehicle(vehicleId: string): Promise<Expense[]> {
    return await db.select().from(expenses).where(eq(expenses.vehicleId, vehicleId)).orderBy(desc(expenses.expenseDate));
  }

  // Payout operations
  async getPayouts(): Promise<Payout[]> {
    return await db.select().from(payouts).orderBy(desc(payouts.createdAt));
  }

  async getPayout(id: string): Promise<Payout | undefined> {
    const [payout] = await db.select().from(payouts).where(eq(payouts.id, id));
    return payout;
  }

  async createPayout(payout: InsertPayout): Promise<Payout> {
    const [newPayout] = await db.insert(payouts).values(payout).returning();
    return newPayout;
  }

  async updatePayout(id: string, payout: Partial<InsertPayout>): Promise<Payout> {
    const [updatedPayout] = await db
      .update(payouts)
      .set({ ...payout, updatedAt: new Date() })
      .where(eq(payouts.id, id))
      .returning();
    return updatedPayout;
  }

  async deletePayout(id: string): Promise<void> {
    await db.delete(payouts).where(eq(payouts.id, id));
  }

  async getPayoutsByDriver(driverId: string): Promise<Payout[]> {
    return await db.select().from(payouts).where(eq(payouts.driverId, driverId)).orderBy(desc(payouts.createdAt));
  }

  async getPendingPayouts(): Promise<Payout[]> {
    return await db.select().from(payouts).where(eq(payouts.status, "pending")).orderBy(desc(payouts.createdAt));
  }

  // Maintenance operations
  async getMaintenanceLogs(): Promise<MaintenanceLog[]> {
    return await db.select().from(maintenanceLogs).orderBy(desc(maintenanceLogs.createdAt));
  }

  async getMaintenanceLog(id: string): Promise<MaintenanceLog | undefined> {
    const [log] = await db.select().from(maintenanceLogs).where(eq(maintenanceLogs.id, id));
    return log;
  }

  async createMaintenanceLog(log: InsertMaintenanceLog): Promise<MaintenanceLog> {
    const [newLog] = await db.insert(maintenanceLogs).values(log).returning();
    return newLog;
  }

  async updateMaintenanceLog(id: string, log: Partial<InsertMaintenanceLog>): Promise<MaintenanceLog> {
    const [updatedLog] = await db
      .update(maintenanceLogs)
      .set({ ...log, updatedAt: new Date() })
      .where(eq(maintenanceLogs.id, id))
      .returning();
    return updatedLog;
  }

  async deleteMaintenanceLog(id: string): Promise<void> {
    await db.delete(maintenanceLogs).where(eq(maintenanceLogs.id, id));
  }

  async getMaintenanceLogsByVehicle(vehicleId: string): Promise<MaintenanceLog[]> {
    return await db.select().from(maintenanceLogs).where(eq(maintenanceLogs.vehicleId, vehicleId)).orderBy(desc(maintenanceLogs.serviceDate));
  }

  // Alert operations
  async getAlerts(): Promise<Alert[]> {
    return await db.select().from(alerts).orderBy(desc(alerts.createdAt));
  }

  async getAlert(id: string): Promise<Alert | undefined> {
    const [alert] = await db.select().from(alerts).where(eq(alerts.id, id));
    return alert;
  }

  async createAlert(alert: InsertAlert): Promise<Alert> {
    const [newAlert] = await db.insert(alerts).values(alert).returning();
    return newAlert;
  }

  async updateAlert(id: string, alert: Partial<InsertAlert>): Promise<Alert> {
    const [updatedAlert] = await db
      .update(alerts)
      .set({ ...alert, updatedAt: new Date() })
      .where(eq(alerts.id, id))
      .returning();
    return updatedAlert;
  }

  async deleteAlert(id: string): Promise<void> {
    await db.delete(alerts).where(eq(alerts.id, id));
  }

  async getUnreadAlerts(): Promise<Alert[]> {
    return await db.select().from(alerts).where(eq(alerts.isRead, false)).orderBy(desc(alerts.createdAt));
  }

  async markAlertAsRead(id: string): Promise<void> {
    await db.update(alerts).set({ isRead: true }).where(eq(alerts.id, id));
  }

  // Vehicle Assignment operations
  async assignVehicleToDriver(vehicleId: string, driverId: string): Promise<VehicleAssignment> {
    // Unassign any current assignment for this vehicle
    await db
      .update(vehicleAssignments)
      .set({ isActive: false, unassignedDate: new Date() })
      .where(and(eq(vehicleAssignments.vehicleId, vehicleId), eq(vehicleAssignments.isActive, true)));

    const [assignment] = await db
      .insert(vehicleAssignments)
      .values({ vehicleId, driverId })
      .returning();
    return assignment;
  }

  async unassignVehicleFromDriver(assignmentId: string): Promise<void> {
    await db
      .update(vehicleAssignments)
      .set({ isActive: false, unassignedDate: new Date() })
      .where(eq(vehicleAssignments.id, assignmentId));
  }

  async getActiveAssignments(): Promise<VehicleAssignment[]> {
    return await db.select().from(vehicleAssignments).where(eq(vehicleAssignments.isActive, true));
  }

  async getDriverCurrentVehicle(driverId: string): Promise<VehicleAssignment | undefined> {
    const [assignment] = await db
      .select()
      .from(vehicleAssignments)
      .where(and(eq(vehicleAssignments.driverId, driverId), eq(vehicleAssignments.isActive, true)));
    return assignment;
  }

  // Analytics operations
  async getDashboardMetrics(): Promise<{
    totalRevenue: number;
    netProfit: number;
    activeVehicles: number;
    totalDrivers: number;
  }> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get today's revenue
    const [revenueResult] = await db
      .select({
        total: sql<number>`COALESCE(SUM(${trips.totalAmount}), 0)`,
      })
      .from(trips)
      .where(and(gte(trips.startTime, today), eq(trips.status, "completed")));

    // Get today's expenses
    const [expenseResult] = await db
      .select({
        total: sql<number>`COALESCE(SUM(${expenses.amount}), 0)`,
      })
      .from(expenses)
      .where(gte(expenses.expenseDate, today));

    // Get active vehicles count
    const [activeVehiclesResult] = await db
      .select({
        count: sql<number>`COUNT(*)`,
      })
      .from(vehicles)
      .where(or(eq(vehicles.status, "available"), eq(vehicles.status, "on_duty")));

    // Get total drivers count
    const [driversResult] = await db
      .select({
        count: sql<number>`COUNT(*)`,
      })
      .from(drivers)
      .where(eq(drivers.isActive, true));

    return {
      totalRevenue: Number(revenueResult.total) || 0,
      netProfit: (Number(revenueResult.total) || 0) - (Number(expenseResult.total) || 0),
      activeVehicles: Number(activeVehiclesResult.count) || 0,
      totalDrivers: Number(driversResult.count) || 0,
    };
  }

  async getTopPerformingVehicles(limit: number): Promise<Vehicle[]> {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    const topVehicles = await db
      .select({
        vehicle: vehicles,
        totalRevenue: sql<number>`COALESCE(SUM(${trips.totalAmount}), 0)`,
      })
      .from(vehicles)
      .leftJoin(trips, and(eq(vehicles.id, trips.vehicleId), gte(trips.startTime, startOfDay)))
      .groupBy(vehicles.id)
      .orderBy(sql`COALESCE(SUM(${trips.totalAmount}), 0) DESC`)
      .limit(limit);

    return topVehicles.map(row => row.vehicle);
  }

  async getRecentTrips(limit: number): Promise<Trip[]> {
    return await db
      .select()
      .from(trips)
      .orderBy(desc(trips.startTime))
      .limit(limit);
  }
}

export const storage = new DatabaseStorage();
