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
import { analyzePortfolioWithAI, optimizePortfolioWithAI } from "./ai-mentor";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", message: "PortfolioHub API is running" });
  });

  // --- Auth Routes ---
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
        role: "developer",
        bio: null,
        title: null,
        location: null,
        website: null,
        github: null,
        linkedin: null,
        twitter: null,
        profilePicture: null,
        skills: [],
        projects: [],
        education: [],
        experience: [],
        achievements: [],
      });

      const token = generateToken({ userId: user.id, email: user.email });
      const { password: _, ...userWithoutPassword } = user;

      res.status(201).json({ user: userWithoutPassword, token });
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

      res.json({ user: userWithoutPassword, token });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: error.errors[0].message });
        return;
      }
      console.error("Login error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // --- Portfolio Routes ---
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
      console.log(`[PORTFOLIO UPDATE] User ID: ${userId}`);
      let portfolio = await storage.getPortfolioByUserId(userId);

      if (!portfolio) {
        console.log(`[PORTFOLIO CREATE] Creating new portfolio for user ${userId}`);
        portfolio = await storage.createPortfolio({
          userId,
          role: validatedData.role || "developer",
          bio: validatedData.bio || null,
          title: validatedData.title || null,
          location: validatedData.location || null,
          website: validatedData.website || null,
          github: validatedData.github || null,
          linkedin: validatedData.linkedin || null,
          twitter: validatedData.twitter || null,
          profilePicture: validatedData.profilePicture || null,
          skills: validatedData.skills || [],
          projects: validatedData.projects || [],
          education: validatedData.education || [],
          experience: validatedData.experience || [],
          achievements: validatedData.achievements || [],
        });
        console.log(`[PORTFOLIO CREATE] Portfolio created with ID: ${portfolio.id}`);
      } else {
        console.log(`[PORTFOLIO UPDATE] Updating existing portfolio ID: ${portfolio.id}`);
        const updates: Partial<typeof portfolio> = {};
        if (validatedData.bio !== undefined) updates.bio = validatedData.bio || null;
        if (validatedData.title !== undefined) updates.title = validatedData.title || null;
        if (validatedData.location !== undefined) updates.location = validatedData.location || null;
        if (validatedData.website !== undefined) updates.website = validatedData.website || null;
        if (validatedData.github !== undefined) updates.github = validatedData.github || null;
        if (validatedData.linkedin !== undefined) updates.linkedin = validatedData.linkedin || null;
        if (validatedData.twitter !== undefined) updates.twitter = validatedData.twitter || null;
        if (validatedData.profilePicture !== undefined) {
          updates.profilePicture = validatedData.profilePicture || null;
          console.log("Saving profile picture, length:", validatedData.profilePicture?.length || 0);
        }
        if (validatedData.skills !== undefined) updates.skills = validatedData.skills;
        if (validatedData.projects !== undefined) updates.projects = validatedData.projects;
        if (validatedData.education !== undefined) updates.education = validatedData.education;
        if (validatedData.experience !== undefined) updates.experience = validatedData.experience;
        if (validatedData.achievements !== undefined) updates.achievements = validatedData.achievements;
        if (validatedData.role !== undefined) updates.role = validatedData.role;

        portfolio = await storage.updatePortfolio(userId, updates);
        console.log("Portfolio updated, has profilePicture:", !!(portfolio as any).profilePicture);
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
      console.log(`Looking for portfolio with username: "${username}"`);
      const user = await storage.getUserByUsername(username);
      if (!user) {
        console.log(`User not found. Available users:`, Array.from((storage as any).users.values()).map((u: any) => u.username));
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
        user: { username: user.username, name: user.name },
      });
    } catch (error) {
      console.error("Get public portfolio error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // --- NEW: Layout Optimization Route ---
  app.post("/api/portfolio/optimize", authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user!.userId;
      const { jobDescription } = req.body;

      if (!jobDescription) {
        res.status(400).json({ message: "Job Description is required" });
        return;
      }

      console.log(`[AI OPTIMIZER] Optimizing portfolio for user ID: ${userId}`);

      const portfolio = await storage.getPortfolioByUserId(userId);
      if (!portfolio) {
        res.status(404).json({ message: "Portfolio not found" });
        return;
      }

      // Optimize content
      const optimizedData = await optimizePortfolioWithAI(portfolio, jobDescription);

      res.json(optimizedData);

    } catch (error) {
      console.error("Portfolio optimization error:", error);
      res.status(500).json({ message: "Failed to optimize portfolio" });
    }
  });

  // --- CHANGED: Updated Analysis Route with Job Description support ---
  app.post("/api/portfolio/analyze", authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user!.userId;
      console.log(`[AI MENTOR] Analyzing portfolio for user ID: ${userId}`);

      // Extract optional jobDescription from the request body
      const { jobDescription } = req.body;

      const user = await storage.getUser(userId);
      if (!user) {
        console.error(`[AI MENTOR] User not found for ID: ${userId}`);
        console.log(`[AI MENTOR] Available users:`, Array.from((storage as any).users.keys()));
        res.status(404).json({
          message: "User not found. Your session may have expired. Please log out and log back in."
        });
        return;
      }

      const portfolio = await storage.getPortfolioByUserId(userId);
      if (!portfolio) {
        console.error(`[AI MENTOR] Portfolio not found for user: ${user.name}`);
        res.status(404).json({ message: "Portfolio not found" });
        return;
      }

      console.log(`Analyzing portfolio for ${user.name}${jobDescription ? ' (Matching against JD)' : ''}`);

      // Pass the jobDescription into the AI service
      const analysis = await analyzePortfolioWithAI(portfolio, user.name, jobDescription);

      res.json(analysis);
    } catch (error) {
      console.error("Portfolio analysis error:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to analyze portfolio";
      res.status(500).json({
        message: "Failed to analyze portfolio",
        details: errorMessage,
        fallback: true
      });
    }
  });

  return httpServer;
}