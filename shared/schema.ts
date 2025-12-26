import { pgTable, text, varchar, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Project schema for portfolio
export const projectSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Title is required"),
  description: z.string(),
  link: z.string().url().optional().or(z.literal("")),
  technologies: z.array(z.string()).optional(),
});

// Education schema
export const educationSchema = z.object({
  id: z.string(),
  institution: z.string().min(1, "Institution is required"),
  degree: z.string(),
  field: z.string(),
  startDate: z.string(),
  endDate: z.string().optional(),
  current: z.boolean().optional(),
});

// Experience schema
export const experienceSchema = z.object({
  id: z.string(),
  company: z.string().min(1, "Company is required"),
  position: z.string().min(1, "Position is required"),
  description: z.string(),
  startDate: z.string(),
  endDate: z.string().optional(),
  current: z.boolean().optional(),
});

// Users table
export const users = pgTable("users", {
  id: varchar("id", { length: 36 }).primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
});

// Portfolio table
export const portfolios = pgTable("portfolios", {
  id: varchar("id", { length: 36 }).primaryKey(),
  userId: varchar("user_id", { length: 36 }).notNull(),
  // primary role of the person, used for role-based templates
  role: text("role").notNull().default("developer"),
  bio: text("bio"),
  title: text("title"),
  location: text("location"),
  website: text("website"),
  github: text("github"),
  linkedin: text("linkedin"),
  twitter: text("twitter"),
  profilePicture: text("profile_picture"),
  skills: jsonb("skills").$type<string[]>().default([]),
  projects: jsonb("projects").$type<z.infer<typeof projectSchema>[]>().default([]),
  education: jsonb("education").$type<z.infer<typeof educationSchema>[]>().default([]),
  experience: jsonb("experience").$type<z.infer<typeof experienceSchema>[]>().default([]),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export const insertPortfolioSchema = createInsertSchema(portfolios).omit({ id: true });

// Registration schema with validation
export const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters").max(30, "Username too long").regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(1, "Name is required"),
});

// Login schema
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

// Portfolio update schema
export const updatePortfolioSchema = z.object({
  bio: z.string().optional(),
  title: z.string().optional(),
  location: z.string().optional(),
  website: z.string().optional(),
  github: z.string().optional(),
  linkedin: z.string().optional(),
  twitter: z.string().optional(),
  profilePicture: z.string().nullish(),
  skills: z.array(z.string()).optional(),
  projects: z.array(projectSchema).optional(),
  education: z.array(educationSchema).optional(),
  experience: z.array(experienceSchema).optional(),
  // role drives which visual template is used on the public portfolio page
  role: z.enum(["developer", "tester", "ai_ml", "data_analyst", "premium", "minimal", "creative", "modern", "compact"]).optional(),
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Portfolio = typeof portfolios.$inferSelect;
export type InsertPortfolio = z.infer<typeof insertPortfolioSchema>;
export type Project = z.infer<typeof projectSchema>;
export type Education = z.infer<typeof educationSchema>;
export type Experience = z.infer<typeof experienceSchema>;

// Auth response type
export type AuthResponse = {
  user: Omit<User, "password">;
  token: string;
};

// Public portfolio type (includes user info)
export type PublicPortfolio = Portfolio & {
  user: {
    username: string;
    name: string;
  };
};

// AI Analysis types
export interface AIScores {
  contentQuality: number; // 0-100
  atsCompatibility: number; // 0-100
  completeness: number; // 0-100
  impact: number; // 0-100
  overall: number; // 0-100
}

export interface AISuggestion {
  id: string;
  category: "critical" | "important" | "recommended";
  title: string;
  description: string;
  section: "bio" | "skills" | "experience" | "projects" | "education" | "general";
}

export interface ATSIssue {
  id: string;
  severity: "high" | "medium" | "low";
  issue: string;
  suggestion: string;
}

export interface AIAnalysisResult {
  scores: AIScores;
  suggestions: AISuggestion[];
  atsIssues: ATSIssue[];
  summary: string;
  analyzedAt: string;
}
