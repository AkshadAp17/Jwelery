import { z } from "zod";

// MongoDB Schema Definitions
export interface User {
  _id?: string;
  id: string;
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
  role: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  _id?: string;
  id: string;
  name: string;
  description: string;
  category: string;
  subcategory?: string;
  material: 'gold' | 'silver';
  weight: string;
  purity: string;
  region?: string;
  images: string[];
  featured: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Rate {
  _id?: string;
  material: 'gold' | 'silver';
  rate: string;
  change: string;
  updatedAt: string;
}

export interface Category {
  _id?: string;
  id: string;
  name: string;
  path: string;
  description: string;
  subcategories: string[];
  image: string;
  productCount: number;
}

// Zod validation schemas
export const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  profileImageUrl: z.string().optional(),
  role: z.enum(['user', 'admin']).default('user'),
});

export const productSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  category: z.string().min(1),
  subcategory: z.string().optional(),
  material: z.enum(['gold', 'silver']),
  weight: z.string().min(1),
  purity: z.string().min(1),
  region: z.string().optional(),
  images: z.array(z.string()).default([]),
  featured: z.number().default(0),
});

export const rateSchema = z.object({
  material: z.enum(['gold', 'silver']),
  rate: z.string(),
  change: z.string(),
  updatedAt: z.string(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const registerSchema = userSchema.extend({
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Export types
export type CreateUser = z.infer<typeof userSchema>;
export type CreateProduct = z.infer<typeof productSchema>;
export type CreateRate = z.infer<typeof rateSchema>;
export type LoginCredentials = z.infer<typeof loginSchema>;
export type RegisterCredentials = z.infer<typeof registerSchema>;