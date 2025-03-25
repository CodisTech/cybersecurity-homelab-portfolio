import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // API Routes - prefix all routes with /api
  const apiRouter = app.route('/api');
  
  // Services routes
  app.get("/api/services", async (_req: Request, res: Response) => {
    try {
      const services = await storage.getServices();
      res.json(services);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch services", error });
    }
  });
  
  app.get("/api/services/:id", async (req: Request, res: Response) => {
    try {
      const service = await storage.getService(Number(req.params.id));
      if (!service) {
        return res.status(404).json({ message: "Service not found" });
      }
      res.json(service);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch service", error });
    }
  });
  
  // Document routes
  app.get("/api/documents", async (_req: Request, res: Response) => {
    try {
      const documents = await storage.getDocuments();
      res.json(documents);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch documents", error });
    }
  });
  
  app.get("/api/documents/category/:category", async (req: Request, res: Response) => {
    try {
      const documents = await storage.getDocumentsByCategory(req.params.category);
      res.json(documents);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch documents by category", error });
    }
  });
  
  app.get("/api/documents/:id", async (req: Request, res: Response) => {
    try {
      const document = await storage.getDocument(Number(req.params.id));
      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }
      res.json(document);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch document", error });
    }
  });
  
  app.get("/api/documents/slug/:slug", async (req: Request, res: Response) => {
    try {
      const document = await storage.getDocumentBySlug(req.params.slug);
      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }
      res.json(document);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch document by slug", error });
    }
  });
  
  // Tutorial routes
  app.get("/api/tutorials", async (_req: Request, res: Response) => {
    try {
      const tutorials = await storage.getTutorials();
      res.json(tutorials);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tutorials", error });
    }
  });
  
  app.get("/api/tutorials/featured", async (_req: Request, res: Response) => {
    try {
      const tutorials = await storage.getFeaturedTutorials();
      res.json(tutorials);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch featured tutorials", error });
    }
  });
  
  app.get("/api/tutorials/:id", async (req: Request, res: Response) => {
    try {
      const tutorial = await storage.getTutorial(Number(req.params.id));
      if (!tutorial) {
        return res.status(404).json({ message: "Tutorial not found" });
      }
      res.json(tutorial);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tutorial", error });
    }
  });
  
  app.get("/api/tutorials/slug/:slug", async (req: Request, res: Response) => {
    try {
      const tutorial = await storage.getTutorialBySlug(req.params.slug);
      if (!tutorial) {
        return res.status(404).json({ message: "Tutorial not found" });
      }
      res.json(tutorial);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tutorial by slug", error });
    }
  });
  
  // Search route
  app.get("/api/search", async (req: Request, res: Response) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.status(400).json({ message: "Search query is required" });
      }
      
      const results = await storage.searchContent(query);
      res.json(results);
    } catch (error) {
      res.status(500).json({ message: "Search failed", error });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
