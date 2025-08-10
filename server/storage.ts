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
    // Initialize comprehensive Indian jewelry products
    const sampleProducts: InsertProduct[] = [
      // Gold Necklaces
      {
        name: "22K Gold Chain Necklace",
        description: "Classic daily wear gold chain",
        category: "necklaces",
        subcategory: "chains",
        weight: "15.5",
        purity: "22K Gold",
        material: "gold",
        imageUrl: "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        featured: 1,
        pricePerGram: "6250.00"
      },
      {
        name: "Antique Gold Choker",
        description: "Traditional South Indian design",
        category: "necklaces",
        subcategory: "chokers",
        weight: "35.0",
        purity: "22K Gold",
        material: "gold",
        region: "South Indian",
        imageUrl: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        featured: 1,
        pricePerGram: "6250.00"
      },
      
      // Mangalsutra Types
      {
        name: "Maharashtrian Mangalsutra",
        description: "Traditional black beads with gold pendant",
        category: "mangalsutra",
        subcategory: "maharashtrian",
        weight: "18.5",
        purity: "22K Gold",
        material: "gold",
        region: "Maharashtrian",
        imageUrl: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        featured: 1,
        pricePerGram: "6250.00"
      },
      {
        name: "Andhra Style Mangalsutra",
        description: "Long chain with traditional motifs",
        category: "mangalsutra",
        subcategory: "andhra",
        weight: "25.0",
        purity: "22K Gold",
        material: "gold",
        region: "Andhra",
        imageUrl: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        featured: 0,
        pricePerGram: "6250.00"
      },
      {
        name: "Rajasthani Mangalsutra",
        description: "Ornate design with Kundan work",
        category: "mangalsutra",
        subcategory: "rajasthani",
        weight: "22.0",
        purity: "22K Gold",
        material: "gold",
        region: "Rajasthani",
        imageUrl: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        featured: 0,
        pricePerGram: "6250.00"
      },
      
      // Gold Rings
      {
        name: "Gold Wedding Ring",
        description: "Simple elegant band for daily wear",
        category: "rings",
        subcategory: "wedding",
        weight: "8.5",
        purity: "18K Gold",
        material: "gold",
        imageUrl: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        featured: 1,
        pricePerGram: "5200.00"
      },
      {
        name: "Gold Signet Ring",
        description: "Traditional men's signet ring",
        category: "rings",
        subcategory: "signet",
        weight: "12.0",
        purity: "20K Gold",
        material: "gold",
        imageUrl: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        featured: 0,
        pricePerGram: "5800.00"
      },
      
      // Gold Earrings
      {
        name: "Gold Jhumka Earrings",
        description: "Traditional bell-shaped earrings",
        category: "earrings",
        subcategory: "jhumkas",
        weight: "12.0",
        purity: "22K Gold",
        material: "gold",
        imageUrl: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        featured: 1,
        pricePerGram: "6250.00"
      },
      {
        name: "Gold Chandbali Earrings",
        description: "Crescent moon shaped traditional earrings",
        category: "earrings",
        subcategory: "chandbali",
        weight: "15.5",
        purity: "22K Gold",
        material: "gold",
        imageUrl: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        featured: 0,
        pricePerGram: "6250.00"
      },
      
      // Silver Items
      {
        name: "Silver Pooja Thali",
        description: "Pure silver plate for religious ceremonies",
        category: "pooja-items",
        subcategory: "plates",
        weight: "250.0",
        purity: "999 Silver",
        material: "silver",
        imageUrl: "https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        featured: 1,
        pricePerGram: "85.00"
      },
      {
        name: "Silver Deepak (Diya)",
        description: "Traditional oil lamp for festivals",
        category: "pooja-items",
        subcategory: "deepak",
        weight: "85.0",
        purity: "925 Silver",
        material: "silver",
        imageUrl: "https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        featured: 1,
        pricePerGram: "82.00"
      },
      {
        name: "Silver Water Glass Set",
        description: "Set of 6 pure silver drinking glasses",
        category: "pooja-items",
        subcategory: "glasses",
        weight: "180.0",
        purity: "999 Silver",
        material: "silver",
        imageUrl: "https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        featured: 0,
        pricePerGram: "85.00"
      },
      {
        name: "Silver Ganesha Idol",
        description: "Lord Ganesha statue for home temple",
        category: "pooja-items",
        subcategory: "idols",
        weight: "125.0",
        purity: "925 Silver",
        material: "silver",
        imageUrl: "https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        featured: 1,
        pricePerGram: "82.00"
      },
      {
        name: "Silver Bracelet",
        description: "Elegant daily wear silver bracelet",
        category: "bracelets",
        subcategory: "bangles",
        weight: "25.0",
        purity: "925 Silver",
        material: "silver",
        imageUrl: "https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        featured: 0,
        pricePerGram: "82.00"
      },
      
      // Haras
      {
        name: "Royal Heritage Haar",
        description: "Traditional long necklace with intricate work",
        category: "haras",
        subcategory: "long-haar",
        weight: "45.5",
        purity: "22K Gold",
        material: "gold",
        region: "Rajasthani",
        imageUrl: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
        featured: 1,
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
    const createdProducts: Product[] = [];
    for (const product of products) {
      const createdProduct = await this.createProduct(product);
      createdProducts.push(createdProduct);
    }
    return createdProducts;
  }
}

export const storage = new MemStorage();
