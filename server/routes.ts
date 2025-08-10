import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { mongoStorage } from "./storage/mongoStorage";
import { insertRateSchema } from "@shared/schema";
import { ratesService } from "./ratesService";
import { catalogScraper } from "./services/catalogScraper";
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

  // Catalog import route
  app.post("/api/catalog/import", async (req, res) => {
    try {
      // Create products based on the catalog data from mamdejewellers.catalog.to
      const catalogProducts = [
        {
          name: "Patti Long Poth 22K",
          description: "Premium long patti chain with traditional design - 78 designs available",
          category: "necklaces",
          subcategory: "long-chains",
          weight: "35.0",
          purity: "22K Gold",
          material: "gold",
          imageUrl: "https://cdn.quicksell.co/-NC585SUXWbKdscLOlSO/products_400/-OUANr2XivMO9ndCXNbm.jpg",
          featured: 1,
          pricePerGram: "6250.00"
        },
        {
          name: "Patti Short Poth 22K",
          description: "Elegant short patti chain perfect for daily wear - 67 designs available",
          category: "necklaces", 
          subcategory: "short-chains",
          weight: "20.0",
          purity: "22K Gold",
          material: "gold",
          imageUrl: "https://cdn.quicksell.co/-NC585SUXWbKdscLOlSO/products_400/-OV32_LA01WVd3tBQeGh.jpg",
          featured: 1,
          pricePerGram: "6250.00"
        },
        {
          name: "Temple Necklace 22K",
          description: "Traditional temple design necklace - 26 designs available",
          category: "necklaces",
          subcategory: "temple",
          weight: "45.0",
          purity: "22K Gold", 
          material: "gold",
          region: "South Indian",
          imageUrl: "https://cdn.quicksell.co/-NC585SUXWbKdscLOlSO/products_400/-OQbGrKDYWOMt4I1P3_D.jpg",
          featured: 1,
          pricePerGram: "6250.00"
        },
        {
          name: "Fancy Necklace 22K",
          description: "Modern fancy necklace with intricate patterns - 31 designs available",
          category: "necklaces",
          subcategory: "fancy",
          weight: "28.0",
          purity: "22K Gold",
          material: "gold",
          imageUrl: "https://cdn.quicksell.co/-NC585SUXWbKdscLOlSO/products_400/-OUyR7FLxj9OG89qpI94.jpg",
          featured: 1,
          pricePerGram: "6250.00"
        },
        {
          name: "Necklace 22K Collection",
          description: "Comprehensive 22K gold necklace collection - 296 designs available",
          category: "necklaces",
          subcategory: "traditional",
          weight: "32.0",
          purity: "22K Gold",
          material: "gold",
          imageUrl: "https://cdn.quicksell.co/-NC585SUXWbKdscLOlSO/products_400/-OSEuuQBC0n-PhssMD0l.jpg",
          featured: 1,
          pricePerGram: "6250.00"
        },
        {
          name: "Temple Choker 22K",
          description: "Traditional temple design choker - 11 designs available",
          category: "necklaces",
          subcategory: "chokers",
          weight: "25.0",
          purity: "22K Gold",
          material: "gold",
          region: "South Indian",
          imageUrl: "https://cdn.quicksell.co/-NC585SUXWbKdscLOlSO/products_400/-OSTu3vTuwmExEYADJ5v.jpg",
          featured: 0,
          pricePerGram: "6250.00"
        },
        {
          name: "Fancy Necklace 20K",
          description: "Stylish 20K gold necklace collection - 60 designs available",
          category: "necklaces",
          subcategory: "fancy",
          weight: "30.0",
          purity: "20K Gold",
          material: "gold",
          imageUrl: "https://cdn.quicksell.co/-NC585SUXWbKdscLOlSO/products_400/-OWBDQnKvRuKIs0Etcej.jpg",
          featured: 0,
          pricePerGram: "5850.00"
        },
        {
          name: "Arbi Necklace 20K",
          description: "Traditional Arabic style necklace - 26 designs available",
          category: "necklaces",
          subcategory: "arbi",
          weight: "25.0",
          purity: "20K Gold",
          material: "gold",
          imageUrl: "https://cdn.quicksell.co/-NC585SUXWbKdscLOlSO/products_400/-OL9cg9hfPV1a3MTjZJx.jpg",
          featured: 0,
          pricePerGram: "5850.00"
        }
      ];
      
      const importedProducts = await storage.importCatalogProducts(catalogProducts);
      
      res.json({
        message: `Successfully imported ${importedProducts.length} products from Mamde Jewellers catalog`,
        imported: importedProducts.length,
        products: importedProducts
      });
    } catch (error) {
      console.error('Catalog import error:', error);
      res.status(500).json({ message: "Failed to import catalog products" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
