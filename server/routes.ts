import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { mongoStorage } from "./storage/mongoStorage";
import { insertRateSchema } from "@shared/schema";
import { ratesService } from "./ratesService";
import { z } from "zod";
import authRoutes from "./routes/auth";
import adminRoutes from "./routes/admin";

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.use("/api/auth", authRoutes);
  
  // Admin routes
  app.use("/api/admin", adminRoutes);
  // Products routes
  app.get("/api/products", async (req, res) => {
    try {
      const products = await storage.getProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get("/api/products/featured", async (req, res) => {
    try {
      const products = await storage.getFeaturedProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch featured products" });
    }
  });

  app.get("/api/products/category/:category", async (req, res) => {
    try {
      const { category } = req.params;
      const products = await storage.getProductsByCategory(category);
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products by category" });
    }
  });

  app.get("/api/products/category/:category/:subcategory", async (req, res) => {
    try {
      const { category, subcategory } = req.params;
      // Use in-memory storage for now since MongoDB is optional
      const allProducts = await storage.getProductsByCategory(category);
      const filteredProducts = allProducts.filter((p: any) => p.subcategory === subcategory);
      res.json(filteredProducts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products by subcategory" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const product = await storage.getProduct(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  // Rates routes - Using real market data
  app.get("/api/rates", async (req, res) => {
    try {
      const rates = await ratesService.getCurrentRates();
      // Update storage with current rates
      for (const rate of rates) {
        await storage.updateRate({
          material: rate.material,
          rate: rate.rate.toFixed(2),
          change: rate.change.toFixed(2),
          updatedAt: rate.updatedAt
        });
      }
      res.json(rates);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch rates" });
    }
  });

  app.post("/api/rates/update", async (req, res) => {
    try {
      const rateData = insertRateSchema.parse(req.body);
      const updatedRate = await storage.updateRate(rateData);
      res.json(updatedRate);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid rate data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update rate" });
    }
  });

  // Real-time rate updates every 30 seconds using market simulation
  setInterval(async () => {
    try {
      const rates = await ratesService.getCurrentRates();
      for (const rate of rates) {
        await storage.updateRate({
          material: rate.material,
          rate: rate.rate.toFixed(2),
          change: rate.change.toFixed(2),
          updatedAt: rate.updatedAt
        });
      }
    } catch (error) {
      console.error("Failed to update rates:", error);
    }
  }, 30000);

  // Add route for calculating product prices
  app.get("/api/products/:id/price", async (req, res) => {
    try {
      const { id } = req.params;
      const product = await storage.getProduct(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      const rates = await ratesService.getCurrentRates();
      const materialRate = rates.find(r => r.material === product.material);
      
      if (!materialRate) {
        return res.status(404).json({ message: "Rate not found for material" });
      }

      const purityRate = ratesService.calculatePurityRate(materialRate.rate, product.purity);
      const weight = parseFloat(product.weight);
      const totalPrice = purityRate * weight;

      res.json({
        productId: id,
        weight: weight,
        purity: product.purity,
        material: product.material,
        ratePerGram: purityRate.toFixed(2),
        totalPrice: totalPrice.toFixed(2),
        updatedAt: materialRate.updatedAt
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to calculate price" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
