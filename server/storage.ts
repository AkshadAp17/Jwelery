import { type User, type InsertUser, type Product, type InsertProduct, type Rate, type InsertRate } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getProducts(): Promise<Product[]>;
  getProductsByCategory(category: string): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  importCatalogProducts(products: InsertProduct[]): Promise<Product[]>;
  getFeaturedProducts(): Promise<Product[]>;
  
  getRates(): Promise<Rate[]>;
  updateRate(rate: InsertRate): Promise<Rate>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private products: Map<string, Product>;
  private rates: Map<string, Rate>;

  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.rates = new Map();
    this.initializeData();
  }

  private initializeData() {
    // Initialize Mamdej Jewellers catalog products
    const sampleProducts: InsertProduct[] = [
      // PATTA POTH 22K - Long Poth
      {
        name: "Patti Long Poth 22K",
        description: "Traditional long patta poth chain with intricate design - authentic Mamdej Jewellers design (78 items in collection)",
        category: "patta-poth",
        subcategory: "long",
        weight: "25.5",
        purity: "22K Gold",
        material: "gold",
        imageUrl: "https://cdn.quicksell.co/-NC585SUXWbKdscLOlSO/products_400/-OUANr2XivMO9ndCXNbm.jpg",
        featured: 1,
        pricePerGram: "6250.00"
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
        pricePerGram: "6250.00"
      },
      
      // NECKLACE 20K
      {
        name: "Fancy Necklace 20K",
        description: "Beautiful fancy design necklace in 20K gold - authentic Mamdej Jewellers design (60 items in collection)",
        category: "necklace",
        subcategory: "fancy-20k",
        weight: "35.0",
        purity: "20K Gold",
        material: "gold",
        imageUrl: "https://cdn.quicksell.co/-NC585SUXWbKdscLOlSO/products_400/-OWBDQnKvRuKIs0Etcej.jpg",
        featured: 1,
        pricePerGram: "5800.00"
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
        pricePerGram: "5800.00"
      },
      {
        name: "Arbi Necklace 20K",
        description: "Arabic style necklace with unique patterns",
        category: "necklace",
        subcategory: "arbi-20k",
        weight: "22.0",
        purity: "20K Gold",
        material: "gold",
        imageUrl: "https://cdn.quicksell.co/-NC585SUXWbKdscLOlSO/products_400/-OL9cg9hfPV1a3MTjZJx.jpg",
        featured: 0,
        pricePerGram: "5800.00"
      },
      
      // NECKLACE 22K
      {
        name: "Temple Necklace 22K",
        description: "Sacred temple design necklace in 22K gold",
        category: "necklace",
        subcategory: "temple-22k",
        weight: "45.0",
        purity: "22K Gold",
        material: "gold",
        imageUrl: "https://cdn.quicksell.co/-NC585SUXWbKdscLOlSO/products_400/-OQbGrKDYWOMt4I1P3_D.jpg",
        featured: 1,
        pricePerGram: "6250.00"
      },
      {
        name: "Fancy Necklace 22K",
        description: "Elegant fancy design necklace in 22K gold",
        category: "necklace",
        subcategory: "fancy-22k",
        weight: "38.5",
        purity: "22K Gold",
        material: "gold",
        imageUrl: "https://cdn.quicksell.co/-NC585SUXWbKdscLOlSO/products_400/-OUyR7FLxj9OG89qpI94.jpg",
        featured: 1,
        pricePerGram: "6250.00"
      },
      {
        name: "Classic Necklace 22K",
        description: "Traditional necklace design in premium 22K gold",
        category: "necklace",
        subcategory: "classic-22k",
        weight: "32.0",
        purity: "22K Gold",
        material: "gold",
        imageUrl: "https://cdn.quicksell.co/-NC585SUXWbKdscLOlSO/products_400/-OSEuuQBC0n-PhssMD0l.jpg",
        featured: 0,
        pricePerGram: "6250.00"
      },
      
      // FANCY POTH 22K
      {
        name: "Fancy Poth With Pendant 22K",
        description: "Beautiful fancy poth with matching pendant",
        category: "fancy-poth",
        subcategory: "with-pendant",
        weight: "28.5",
        purity: "22K Gold",
        material: "gold",
        imageUrl: "https://cdn.quicksell.co/-NC585SUXWbKdscLOlSO/products_400/-OPf3ddUzrqvAEstCTE7.jpg",
        featured: 1,
        pricePerGram: "6250.00"
      },
      {
        name: "Cartier Poth 22K",
        description: "Luxurious Cartier style poth design",
        category: "fancy-poth",
        subcategory: "cartier",
        weight: "24.0",
        purity: "22K Gold",
        material: "gold",
        imageUrl: "https://cdn.quicksell.co/-NC585SUXWbKdscLOlSO/products_400/-OMb7WhA0ZOs6XLtn3sG.jpg",
        featured: 1,
        pricePerGram: "6250.00"
      },
      {
        name: "Fancy Nano Poth 22K",
        description: "Delicate nano poth with intricate work",
        category: "fancy-poth",
        subcategory: "nano",
        weight: "12.5",
        purity: "22K Gold",
        material: "gold",
        imageUrl: "https://cdn.quicksell.co/-NC585SUXWbKdscLOlSO/products_400/-OUUKkBSet-GR50FMdkv.jpg",
        featured: 0,
        pricePerGram: "6250.00"
      },
      {
        name: "Fancy Short Poth 22K",
        description: "Compact fancy poth perfect for everyday wear",
        category: "fancy-poth",
        subcategory: "short",
        weight: "18.0",
        purity: "22K Gold",
        material: "gold",
        imageUrl: "https://cdn.quicksell.co/-NC585SUXWbKdscLOlSO/products_400/-OWdfiidbZKp60dP2XVG.jpg",
        featured: 0,
        pricePerGram: "6250.00"
      },
      {
        name: "Fancy Long Poth 22K",
        description: "Extended fancy poth with elaborate design",
        category: "fancy-poth",
        subcategory: "long",
        weight: "35.5",
        purity: "22K Gold",
        material: "gold",
        imageUrl: "https://cdn.quicksell.co/-NC585SUXWbKdscLOlSO/products_400/-ONOL0qwaVXMLUzqWlfw.jpg",
        featured: 0,
        pricePerGram: "6250.00"
      },
      
      // CHOKER 22K
      {
        name: "Temple Choker 22K",
        description: "Sacred temple design choker necklace",
        category: "choker",
        subcategory: "temple",
        weight: "42.0",
        purity: "22K Gold",
        material: "gold",
        imageUrl: "https://cdn.quicksell.co/-NC585SUXWbKdscLOlSO/products_400/-OSTu3vTuwmExEYADJ5v.jpg",
        featured: 1,
        pricePerGram: "6250.00"
      },
      {
        name: "Yellow Choker 22K",
        description: "Elegant yellow gold choker design",
        category: "choker",
        subcategory: "yellow",
        weight: "38.5",
        purity: "22K Gold",
        material: "gold",
        imageUrl: "https://cdn.quicksell.co/-NC585SUXWbKdscLOlSO/products_400/-NCAqzuGP6PqGYOBygBq.jpg",
        featured: 0,
        pricePerGram: "6250.00"
      }
    ];

    sampleProducts.forEach(product => {
      const id = randomUUID();
      this.products.set(id, { 
        ...product, 
        id, 
        featured: product.featured || 0,
        subcategory: product.subcategory || null,
        region: product.region || null,
        pricePerGram: product.pricePerGram || null
      });
    });

    // Initialize rates
    const initialRates: InsertRate[] = [
      {
        material: "gold",
        rate: "6245.00",
        change: "15.00",
        updatedAt: new Date().toISOString()
      },
      {
        material: "silver",
        rate: "78.50",
        change: "-0.50",
        updatedAt: new Date().toISOString()
      }
    ];

    initialRates.forEach(rate => {
      const id = randomUUID();
      this.rates.set(rate.material, { ...rate, id });
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      product => product.category === category
    );
  }

  async getProduct(id: string): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = randomUUID();
    const product: Product = { 
      ...insertProduct, 
      id, 
      featured: insertProduct.featured || 0,
      subcategory: insertProduct.subcategory || null,
      region: insertProduct.region || null,
      pricePerGram: insertProduct.pricePerGram || null
    };
    this.products.set(id, product);
    return product;
  }

  async getFeaturedProducts(): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      product => product.featured === 1
    );
  }

  async getRates(): Promise<Rate[]> {
    return Array.from(this.rates.values());
  }

  async updateRate(insertRate: InsertRate): Promise<Rate> {
    const existingRate = Array.from(this.rates.values()).find(r => r.material === insertRate.material);
    if (existingRate) {
      const updatedRate = { ...existingRate, ...insertRate };
      this.rates.set(insertRate.material, updatedRate);
      return updatedRate;
    } else {
      const id = randomUUID();
      const rate: Rate = { ...insertRate, id };
      this.rates.set(insertRate.material, rate);
      return rate;
    }
  }

  async importCatalogProducts(products: InsertProduct[]): Promise<Product[]> {
    const existingProducts = Array.from(this.products.values());
    const createdProducts: Product[] = [];
    
    for (const product of products) {
      // Skip if product already exists (check by name)
      const exists = existingProducts.some(p => p.name === product.name);
      if (exists) {
        console.log(`Product ${product.name} already exists, skipping...`);
        continue;
      }
      
      const createdProduct = await this.createProduct(product);
      createdProducts.push(createdProduct);
    }
    return createdProducts;
  }
}

export const storage = new MemStorage();
