import { nanoid } from 'nanoid';
import User from '../models/User';
import Product from '../models/Product';
import Rate from '../models/Rate';
import { User as IUser, Product as IProduct, Rate as IRate, CreateUser, CreateProduct, CreateRate } from '@shared/mongoSchema';

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
    this.initializeData();
  }

  private async initializeData() {
    // Initialize with sample data if needed
    const products = await this.getProducts();
    if (products.length === 0) {
      await this.importCatalogProducts(this.getAuthenticMamdejProducts());
    }
  }

  // User operations
  async getUser(id: string): Promise<IUser | null> {
    return await User.findOne({ id }).lean();
  }

  async getUserByUsername(username: string): Promise<IUser | null> {
    return await User.findOne({ username: username }).lean();
  }

  async authenticateUser(username: string, password: string): Promise<IUser | null> {
    const user = await User.findOne({ username }).lean();
    if (user && user.password === password) {
      return user;
    }
    return null;
  }

  async createUser(userData: any): Promise<IUser> {
    const user = new User({
      ...userData,
      id: nanoid(),
      username: userData.username,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    await user.save();
    return user.toObject();
  }

  async updateUser(id: string, userData: Partial<IUser>): Promise<IUser | null> {
    const user = await User.findOneAndUpdate({ id }, userData, { new: true }).lean();
    return user;
  }

  // Product operations
  async getProducts(): Promise<IProduct[]> {
    return await Product.find().lean();
  }

  async getProduct(id: string): Promise<IProduct | null> {
    return await Product.findOne({ id }).lean();
  }

  async getProductsByCategory(category: string): Promise<IProduct[]> {
    return await Product.find({ category }).lean();
  }

  async getProductsBySubcategory(category: string, subcategory: string): Promise<IProduct[]> {
    return await Product.find({ category, subcategory }).lean();
  }

  async getFeaturedProducts(): Promise<IProduct[]> {
    return await Product.find({ featured: 1 }).lean();
  }

  async createProduct(productData: any): Promise<IProduct> {
    const product = new Product({
      ...productData,
      id: nanoid(),
      images: productData.imageUrl ? [productData.imageUrl] : [],
      material: productData.material || 'gold',
      featured: productData.featured || 0,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    await product.save();
    return product.toObject();
  }

  async updateProduct(id: string, productData: any): Promise<IProduct | null> {
    const product = await Product.findOneAndUpdate({ id }, {
      ...productData,
      updatedAt: new Date()
    }, { new: true }).lean();
    return product;
  }

  async deleteProduct(id: string): Promise<boolean> {
    const result = await Product.deleteOne({ id });
    return result.deletedCount > 0;
  }

  async importCatalogProducts(products: any[]): Promise<IProduct[]> {
    const results = [];
    for (const productData of products) {
      const product = await this.createProduct(productData);
      results.push(product);
    }
    return results;
  }

  // Rate operations
  async getRates(): Promise<IRate[]> {
    return await Rate.find().lean();
  }

  async updateRate(rateData: any): Promise<IRate> {
    const rate = await Rate.findOneAndUpdate(
      { material: rateData.material },
      {
        ...rateData,
        material: rateData.material
      },
      { new: true, upsert: true }
    ).lean();
    return rate!;
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