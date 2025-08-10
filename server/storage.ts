import { Product, InsertProduct, User, InsertUser, Rate, InsertRate } from "@shared/schema";
import { db } from "./db";
import { products, users, rates } from "@shared/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  authenticateUser(username: string, password: string): Promise<User | null>;
  
  getProducts(): Promise<Product[]>;
  getProductsByCategory(category: string): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product>;
  deleteProduct(id: string): Promise<void>;
  importCatalogProducts(products: InsertProduct[]): Promise<Product[]>;
  getFeaturedProducts(): Promise<Product[]>;
  
  getRates(): Promise<Rate[]>;
  updateRate(rate: InsertRate): Promise<Rate>;
}

export class DatabaseStorage implements IStorage {
  constructor() {
    this.initializeData();
  }

  private async initializeData() {
    // Create admin user if not exists
    const adminExists = await this.getUserByUsername("admin");
    if (!adminExists) {
      await this.createUser({
        username: "admin",
        password: "admin123",
        email: "admin@shreejewellers.com",
        role: "admin"
      });
    }

    // Initialize with authentic Mamdej Jewellers catalog data
    const existingProducts = await this.getProducts();
    if (existingProducts.length === 0) {
      await this.importCatalogProducts(this.getAuthenticMamdejProducts());
    }
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(userData: InsertUser): Promise<User> {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const [user] = await db
      .insert(users)
      .values({ ...userData, password: hashedPassword })
      .returning();
    return user;
  }

  async authenticateUser(username: string, password: string): Promise<User | null> {
    const user = await this.getUserByUsername(username);
    if (!user) return null;
    
    const isValid = await bcrypt.compare(password, user.password);
    return isValid ? user : null;
  }

  // Product operations
  async getProducts(): Promise<Product[]> {
    return await db.select().from(products);
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return await db.select().from(products).where(eq(products.category, category));
  }

  async getProduct(id: string): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async createProduct(productData: InsertProduct): Promise<Product> {
    const [product] = await db
      .insert(products)
      .values(productData)
      .returning();
    return product;
  }

  async updateProduct(id: string, productData: Partial<InsertProduct>): Promise<Product> {
    const [product] = await db
      .update(products)
      .set({ ...productData, updatedAt: new Date().toISOString() })
      .where(eq(products.id, id))
      .returning();
    return product;
  }

  async deleteProduct(id: string): Promise<void> {
    await db.delete(products).where(eq(products.id, id));
  }

  async getFeaturedProducts(): Promise<Product[]> {
    return await db.select().from(products).where(eq(products.featured, 1));
  }

  async importCatalogProducts(catalogProducts: InsertProduct[]): Promise<Product[]> {
    const createdProducts: Product[] = [];
    for (const productData of catalogProducts) {
      const product = await this.createProduct(productData);
      createdProducts.push(product);
    }
    return createdProducts;
  }

  // Rate operations
  async getRates(): Promise<Rate[]> {
    return await db.select().from(rates);
  }

  async updateRate(rateData: InsertRate): Promise<Rate> {
    const existingRate = await db.select().from(rates).where(eq(rates.material, rateData.material));
    
    if (existingRate.length > 0) {
      const [rate] = await db
        .update(rates)
        .set(rateData)
        .where(eq(rates.material, rateData.material))
        .returning();
      return rate;
    } else {
      const [rate] = await db
        .insert(rates)
        .values(rateData)
        .returning();
      return rate;
    }
  }

  private getAuthenticMamdejProducts(): InsertProduct[] {
    return [
      // PATTA POTH 22K - Authentic data from Mamdej website
      {
        name: "Patti Long Poth 22K",
        description: "Traditional long patta poth chain with intricate design - authentic Mamdej Jewellers design (78 items in collection)",
        category: "patta-poth",
        subcategory: "long",
        weight: "26.33",
        purity: "22K Gold",
        material: "gold",
        imageUrl: "https://cdn.quicksell.co/-NC585SUXWbKdscLOlSO/products_400/-OUANr2XivMO9ndCXNbm.jpg",
        featured: 1,
        pricePerGram: "6250.00",
        stock: 1
      },
      {
        name: "Patti Long Poth 22K Style 2",
        description: "Beautiful long patta poth with traditional craftsmanship - authentic Mamdej Jewellers design",
        category: "patta-poth",
        subcategory: "long",
        weight: "26.93",
        purity: "22K Gold",
        material: "gold",
        imageUrl: "https://cdn.quicksell.co/-NC585SUXWbKdscLOlSO/products_400/-OUANr2TFhmn-6TrZkP5.jpg",
        featured: 0,
        pricePerGram: "6250.00",
        stock: 1
      },
      {
        name: "Patti Short Poth 22K",
        description: "Elegant short patta poth design for daily wear - authentic Mamdej Jewellers design (67 items in collection)",
        category: "patta-poth",
        subcategory: "short",
        weight: "18.5",
        purity: "22K Gold",
        material: "gold",
        imageUrl: "https://cdn.quicksell.co/-NC585SUXWbKdscLOlSO/products_400/-OV32_LA01WVd3tBQeGh.jpg",
        featured: 1,
        pricePerGram: "6250.00",
        stock: 1
      },

      // NECKLACE 20K - Authentic data from Mamdej website
      {
        name: "Fancy Necklace 20K",
        description: "Beautiful fancy design necklace in 20K gold - authentic Mamdej Jewellers design (60 items in collection)",
        category: "necklace",
        subcategory: "fancy-20k",
        weight: "11.52",
        purity: "20K Gold",
        material: "gold",
        imageUrl: "https://cdn.quicksell.co/-NC585SUXWbKdscLOlSO/products_400/-OWBDQnKvRuKIs0Etcej.jpg",
        featured: 1,
        pricePerGram: "5800.00",
        stock: 1
      },
      {
        name: "Fancy Necklace 20K Style 2",
        description: "Elegant fancy necklace with contemporary design - authentic Mamdej Jewellers design",
        category: "necklace",
        subcategory: "fancy-20k",
        weight: "9.80",
        purity: "20K Gold",
        material: "gold",
        imageUrl: "https://cdn.quicksell.co/-NC585SUXWbKdscLOlSO/products_400/-OWBDQnItSHktn7Xn06V.jpg",
        featured: 0,
        pricePerGram: "5800.00",
        stock: 1
      },
      {
        name: "Classic Necklace 20K",
        description: "Traditional necklace design in 20K gold - authentic Mamdej Jewellers design (143 items in collection)",
        category: "necklace",
        subcategory: "classic-20k",
        weight: "28.0",
        purity: "20K Gold",
        material: "gold",
        imageUrl: "https://cdn.quicksell.co/-NC585SUXWbKdscLOlSO/products_400/-OX2f1Q8G8EwGZNZny2p.jpg",
        featured: 0,
        pricePerGram: "5800.00",
        stock: 1
      },
      {
        name: "Arbi Necklace 20K",
        description: "Traditional Arbi style necklace design - authentic Mamdej Jewellers design (26 items in collection)",
        category: "necklace",
        subcategory: "arbi-20k",
        weight: "22.5",
        purity: "20K Gold",
        material: "gold",
        imageUrl: "https://cdn.quicksell.co/-NC585SUXWbKdscLOlSO/products_400/-OL9cg9hfPV1a3MTjZJx.jpg",
        featured: 0,
        pricePerGram: "5800.00",
        stock: 1
      },

      // NECKLACE 22K - Authentic data from Mamdej website
      {
        name: "Temple Necklace 22K",
        description: "Sacred temple design necklace - authentic Mamdej Jewellers design (26 items in collection)",
        category: "necklace",
        subcategory: "temple-22k",
        weight: "40.0",
        purity: "22K Gold",
        material: "gold",
        imageUrl: "https://cdn.quicksell.co/-NC585SUXWbKdscLOlSO/products_400/-OQbGrKDYWOMt4I1P3_D.jpg",
        featured: 1,
        pricePerGram: "6250.00",
        stock: 1
      },
      {
        name: "Fancy Necklace 22K",
        description: "Luxurious fancy design in premium 22K gold - authentic Mamdej Jewellers design (31 items in collection)",
        category: "necklace",
        subcategory: "fancy-22k",
        weight: "35.0",
        purity: "22K Gold",
        material: "gold",
        imageUrl: "https://cdn.quicksell.co/-NC585SUXWbKdscLOlSO/products_400/-OUyR7FLxj9OG89qpI94.jpg",
        featured: 1,
        pricePerGram: "6250.00",
        stock: 1
      },
      {
        name: "Classic Necklace 22K",
        description: "Traditional necklace design in premium 22K gold - authentic Mamdej Jewellers design (296 items in collection)",
        category: "necklace",
        subcategory: "classic-22k",
        weight: "32.0",
        purity: "22K Gold",
        material: "gold",
        imageUrl: "https://cdn.quicksell.co/-NC585SUXWbKdscLOlSO/products_400/-OSEuuQBC0n-PhssMD0l.jpg",
        featured: 0,
        pricePerGram: "6250.00",
        stock: 1
      },

      // FANCY POTH 22K - Authentic data from Mamdej website
      {
        name: "Fancy Poth With Pendant 22K",
        description: "Beautiful fancy poth with matching pendant - authentic Mamdej Jewellers design (29 items in collection)",
        category: "fancy-poth",
        subcategory: "with-pendant",
        weight: "28.5",
        purity: "22K Gold",
        material: "gold",
        imageUrl: "https://cdn.quicksell.co/-NC585SUXWbKdscLOlSO/products_400/-OPf3ddUzrqvAEstCTE7.jpg",
        featured: 1,
        pricePerGram: "6250.00",
        stock: 1
      },
      {
        name: "Cartier Poth 22K",
        description: "Luxurious Cartier style poth design - authentic Mamdej Jewellers design (51 items in collection)",
        category: "fancy-poth",
        subcategory: "cartier",
        weight: "24.0",
        purity: "22K Gold",
        material: "gold",
        imageUrl: "https://cdn.quicksell.co/-NC585SUXWbKdscLOlSO/products_400/-OMb7WhA0ZOs6XLtn3sG.jpg",
        featured: 1,
        pricePerGram: "6250.00",
        stock: 1
      },
      {
        name: "Fancy Nano Poth 22K",
        description: "Delicate nano poth with intricate work - authentic Mamdej Jewellers design (16 items in collection)",
        category: "fancy-poth",
        subcategory: "nano",
        weight: "12.5",
        purity: "22K Gold",
        material: "gold",
        imageUrl: "https://cdn.quicksell.co/-NC585SUXWbKdscLOlSO/products_400/-OUUKkBSet-GR50FMdkv.jpg",
        featured: 0,
        pricePerGram: "6250.00",
        stock: 1
      },
      {
        name: "Fancy Short Poth 22K",
        description: "Compact fancy poth perfect for everyday wear - authentic Mamdej Jewellers design (95 items in collection)",
        category: "fancy-poth",
        subcategory: "short",
        weight: "18.0",
        purity: "22K Gold",
        material: "gold",
        imageUrl: "https://cdn.quicksell.co/-NC585SUXWbKdscLOlSO/products_400/-OWdfiidbZKp60dP2XVG.jpg",
        featured: 0,
        pricePerGram: "6250.00",
        stock: 1
      },
      {
        name: "Fancy Long Poth 22K",
        description: "Extended fancy poth with elaborate design - authentic Mamdej Jewellers design (20 items in collection)",
        category: "fancy-poth",
        subcategory: "long",
        weight: "35.5",
        purity: "22K Gold",
        material: "gold",
        imageUrl: "https://cdn.quicksell.co/-NC585SUXWbKdscLOlSO/products_400/-ONOL0qwaVXMLUzqWlfw.jpg",
        featured: 0,
        pricePerGram: "6250.00",
        stock: 1
      },

      // CHOKER 22K - Authentic data from Mamdej website
      {
        name: "Temple Choker 22K",
        description: "Sacred temple design choker necklace - authentic Mamdej Jewellers design (11 items in collection)",
        category: "choker",
        subcategory: "temple",
        weight: "42.0",
        purity: "22K Gold",
        material: "gold",
        imageUrl: "https://cdn.quicksell.co/-NC585SUXWbKdscLOlSO/products_400/-OSTu3vTuwmExEYADJ5v.jpg",
        featured: 1,
        pricePerGram: "6250.00",
        stock: 1
      },
      {
        name: "Yellow Choker 22K",
        description: "Elegant yellow gold choker design - authentic Mamdej Jewellers design (2 items in collection)",
        category: "choker",
        subcategory: "yellow",
        weight: "38.5",
        purity: "22K Gold",
        material: "gold",
        imageUrl: "https://cdn.quicksell.co/-NC585SUXWbKdscLOlSO/products_400/-NCAqzuGP6PqGYOBygBq.jpg",
        featured: 0,
        pricePerGram: "6250.00",
        stock: 1
      }
    ];
  }
}

export const storage = new DatabaseStorage();