import type { Express, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { registerSchema, loginSchema, updatePortfolioSchema } from "@shared/schema";
import {
  hashPassword,
  verifyPassword,
  generateToken,
  authMiddleware,
  type AuthenticatedRequest,
} from "./auth";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", message: "PortfolioHub API is running" });
  });

  app.post("/api/auth/register", async (req, res: Response) => {
    try {
      const validatedData = registerSchema.parse(req.body);
      
      const existingEmail = await storage.getUserByEmail(validatedData.email);
      if (existingEmail) {
        res.status(400).json({ message: "Email already registered" });
        return;
      }
      
      const existingUsername = await storage.getUserByUsername(validatedData.username);
      if (existingUsername) {
        res.status(400).json({ message: "Username already taken" });
        return;
      }
      
      const hashedPassword = await hashPassword(validatedData.password);
      
      const user = await storage.createUser({
        username: validatedData.username,
        email: validatedData.email,
        password: hashedPassword,
        name: validatedData.name,
      });
      
      await storage.createPortfolio({
        userId: user.id,
        bio: null,
        title: null,
        location: null,
        website: null,
        github: null,
        linkedin: null,
        twitter: null,
        skills: [],
        projects: [],
        education: [],
        experience: [],
      });
      
      const token = generateToken({ userId: user.id, email: user.email });
      
      const { password: _, ...userWithoutPassword } = user;
      
      res.status(201).json({
        user: userWithoutPassword,
        token,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: error.errors[0].message });
        return;
      }
      console.error("Registration error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/auth/login", async (req, res: Response) => {
    try {
      const validatedData = loginSchema.parse(req.body);
      
      const user = await storage.getUserByEmail(validatedData.email);
      if (!user) {
        res.status(401).json({ message: "Invalid email or password" });
        return;
      }
      
      const isValidPassword = await verifyPassword(validatedData.password, user.password);
      if (!isValidPassword) {
        res.status(401).json({ message: "Invalid email or password" });
        return;
      }
      
      const token = generateToken({ userId: user.id, email: user.email });
      
      const { password: _, ...userWithoutPassword } = user;
      
      res.json({
        user: userWithoutPassword,
        token,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: error.errors[0].message });
        return;
      }
      console.error("Login error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/portfolio", authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user!.userId;
      
      const portfolio = await storage.getPortfolioByUserId(userId);
      if (!portfolio) {
        res.status(404).json({ message: "Portfolio not found" });
        return;
      }
      
      res.json(portfolio);
    } catch (error) {
      console.error("Get portfolio error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.put("/api/portfolio", authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user!.userId;
      
      const validatedData = updatePortfolioSchema.parse(req.body);
      
      let portfolio = await storage.getPortfolioByUserId(userId);
      
      if (!portfolio) {
        portfolio = await storage.createPortfolio({
          userId,
          bio: validatedData.bio || null,
          title: validatedData.title || null,
          location: validatedData.location || null,
          website: validatedData.website || null,
          github: validatedData.github || null,
          linkedin: validatedData.linkedin || null,
          twitter: validatedData.twitter || null,
          skills: validatedData.skills || [],
          projects: validatedData.projects || [],
          education: validatedData.education || [],
          experience: validatedData.experience || [],
        });
      } else {
        const updates: Partial<typeof portfolio> = {};
        
        if (validatedData.bio !== undefined) updates.bio = validatedData.bio || null;
        if (validatedData.title !== undefined) updates.title = validatedData.title || null;
        if (validatedData.location !== undefined) updates.location = validatedData.location || null;
        if (validatedData.website !== undefined) updates.website = validatedData.website || null;
        if (validatedData.github !== undefined) updates.github = validatedData.github || null;
        if (validatedData.linkedin !== undefined) updates.linkedin = validatedData.linkedin || null;
        if (validatedData.twitter !== undefined) updates.twitter = validatedData.twitter || null;
        if (validatedData.skills !== undefined) updates.skills = validatedData.skills;
        if (validatedData.projects !== undefined) updates.projects = validatedData.projects;
        if (validatedData.education !== undefined) updates.education = validatedData.education;
        if (validatedData.experience !== undefined) updates.experience = validatedData.experience;
        
        portfolio = await storage.updatePortfolio(userId, updates);
      }
      
      res.json(portfolio);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: error.errors[0].message });
        return;
      }
      console.error("Update portfolio error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/portfolio/:username", async (req, res: Response) => {
    try {
      const { username } = req.params;
      
      const user = await storage.getUserByUsername(username);
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }
      
      const portfolio = await storage.getPortfolioByUserId(user.id);
      if (!portfolio) {
        res.status(404).json({ message: "Portfolio not found" });
        return;
      }
      
      res.json({
        ...portfolio,
        user: {
          username: user.username,
          name: user.name,
        },
      });
    } catch (error) {
      console.error("Get public portfolio error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  return httpServer;
}
