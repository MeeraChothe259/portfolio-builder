import type { User, InsertUser, Portfolio, InsertPortfolio } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getPortfolioByUserId(userId: string): Promise<Portfolio | undefined>;
  getPortfolioByUsername(username: string): Promise<Portfolio | undefined>;
  createPortfolio(portfolio: InsertPortfolio): Promise<Portfolio>;
  updatePortfolio(userId: string, updates: Partial<Portfolio>): Promise<Portfolio | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private portfolios: Map<string, Portfolio>;

  constructor() {
    this.users = new Map();
    this.portfolios = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username.toLowerCase() === username.toLowerCase()
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email.toLowerCase() === email.toLowerCase()
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getPortfolioByUserId(userId: string): Promise<Portfolio | undefined> {
    return Array.from(this.portfolios.values()).find(
      (portfolio) => portfolio.userId === userId
    );
  }

  async getPortfolioByUsername(username: string): Promise<Portfolio | undefined> {
    const user = await this.getUserByUsername(username);
    if (!user) return undefined;
    return this.getPortfolioByUserId(user.id);
  }

  async createPortfolio(insertPortfolio: InsertPortfolio): Promise<Portfolio> {
    const id = randomUUID();
    const portfolio: Portfolio = {
      id,
      userId: insertPortfolio.userId,
      bio: insertPortfolio.bio || null,
      title: insertPortfolio.title || null,
      location: insertPortfolio.location || null,
      website: insertPortfolio.website || null,
      github: insertPortfolio.github || null,
      linkedin: insertPortfolio.linkedin || null,
      twitter: insertPortfolio.twitter || null,
      skills: insertPortfolio.skills || [],
      projects: insertPortfolio.projects || [],
      education: insertPortfolio.education || [],
      experience: insertPortfolio.experience || [],
    };
    this.portfolios.set(id, portfolio);
    return portfolio;
  }

  async updatePortfolio(userId: string, updates: Partial<Portfolio>): Promise<Portfolio | undefined> {
    const portfolio = await this.getPortfolioByUserId(userId);
    if (!portfolio) return undefined;
    
    const updatedPortfolio: Portfolio = {
      ...portfolio,
      ...updates,
      id: portfolio.id,
      userId: portfolio.userId,
    };
    this.portfolios.set(portfolio.id, updatedPortfolio);
    return updatedPortfolio;
  }
}

export const storage = new MemStorage();
