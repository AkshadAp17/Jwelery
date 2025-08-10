import { nanoid } from 'nanoid';

// For development, we'll use in-memory storage with MongoDB-like interface
// In production, you would uncomment these and set up proper MongoDB
// import User from '../models/User';  
// import Product from '../models/Product';
// import Rate from '../models/Rate';

import { User as IUser, Product as IProduct, Rate as IRate, CreateUser, CreateProduct, CreateRate } from '@shared/mongoSchema';

// In-memory storage for development
const users: IUser[] = [];
const products: IProduct[] = [];
const rates: IRate[] = [];

export interface IStorage {
  // User operations
  getUser(id: string): Promise<IUser | null>;
  getUserByUsername(username: string): Promise<IUser | null>;
  createUser(userData: any): Promise<IUser>;
  authenticateUser(username: string, password: string): Promise<IUser | null>;
  updateUser(id: string, userData: Partial<IUser>): Promise<IUser | null>;
  
  // Product operations
  getProducts(): Promise<IProduct[]>;
  getProduct(id: string): Promise<IProduct | null>;
  getProductsByCategory(category: string): Promise<IProduct[]>;
  getFeaturedProducts(): Promise<IProduct[]>;
  createProduct(productData: any): Promise<IProduct>;
  updateProduct(id: string, productData: any): Promise<IProduct | null>;
  deleteProduct(id: string): Promise<boolean>;
  importCatalogProducts(products: any[]): Promise<IProduct[]>;
  
  // Rate operations
  getRates(): Promise<IRate[]>;
  updateRate(rateData: any): Promise<IRate>;
}

export class MongoStorage implements IStorage {
  constructor() {
    // Don't initialize data in constructor to avoid timing issues
    setTimeout(() => this.initializeData(), 2000);
  }

  private async initializeData() {
    try {
      // Initialize with sample data if needed
      const products = await this.getProducts();
      if (products.length === 0) {
        console.log("Importing authentic Mamdej Jewellers catalog data...");
        await this.importCatalogProducts(this.getAuthenticMamdejProducts());
        console.log("Catalog data imported successfully");
      }
      
      // Initialize rates
      const rates = await this.getRates();
      if (rates.length === 0) {
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
        console.log("Initial rates set");
      }
    } catch (error) {
      console.log("Data initialization will happen when database is ready");
    }
  }

  // User operations (using in-memory storage for development)
  async getUser(id: string): Promise<IUser | null> {
    return users.find(u => u.id === id) || null;
  }

  async getUserByUsername(username: string): Promise<IUser | null> {
    return users.find(u => u.username === username) || null;
  }

  async authenticateUser(username: string, password: string): Promise<IUser | null> {
    const user = users.find(u => u.username === username);
    if (user && user.password === password) {
      return user;
    }
    return null;
  }

  async createUser(userData: any): Promise<IUser> {
    const user: IUser = {
      ...userData,
      id: nanoid(),
      username: userData.username,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    users.push(user);
    return user;
  }

  async updateUser(id: string, userData: Partial<IUser>): Promise<IUser | null> {
    const userIndex = users.findIndex(u => u.id === id);
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...userData, updatedAt: new Date() };
      return users[userIndex];
    }
    return null;
  }

  // Product operations (using in-memory storage for development)  
  async getProducts(): Promise<IProduct[]> {
    return products;
  }

  async getProduct(id: string): Promise<IProduct | null> {
    return products.find(p => p.id === id) || null;
  }

  async getProductsByCategory(category: string): Promise<IProduct[]> {
    return products.filter(p => p.category === category);
  }

  async getFeaturedProducts(): Promise<IProduct[]> {
    return products.filter(p => p.featured === 1);
  }

  async createProduct(productData: any): Promise<IProduct> {
    const product: IProduct = {
      ...productData,
      id: nanoid(),
      images: productData.imageUrl ? [productData.imageUrl] : [],
      material: productData.material || 'gold',
      featured: productData.featured || 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    products.push(product);
    return product;
  }

  async updateProduct(id: string, productData: any): Promise<IProduct | null> {
    const productIndex = products.findIndex(p => p.id === id);
    if (productIndex !== -1) {
      products[productIndex] = { ...products[productIndex], ...productData, updatedAt: new Date() };
      return products[productIndex];
    }
    return null;
  }

  async deleteProduct(id: string): Promise<boolean> {
    const productIndex = products.findIndex(p => p.id === id);
    if (productIndex !== -1) {
      products.splice(productIndex, 1);
      return true;
    }
    return false;
  }

  async importCatalogProducts(productsList: any[]): Promise<IProduct[]> {
    const results = [];
    for (const productData of productsList) {
      const product = await this.createProduct(productData);
      results.push(product);
    }
    return results;
  }

  // Rate operations (using in-memory storage for development)
  async getRates(): Promise<IRate[]> {
    return rates;
  }

  async updateRate(rateData: any): Promise<IRate> {
    const existingIndex = rates.findIndex(r => r.material === rateData.material);
    if (existingIndex !== -1) {
      rates[existingIndex] = { ...rateData };
      return rates[existingIndex];
    } else {
      const newRate: IRate = { ...rateData };
      rates.push(newRate);
      return newRate;
    }
  }

  private getAuthenticMamdejProducts() {
    return [
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
        name: "Patti Short Poth 22K",
        description: "Elegant short patta poth design for daily wear - authentic Mamdej Jewellers design (67 items in collection)",
        category: "patta-poth",
        subcategory: "short",
        weight: "18.50",
        purity: "22K Gold",
        material: "gold",
        imageUrl: "https://cdn.quicksell.co/-NC585SUXWbKdscLOlSO/products_400/-OV32_LA01WVd3tBQeGh.jpg",
        featured: 1,
        pricePerGram: "6250.00",
        stock: 1
      },
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
        name: "Temple Necklace 22K",
        description: "Sacred temple design necklace - authentic Mamdej Jewellers design (26 items in collection)",
        category: "necklace",
        subcategory: "temple-22k",
        weight: "40.00",
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
        weight: "35.00",
        purity: "22K Gold",
        material: "gold",
        imageUrl: "https://cdn.quicksell.co/-NC585SUXWbKdscLOlSO/products_400/-OUyR7FLxj9OG89qpI94.jpg",
        featured: 1,
        pricePerGram: "6250.00",
        stock: 1
      },
      {
        name: "Fancy Poth With Pendant 22K",
        description: "Beautiful fancy poth with matching pendant - authentic Mamdej Jewellers design (29 items in collection)",
        category: "fancy-poth",
        subcategory: "with-pendant",
        weight: "28.50",
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
        weight: "24.00",
        purity: "22K Gold",
        material: "gold",
        imageUrl: "https://cdn.quicksell.co/-NC585SUXWbKdscLOlSO/products_400/-OMb7WhA0ZOs6XLtn3sG.jpg",
        featured: 1,
        pricePerGram: "6250.00",
        stock: 1
      },
      {
        name: "Temple Choker 22K",
        description: "Sacred temple design choker necklace - authentic Mamdej Jewellers design (11 items in collection)",
        category: "choker",
        subcategory: "temple",
        weight: "42.00",
        purity: "22K Gold",
        material: "gold",
        imageUrl: "https://cdn.quicksell.co/-NC585SUXWbKdscLOlSO/products_400/-OSTu3vTuwmExEYADJ5v.jpg",
        featured: 1,
        pricePerGram: "6250.00",
        stock: 1
      }
    ];
  }
}

export const mongoStorage = new MongoStorage();