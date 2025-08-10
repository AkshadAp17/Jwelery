import { sql } from "drizzle-orm";
import { pgTable, text, varchar, decimal, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const products = pgTable("products", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  subcategory: text("subcategory"),
  weight: decimal("weight", { precision: 10, scale: 2 }).notNull(),
  purity: text("purity").notNull(),
  material: text("material").notNull(), // gold, silver
  imageUrl: text("image_url").notNull(),
  featured: integer("featured").default(0),
  region: text("region"), // Andhra, Maharashtrian, Rajasthani, etc.
  pricePerGram: decimal("price_per_gram", { precision: 10, scale: 2 }),
});

export const rates = pgTable("rates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  material: text("material").notNull(), // gold, silver
  rate: decimal("rate", { precision: 10, scale: 2 }).notNull(),
  change: decimal("change", { precision: 10, scale: 2 }).notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
});

export const insertRateSchema = createInsertSchema(rates).omit({
  id: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Rate = typeof rates.$inferSelect;
export type InsertRate = z.infer<typeof insertRateSchema>;
