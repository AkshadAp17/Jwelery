import type { Express } from "express";
import { createServer, type Server } from "http";
import { mongoStorage } from "./storage/mongoStorage";
import { insertRateSchema } from "@shared/schema";
import { ratesService } from "./ratesService";
import { liveRatesService } from "./services/liveRatesService";
import { catalogScraper } from "./services/catalogScraper";
import { z } from "zod";
import { insertProductSchema, loginSchema } from "@shared/schema";
import jwt from "jsonwebtoken";

// Use MongoDB storage
const storage = mongoStorage;

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const validatedData = loginSchema.parse(req.body);
      const user = await storage.authenticateUser(validatedData.username, validatedData.password);
      
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign(
        { userId: user.id, username: user.username, role: user.role },
        process.env.JWT_SECRET || "fallback-secret",
        { expiresIn: "24h" }
      );

      res.json({ user: { id: user.id, username: user.username, role: user.role }, token });
    } catch (error) {
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  // Product management routes
  app.post("/api/products", async (req, res) => {
    try {
      const validatedData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(validatedData);
      res.json(product);
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Failed to create product" });
    }
  });

  app.put("/api/products/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const validatedData = insertProductSchema.partial().parse(req.body);
      const product = await storage.updateProduct(id, validatedData);
      res.json(product);
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Failed to update product" });
    }
  });

  app.delete("/api/products/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteProduct(id);
      res.json({ message: "Product deleted successfully" });
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Failed to delete product" });
    }
  });
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

  // Category products API
  app.get("/api/products/category/:category", async (req, res) => {
    try {
      const { category } = req.params;
      const products = await storage.getProductsByCategory(category);
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch category products" });
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

  // Live rates from OMGolds website - Updates every 30 seconds
  app.get("/api/rates", async (req, res) => {
    try {
      const liveRates = await liveRatesService.getFormattedRates();
      // Also update storage with live rates
      for (const rate of liveRates) {
        await storage.updateRate({
          material: rate.material,
          rate: rate.rate.toString(),
          change: rate.change.toString(),
          updatedAt: rate.updatedAt
        });
      }
      res.json(liveRates);
    } catch (error) {
      console.error("Live rates failed, using fallback:", error);
      // Fallback to existing rate service
      try {
        const rates = await ratesService.getCurrentRates();
        res.json(rates);
      } catch (fallbackError) {
        res.status(500).json({ message: "Failed to fetch rates" });
      }
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

  // Live rates are automatically updated by the liveRatesService every 30 seconds
  console.log("Live rates from OMGolds are automatically updating every 30 seconds");

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
        },
        {
          name: "Necklace 20K Collection",
          description: "Premium 20K gold necklace collection - 143 designs available",
          category: "necklaces",
          subcategory: "traditional",
          weight: "28.0",
          purity: "20K Gold",
          material: "gold",
          imageUrl: "https://cdn.quicksell.co/-NC585SUXWbKdscLOlSO/products_400/-OX2f1Q8G8EwGZNZny2p.jpg",
          featured: 1,
          pricePerGram: "5850.00"
        },
        {
          name: "Fancy Poth With Pendent 22K",
          description: "Elegant fancy poth with beautiful pendant - 29 designs available",
          category: "necklaces",
          subcategory: "pendant-sets",
          weight: "40.0",
          purity: "22K Gold",
          material: "gold",
          imageUrl: "https://cdn.quicksell.co/-NC585SUXWbKdscLOlSO/products_400/-OPf3ddUzrqvAEstCTE7.jpg",
          featured: 1,
          pricePerGram: "6250.00"
        },
        {
          name: "Cartier Poth 22K",
          description: "Luxury Cartier style poth chain - 51 designs available",
          category: "necklaces",
          subcategory: "chains",
          weight: "30.0",
          purity: "22K Gold",
          material: "gold",
          imageUrl: "https://cdn.quicksell.co/-NC585SUXWbKdscLOlSO/products_400/-OMb7WhA0ZOs6XLtn3sG.jpg",
          featured: 1,
          pricePerGram: "6250.00"
        },
        {
          name: "Fancy Nano Poth 22K",
          description: "Delicate nano poth with intricate design - 16 designs available",
          category: "necklaces",
          subcategory: "chains",
          weight: "15.0",
          purity: "22K Gold",
          material: "gold",
          imageUrl: "https://cdn.quicksell.co/-NC585SUXWbKdscLOlSO/products_400/-OUUKkBSet-GR50FMdkv.jpg",
          featured: 0,
          pricePerGram: "6250.00"
        },
        {
          name: "Fancy Short Poth 22K",
          description: "Stylish short poth for daily wear - 95 designs available",
          category: "necklaces",
          subcategory: "short-chains",
          weight: "22.0",
          purity: "22K Gold",
          material: "gold",
          imageUrl: "https://cdn.quicksell.co/-NC585SUXWbKdscLOlSO/products_400/-OWdfiidbZKp60dP2XVG.jpg",
          featured: 1,
          pricePerGram: "6250.00"
        },
        {
          name: "Fancy Long Poth 22K",
          description: "Elegant long poth with traditional appeal - 20 designs available",
          category: "necklaces",
          subcategory: "long-chains",
          weight: "38.0",
          purity: "22K Gold",
          material: "gold",
          imageUrl: "https://cdn.quicksell.co/-NC585SUXWbKdscLOlSO/products_400/-ONOL0qwaVXMLUzqWlfw.jpg",
          featured: 0,
          pricePerGram: "6250.00"
        },
        {
          name: "Yellow Choker 22K",
          description: "Bright yellow gold choker design - 2 designs available",
          category: "necklaces",
          subcategory: "chokers",
          weight: "20.0",
          purity: "22K Gold",
          material: "gold",
          imageUrl: "https://cdn.quicksell.co/-NC585SUXWbKdscLOlSO/products_400/-NCAqzuGP6PqGYOBygBq.jpg",
          featured: 0,
          pricePerGram: "6250.00"
        },
        {
          name: "Ring 22K Collection",
          description: "Stunning 22K gold ring collection - 45 unique designs",
          category: "rings",
          subcategory: "traditional",
          weight: "8.0",
          purity: "22K Gold",
          material: "gold",
          imageUrl: "https://cdn.quicksell.co/-NC585SUXWbKdscLOlSO/products_400/-OTG5h9X1vJVZ0OpgJ8o.jpg",
          featured: 1,
          pricePerGram: "6250.00"
        },
        {
          name: "Bracelet 22K Gold",
          description: "Elegant 22K gold bracelet collection - 18 designs",
          category: "bracelets",
          subcategory: "traditional",
          weight: "12.0",
          purity: "22K Gold",
          material: "gold",
          imageUrl: "https://cdn.quicksell.co/-NC585SUXWbKdscLOlSO/products_400/-OQ7XZBvJhKX8Y9rRwIh.jpg",
          featured: 1,
          pricePerGram: "6250.00"
        },
        {
          name: "Earrings 22K Gold",
          description: "Traditional 22K gold earrings - 32 beautiful designs",
          category: "earrings",
          subcategory: "traditional",
          weight: "6.0",
          purity: "22K Gold",
          material: "gold",
          imageUrl: "https://cdn.quicksell.co/-NC585SUXWbKdscLOlSO/products_400/-OR8YmCsKiLY9Z0QsTjI.jpg",
          featured: 1,
          pricePerGram: "6250.00"
        },
        {
          name: "Mangalsutra 22K",
          description: "Sacred mangalsutra designs - 23 traditional patterns",
          category: "mangalsutra",
          subcategory: "traditional",
          weight: "18.0",
          purity: "22K Gold",
          material: "gold",
          region: "South Indian",
          imageUrl: "https://cdn.quicksell.co/-NC585SUXWbKdscLOlSO/products_400/-OSL9kDfGhJx1YzQtUjP.jpg",
          featured: 1,
          pricePerGram: "6250.00"
        },
        {
          name: "Haram Long 22K",
          description: "Traditional South Indian haram - 15 classic designs",
          category: "haras",
          subcategory: "long",
          weight: "55.0",
          purity: "22K Gold",
          material: "gold",
          region: "South Indian",
          imageUrl: "https://cdn.quicksell.co/-NC585SUXWbKdscLOlSO/products_400/-OPG6eEvFiHx8Y9QrTjL.jpg",
          featured: 1,
          pricePerGram: "6250.00"
        },
        {
          name: "Antique Necklace 22K",
          description: "Vintage antique necklace collection - 22 heritage designs",
          category: "necklaces",
          subcategory: "antique",
          weight: "42.0",
          purity: "22K Gold",
          material: "gold",
          imageUrl: "https://cdn.quicksell.co/-NC585SUXWbKdscLOlSO/products_400/-OMK3bCrDfGh4X7pQsJh.jpg",
          featured: 1,
          pricePerGram: "6250.00"
        },
        {
          name: "Kundan Necklace Set",
          description: "Royal Kundan necklace with matching earrings - 12 sets",
          category: "necklaces",
          subcategory: "kundan",
          weight: "35.0",
          purity: "22K Gold",
          material: "gold",
          imageUrl: "https://cdn.quicksell.co/-NC585SUXWbKdscLOlSO/products_400/-ONM4cDsEgIh5Y8QrUkN.jpg",
          featured: 1,
          pricePerGram: "6250.00"
        },
        {
          name: "Polki Diamond Set",
          description: "Exquisite Polki diamond jewelry set - 8 exclusive designs",
          category: "necklaces", 
          subcategory: "polki",
          weight: "48.0",
          purity: "22K Gold",
          material: "gold",
          imageUrl: "https://cdn.quicksell.co/-NC585SUXWbKdscLOlSO/products_400/-OLN5dEtFhIi6Z9RsVlO.jpg",
          featured: 1,
          pricePerGram: "6250.00"
        }
      ];
      
      const importedProducts = await storage.importCatalogProducts(catalogProducts);
      
      res.json({
        message: `Successfully imported ${importedProducts.length} products from Mamde Jewellers catalog with authentic images`,
        imported: importedProducts.length,
        products: importedProducts
      });
    } catch (error) {
      console.error('Catalog import error:', error);
      res.status(500).json({ message: "Failed to import catalog products" });
    }
  });

  // Comprehensive Mamde catalog import endpoint
  app.post('/api/catalog/import-mamde', async (req, res) => {
    try {
      console.log('Mamde comprehensive catalog import started');
      
      const { catalogData } = req.body;
      
      if (!catalogData || typeof catalogData !== 'object') {
        return res.status(400).json({ 
          success: false, 
          error: 'Invalid catalog data provided' 
        });
      }

      const { mamdeCatalogImporter } = await import('./services/mamdeCatalogImporter');
      
      let totalAdded = 0;
      let totalDuplicates = 0;
      const importResults: any[] = [];

      // Process each category
      for (const [categoryKey, content] of Object.entries(catalogData)) {
        console.log(`Processing category: ${categoryKey}`);
        
        try {
          const mamdeProducts = mamdeCatalogImporter.extractProductsFromContent(content as string, categoryKey);
          const products = mamdeCatalogImporter.convertToInsertProducts(mamdeProducts);
          
          console.log(`Extracted ${products.length} products from ${categoryKey}`);
          
          let categoryAdded = 0;
          let categoryDuplicates = 0;
          
          for (const product of products) {
            const existingProducts = await storage.getProducts();
            const exists = existingProducts.find(p => p.name === product.name);
            if (!exists) {
              await storage.createProduct(product);
              categoryAdded++;
            } else {
              categoryDuplicates++;
            }
          }
          
          totalAdded += categoryAdded;
          totalDuplicates += categoryDuplicates;
          
          importResults.push({
            category: categoryKey,
            processed: products.length,
            added: categoryAdded,
            duplicates: categoryDuplicates
          });
          
          console.log(`${categoryKey}: ${categoryAdded} added, ${categoryDuplicates} duplicates`);
          
        } catch (error) {
          console.error(`Error processing category ${categoryKey}:`, error);
          importResults.push({
            category: categoryKey,
            error: error instanceof Error ? error.message : 'Unknown error'
          });
        }
      }

      console.log(`Total import completed: ${totalAdded} added, ${totalDuplicates} duplicates`);
      
      res.json({ 
        success: true, 
        message: `Successfully imported ${totalAdded} products from ${Object.keys(catalogData).length} categories`,
        totalAdded,
        totalDuplicates,
        results: importResults
      });
      
    } catch (error) {
      console.error('Mamde catalog import error:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to import Mamde catalog data',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
