import { nanoid } from 'nanoid';
import User from '../models/User';
import Product from '../models/Product';
import Rate from '../models/Rate';
import { User as IUser, Product as IProduct, Rate as IRate, CreateUser, CreateProduct, CreateRate } from '@shared/mongoSchema';

export interface IStorage {
  // User operations
  getUserById(id: string): Promise<IUser | null>;
  getUserByEmail(email: string): Promise<IUser | null>;
  createUser(userData: CreateUser): Promise<IUser>;
  updateUser(id: string, userData: Partial<IUser>): Promise<IUser | null>;
  
  // Product operations
  getAllProducts(): Promise<IProduct[]>;
  getProduct(id: string): Promise<IProduct | null>;
  getProductsByCategory(category: string): Promise<IProduct[]>;
  getProductsBySubcategory(category: string, subcategory: string): Promise<IProduct[]>;
  getFeaturedProducts(): Promise<IProduct[]>;
  createProduct(productData: CreateProduct): Promise<IProduct>;
  updateProduct(id: string, productData: Partial<IProduct>): Promise<IProduct | null>;
  deleteProduct(id: string): Promise<boolean>;
  
  // Rate operations
  getRates(): Promise<IRate[]>;
  getRateByMaterial(material: 'gold' | 'silver'): Promise<IRate | null>;
  updateRate(rateData: CreateRate): Promise<IRate>;
}

export class MongoStorage implements IStorage {
  // User operations
  async getUserById(id: string): Promise<IUser | null> {
    return await User.findOne({ id }).lean();
  }

  async getUserByEmail(email: string): Promise<IUser | null> {
    return await User.findOne({ email }).lean();
  }

  async createUser(userData: CreateUser): Promise<IUser> {
    const user = new User({
      ...userData,
      id: nanoid(),
    });
    await user.save();
    return user.toObject();
  }

  async updateUser(id: string, userData: Partial<IUser>): Promise<IUser | null> {
    const user = await User.findOneAndUpdate({ id }, userData, { new: true }).lean();
    return user;
  }

  // Product operations
  async getAllProducts(): Promise<IProduct[]> {
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

  async createProduct(productData: CreateProduct): Promise<IProduct> {
    const product = new Product({
      ...productData,
      id: nanoid(),
    });
    await product.save();
    return product.toObject();
  }

  async updateProduct(id: string, productData: Partial<IProduct>): Promise<IProduct | null> {
    const product = await Product.findOneAndUpdate({ id }, productData, { new: true }).lean();
    return product;
  }

  async deleteProduct(id: string): Promise<boolean> {
    const result = await Product.deleteOne({ id });
    return result.deletedCount > 0;
  }

  // Rate operations
  async getRates(): Promise<IRate[]> {
    return await Rate.find().lean();
  }

  async getRateByMaterial(material: 'gold' | 'silver'): Promise<IRate | null> {
    return await Rate.findOne({ material }).lean();
  }

  async updateRate(rateData: CreateRate): Promise<IRate> {
    const rate = await Rate.findOneAndUpdate(
      { material: rateData.material },
      rateData,
      { new: true, upsert: true }
    ).lean();
    return rate!;
  }
}

export const mongoStorage = new MongoStorage();