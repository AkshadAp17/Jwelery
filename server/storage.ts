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
    try {
      // Create admin user if not exists
      const adminExists = await this.getUserByUsername("admin");
      if (!adminExists) {
        await this.createUser({
          username: "admin",
          password: "admin123",
          email: "admin@shreejewellers.com",
          role: "admin"
        });
        console.log("Admin user created successfully");
      }
    } catch (error) {
      console.log("Admin user already exists, skipping creation");
    }

    try {
      // Initialize with authentic Mamdej Jewellers catalog data
      const existingProducts = await this.getProducts();
      if (existingProducts.length === 0) {
        await this.importCatalogProducts(this.getAuthenticMamdejProducts());
        console.log("Catalog products imported successfully");
      }
    } catch (error) {
      console.log("Products already exist, skipping import");
    }

    try {
      // Initialize rates if not exists
      const existingRates = await this.getRates();
      if (existingRates.length === 0) {
        await this.updateRate({
          material: "gold",
          rate: "6250",
          change: "0",
          updatedAt: new Date().toISOString()
        });
        await this.updateRate({
          material: "silver",
          rate: "75",
          change: "0",
          updatedAt: new Date().toISOString()
        });
        console.log("Initial rates set successfully");
      }
    } catch (error) {
      console.log("Rates already exist, skipping initialization");
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

      // CHOKERS 22K - Based on catalog data
      {
        name: "Temple Zumka 22K",
        description: "Traditional temple design zumka earrings - authentic Mamdej Jewellers design (101 items in collection)",
        category: "chokers",
        subcategory: "temple-zumka",
        weight: "8.5",
        purity: "22K Gold",
        material: "gold",
        imageUrl: "https://cdn.quicksell.co/-NC585SUXWbKdscLOlSO/products_400/-OW5ejw99m7hD4e0Jz0M.jpg",
        featured: 1,
        pricePerGram: "6250.00",
        stock: 1
      },
      {
        name: "Temple Wati Set with Pendant 22K",
        description: "Complete temple wati set with matching pendant - authentic Mamdej Jewellers design (124 items in collection)",
        category: "chokers",
        subcategory: "temple-set",
        weight: "7.5",
        purity: "22K Gold",
        material: "gold",
        imageUrl: "https://cdn.quicksell.co/-NC585SUXWbKdscLOlSO/products_400/-OSnmAkU55iDrFbyaxbZ.jpg",
        featured: 1,
        pricePerGram: "6250.00",
        stock: 1
      },
      {
        name: "Andhra Fancy Zumka 20K",
        description: "Traditional Andhra style fancy zumka - authentic Mamdej Jewellers design (41 items in collection)",
        category: "chokers",
        subcategory: "andhra-fancy",
        weight: "9.0",
        purity: "20K Gold",
        material: "gold",
        imageUrl: "https://cdn.quicksell.co/-NC585SUXWbKdscLOlSO/products_400/-OKpwQIq_5CGaQ3F4H6v.jpg",
        featured: 0,
        pricePerGram: "5800.00",
        stock: 1
      },
      {
        name: "Temple Har 22K",
        description: "Magnificent temple design har necklace - authentic Mamdej Jewellers design (35 items in collection)",
        category: "chokers",
        subcategory: "temple-har",
        weight: "45.0",
        purity: "22K Gold",
        material: "gold",
        imageUrl: "https://cdn.quicksell.co/-NC585SUXWbKdscLOlSO/products_400/-OWyAJ-WO2LCtuP_PC8j.jpg",
        featured: 1,
        pricePerGram: "6250.00",
        stock: 1
      },
      {
        name: "Rani Har 20K",
        description: "Royal Rani har with traditional design - authentic Mamdej Jewellers design (45 items in collection)",
        category: "chokers",
        subcategory: "rani-har",
        weight: "25.0",
        purity: "20K Gold",
        material: "gold",
        imageUrl: "https://cdn.quicksell.co/-NC585SUXWbKdscLOlSO/products_400/-OX2gHBi-c8PH_eKizeX.jpg",
        featured: 1,
        pricePerGram: "5800.00",
        stock: 1
      },

      // CHAINS - Based on catalog data
      {
        name: "Indo Chain 22K",
        description: "Classic Indo chain design in 22K gold - authentic Mamdej Jewellers design (74 items in collection)",
        category: "chains",
        subcategory: "indo-chain",
        weight: "15.0",
        purity: "22K Gold",
        material: "gold",
        imageUrl: "https://cdn.quicksell.co/-NC585SUXWbKdscLOlSO/products_400/-OW_jR7qlNROv8rXC-VE.jpg",
        featured: 1,
        pricePerGram: "6250.00",
        stock: 1
      },
      {
        name: "Choco Chain 22K",
        description: "Elegant chocolate chain design - authentic Mamdej Jewellers design (16 items in collection)",
        category: "chains",
        subcategory: "choco-chain",
        weight: "20.0",
        purity: "22K Gold",
        material: "gold",
        imageUrl: "https://cdn.quicksell.co/-NC585SUXWbKdscLOlSO/products_400/-O1GwNMSoxDD4s0gZ1Ek.jpg",
        featured: 1,
        pricePerGram: "6250.00",
        stock: 1
      },

      // BRACELETS - Based on catalog data
      {
        name: "Bracelet 22K",
        description: "Traditional bracelet design in 22K gold - authentic Mamdej Jewellers design (61 items in collection)",
        category: "bracelets",
        subcategory: "traditional",
        weight: "15.0",
        purity: "22K Gold",
        material: "gold",
        imageUrl: "https://cdn.quicksell.co/-NC585SUXWbKdscLOlSO/products_400/-OWylgbzWAxHuPRofqig.jpg",
        featured: 1,
        pricePerGram: "6250.00",
        stock: 1
      },
      {
        name: "Casting Bracelet 92",
        description: "Precision cast bracelet with 92% purity - authentic Mamdej Jewellers design (27 items in collection)",
        category: "bracelets",
        subcategory: "casting",
        weight: "12.0",
        purity: "22K Gold",
        material: "gold",
        imageUrl: "https://cdn.quicksell.co/-NC585SUXWbKdscLOlSO/products_400/-OMzy4jZsrIbIgMEGAxZ.jpg",
        featured: 0,
        pricePerGram: "6250.00",
        stock: 1
      },
      {
        name: "Gents Kada",
        description: "Men's kada bracelet with traditional design - authentic Mamdej Jewellers design (60 items in collection)",
        category: "bracelets",
        subcategory: "gents-kada",
        weight: "25.0",
        purity: "22K Gold",
        material: "gold",
        imageUrl: "https://cdn.quicksell.co/-NC585SUXWbKdscLOlSO/products_400/-OTGjePpx1q2stcDp4q6.jpg",
        featured: 1,
        pricePerGram: "6250.00",
        stock: 1
      }
    ];
  }
}

export const storage = new DatabaseStorage();