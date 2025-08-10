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
    // Initialize sample products
    const sampleProducts: InsertProduct[] = [
      {
        name: "Classic Gold Pendant",
        description: "Traditional design with modern appeal",
        category: "necklaces",
        weight: "15.5",
        purity: "22K Gold",
        material: "gold",
        imageUrl: "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        featured: 1
      },
      {
        name: "Silver Designer Bracelet",
        description: "Intricate patterns with contemporary style",
        category: "bracelets",
        weight: "25.0",
        purity: "925 Silver",
        material: "silver",
        imageUrl: "https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        featured: 1
      },
      {
        name: "Diamond Engagement Ring",
        description: "Solitaire setting with brilliant cut diamond",
        category: "rings",
        weight: "8.5",
        purity: "18K Gold",
        material: "gold",
        imageUrl: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        featured: 1
      },
      {
        name: "Traditional Pearl Earrings",
        description: "Classic design with cultured pearls",
        category: "earrings",
        weight: "12.0",
        purity: "22K Gold",
        material: "gold",
        imageUrl: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        featured: 1
      },
      {
        name: "Royal Heritage Haar",
        description: "Traditional royal design with intricate work",
        category: "haras",
        weight: "45.5",
        purity: "22K Gold",
        material: "gold",
        imageUrl: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        featured: 0
      },
      {
        name: "Sacred Mangalsutra",
        description: "Traditional design with modern touch",
        category: "mangalsutra",
        weight: "18.5",
        purity: "22K Gold",
        material: "gold",
        imageUrl: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        featured: 0
      }
    ];

    sampleProducts.forEach(product => {
      const id = randomUUID();
      this.products.set(id, { ...product, id });
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
    const product: Product = { ...insertProduct, id };
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
}

export const storage = new MemStorage();
