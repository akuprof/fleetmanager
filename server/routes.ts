import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import {
  insertVehicleSchema,
  insertDriverSchema,
  insertTripSchema,
  insertExpenseSchema,
  insertPayoutSchema,
  insertMaintenanceLogSchema,
  insertAlertSchema,
  insertDutyLogSchema,
} from "@shared/schema";
import { calculateRevenueSplit } from "../client/src/lib/revenue-calculator";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Dashboard metrics
  app.get('/api/dashboard/metrics', isAuthenticated, async (req, res) => {
    try {
      const metrics = await storage.getDashboardMetrics();
      res.json(metrics);
    } catch (error) {
      console.error("Error fetching metrics:", error);
      res.status(500).json({ message: "Failed to fetch metrics" });
    }
  });

  app.get('/api/dashboard/top-vehicles/:limit', isAuthenticated, async (req, res) => {
    try {
      const limit = parseInt(req.params.limit) || 5;
      const topVehicles = await storage.getTopPerformingVehicles(limit);
      res.json(topVehicles);
    } catch (error) {
      console.error("Error fetching top vehicles:", error);
      res.status(500).json({ message: "Failed to fetch top vehicles" });
    }
  });

  app.get('/api/dashboard/recent-trips/:limit', isAuthenticated, async (req, res) => {
    try {
      const limit = parseInt(req.params.limit) || 10;
      const recentTrips = await storage.getRecentTrips(limit);
      res.json(recentTrips);
    } catch (error) {
      console.error("Error fetching recent trips:", error);
      res.status(500).json({ message: "Failed to fetch recent trips" });
    }
  });

  // Vehicle routes
  app.get('/api/vehicles', isAuthenticated, async (req, res) => {
    try {
      const vehicles = await storage.getVehicles();
      res.json(vehicles);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      res.status(500).json({ message: "Failed to fetch vehicles" });
    }
  });

  app.get('/api/vehicles/:id', isAuthenticated, async (req, res) => {
    try {
      const vehicle = await storage.getVehicle(req.params.id);
      if (!vehicle) {
        return res.status(404).json({ message: "Vehicle not found" });
      }
      res.json(vehicle);
    } catch (error) {
      console.error("Error fetching vehicle:", error);
      res.status(500).json({ message: "Failed to fetch vehicle" });
    }
  });

  app.post('/api/vehicles', isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertVehicleSchema.parse(req.body);
      const vehicle = await storage.createVehicle(validatedData);
      res.status(201).json(vehicle);
    } catch (error) {
      console.error("Error creating vehicle:", error);
      res.status(400).json({ message: "Failed to create vehicle" });
    }
  });

  app.put('/api/vehicles/:id', isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertVehicleSchema.partial().parse(req.body);
      const vehicle = await storage.updateVehicle(req.params.id, validatedData);
      res.json(vehicle);
    } catch (error) {
      console.error("Error updating vehicle:", error);
      res.status(400).json({ message: "Failed to update vehicle" });
    }
  });

  app.delete('/api/vehicles/:id', isAuthenticated, async (req, res) => {
    try {
      await storage.deleteVehicle(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting vehicle:", error);
      res.status(500).json({ message: "Failed to delete vehicle" });
    }
  });

  // Driver routes
  app.get('/api/drivers', isAuthenticated, async (req, res) => {
    try {
      const drivers = await storage.getDrivers();
      res.json(drivers);
    } catch (error) {
      console.error("Error fetching drivers:", error);
      res.status(500).json({ message: "Failed to fetch drivers" });
    }
  });

  app.get('/api/drivers/:id', isAuthenticated, async (req, res) => {
    try {
      const driver = await storage.getDriver(req.params.id);
      if (!driver) {
        return res.status(404).json({ message: "Driver not found" });
      }
      res.json(driver);
    } catch (error) {
      console.error("Error fetching driver:", error);
      res.status(500).json({ message: "Failed to fetch driver" });
    }
  });

  app.post('/api/drivers', isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertDriverSchema.parse(req.body);
      const driver = await storage.createDriver(validatedData);
      res.status(201).json(driver);
    } catch (error) {
      console.error("Error creating driver:", error);
      res.status(400).json({ message: "Failed to create driver" });
    }
  });

  app.put('/api/drivers/:id', isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertDriverSchema.partial().parse(req.body);
      const driver = await storage.updateDriver(req.params.id, validatedData);
      res.json(driver);
    } catch (error) {
      console.error("Error updating driver:", error);
      res.status(400).json({ message: "Failed to update driver" });
    }
  });

  app.delete('/api/drivers/:id', isAuthenticated, async (req, res) => {
    try {
      await storage.deleteDriver(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting driver:", error);
      res.status(500).json({ message: "Failed to delete driver" });
    }
  });

  // Trip routes
  app.get('/api/trips', isAuthenticated, async (req, res) => {
    try {
      const trips = await storage.getTrips();
      res.json(trips);
    } catch (error) {
      console.error("Error fetching trips:", error);
      res.status(500).json({ message: "Failed to fetch trips" });
    }
  });

  app.get('/api/trips/driver/:driverId', isAuthenticated, async (req, res) => {
    try {
      const trips = await storage.getTripsByDriver(req.params.driverId);
      res.json(trips);
    } catch (error) {
      console.error("Error fetching driver trips:", error);
      res.status(500).json({ message: "Failed to fetch driver trips" });
    }
  });

  app.post('/api/trips', isAuthenticated, async (req: any, res) => {
    try {
      const validatedData = insertTripSchema.parse({
        ...req.body,
        createdBy: req.user.claims.sub,
      });

      // Calculate revenue split
      const totalAmount = parseFloat(validatedData.totalAmount.toString());
      const { driverShare, companyShare } = calculateRevenueSplit(totalAmount);

      const tripWithSplit = {
        ...validatedData,
        driverShare: driverShare,
        companyShare: companyShare,
      };

      const trip = await storage.createTrip(tripWithSplit);
      res.status(201).json(trip);
    } catch (error) {
      console.error("Error creating trip:", error);
      res.status(400).json({ message: "Failed to create trip" });
    }
  });

  app.put('/api/trips/:id', isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertTripSchema.partial().parse(req.body);
      
      // Recalculate revenue split if total amount changed
      if (validatedData.totalAmount) {
        const totalAmount = parseFloat(validatedData.totalAmount.toString());
        const { driverShare, companyShare } = calculateRevenueSplit(totalAmount);
        validatedData.driverShare = driverShare;
        validatedData.companyShare = companyShare;
      }

      const trip = await storage.updateTrip(req.params.id, validatedData);
      res.json(trip);
    } catch (error) {
      console.error("Error updating trip:", error);
      res.status(400).json({ message: "Failed to update trip" });
    }
  });

  app.delete('/api/trips/:id', isAuthenticated, async (req, res) => {
    try {
      await storage.deleteTrip(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting trip:", error);
      res.status(500).json({ message: "Failed to delete trip" });
    }
  });

  // Expense routes
  app.get('/api/expenses', isAuthenticated, async (req, res) => {
    try {
      const expenses = await storage.getExpenses();
      res.json(expenses);
    } catch (error) {
      console.error("Error fetching expenses:", error);
      res.status(500).json({ message: "Failed to fetch expenses" });
    }
  });

  app.post('/api/expenses', isAuthenticated, async (req: any, res) => {
    try {
      const validatedData = insertExpenseSchema.parse({
        ...req.body,
        createdBy: req.user.claims.sub,
      });
      const expense = await storage.createExpense(validatedData);
      res.status(201).json(expense);
    } catch (error) {
      console.error("Error creating expense:", error);
      res.status(400).json({ message: "Failed to create expense" });
    }
  });

  app.put('/api/expenses/:id', isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertExpenseSchema.partial().parse(req.body);
      const expense = await storage.updateExpense(req.params.id, validatedData);
      res.json(expense);
    } catch (error) {
      console.error("Error updating expense:", error);
      res.status(400).json({ message: "Failed to update expense" });
    }
  });

  app.delete('/api/expenses/:id', isAuthenticated, async (req, res) => {
    try {
      await storage.deleteExpense(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting expense:", error);
      res.status(500).json({ message: "Failed to delete expense" });
    }
  });

  // Payout routes
  app.get('/api/payouts', isAuthenticated, async (req, res) => {
    try {
      const payouts = await storage.getPayouts();
      res.json(payouts);
    } catch (error) {
      console.error("Error fetching payouts:", error);
      res.status(500).json({ message: "Failed to fetch payouts" });
    }
  });

  app.get('/api/payouts/pending', isAuthenticated, async (req, res) => {
    try {
      const payouts = await storage.getPendingPayouts();
      res.json(payouts);
    } catch (error) {
      console.error("Error fetching pending payouts:", error);
      res.status(500).json({ message: "Failed to fetch pending payouts" });
    }
  });

  app.post('/api/payouts', isAuthenticated, async (req: any, res) => {
    try {
      const validatedData = insertPayoutSchema.parse({
        ...req.body,
        createdBy: req.user.claims.sub,
      });
      const payout = await storage.createPayout(validatedData);
      res.status(201).json(payout);
    } catch (error) {
      console.error("Error creating payout:", error);
      res.status(400).json({ message: "Failed to create payout" });
    }
  });

  app.put('/api/payouts/:id', isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertPayoutSchema.partial().parse(req.body);
      const payout = await storage.updatePayout(req.params.id, validatedData);
      res.json(payout);
    } catch (error) {
      console.error("Error updating payout:", error);
      res.status(400).json({ message: "Failed to update payout" });
    }
  });

  // Alert routes
  app.get('/api/alerts', isAuthenticated, async (req, res) => {
    try {
      const alerts = await storage.getAlerts();
      res.json(alerts);
    } catch (error) {
      console.error("Error fetching alerts:", error);
      res.status(500).json({ message: "Failed to fetch alerts" });
    }
  });

  app.get('/api/alerts/unread', isAuthenticated, async (req, res) => {
    try {
      const alerts = await storage.getUnreadAlerts();
      res.json(alerts);
    } catch (error) {
      console.error("Error fetching unread alerts:", error);
      res.status(500).json({ message: "Failed to fetch unread alerts" });
    }
  });

  app.put('/api/alerts/:id/read', isAuthenticated, async (req, res) => {
    try {
      await storage.markAlertAsRead(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error marking alert as read:", error);
      res.status(500).json({ message: "Failed to mark alert as read" });
    }
  });

  // Duty log routes
  app.get('/api/duty-logs/:driverId', isAuthenticated, async (req, res) => {
    try {
      const dutyLogs = await storage.getDutyLogs(req.params.driverId);
      res.json(dutyLogs);
    } catch (error) {
      console.error("Error fetching duty logs:", error);
      res.status(500).json({ message: "Failed to fetch duty logs" });
    }
  });

  app.get('/api/duty-logs/current/:driverId', isAuthenticated, async (req, res) => {
    try {
      const currentDutyLog = await storage.getCurrentDutyLog(req.params.driverId);
      res.json(currentDutyLog);
    } catch (error) {
      console.error("Error fetching current duty log:", error);
      res.status(500).json({ message: "Failed to fetch current duty log" });
    }
  });

  app.post('/api/duty-logs', isAuthenticated, async (req: any, res) => {
    try {
      const validatedData = insertDutyLogSchema.parse(req.body);
      const dutyLog = await storage.createDutyLog(validatedData);
      res.status(201).json(dutyLog);
    } catch (error) {
      console.error("Error creating duty log:", error);
      res.status(400).json({ message: "Failed to create duty log" });
    }
  });

  app.put('/api/duty-logs/:id', isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertDutyLogSchema.partial().parse(req.body);
      const dutyLog = await storage.updateDutyLog(req.params.id, validatedData);
      res.json(dutyLog);
    } catch (error) {
      console.error("Error updating duty log:", error);
      res.status(400).json({ message: "Failed to update duty log" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
