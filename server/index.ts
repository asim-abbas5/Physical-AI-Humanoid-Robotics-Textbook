import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { auth } from "./auth";
import { toNodeHandler } from "better-auth/node";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.API_PORT || 8000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
}));
app.use(express.json());

// Mount BetterAuth handler at /api/auth
app.use("/api/auth", toNodeHandler(auth));

// Root endpoint
app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "Physical AI Textbook Backend API",
    version: "2.0.0",
    endpoints: {
      auth: "/api/auth/*",
      health: "/v1/health",
      query: "/v1/query",
      sections: "/v1/sections",
      userProfile: "/api/user/profile",
    },
  });
});

// Health check endpoint
app.get("/v1/health", (req: Request, res: Response) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    services: {
      database: "connected",
      auth: "active",
      qdrant: "not_configured",
      embedding_model: "not_loaded",
    },
  });
});

// User Profile Management Endpoints
interface UserProfileUpdate {
  programmingLanguage?: string;
  developmentEnvironment?: string;
}

app.get("/api/user/profile", async (req: Request, res: Response) => {
  try {
    // Get session from auth header
    const session = await auth.api.getSession({ headers: req.headers });

    if (!session) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Return user profile with custom fields
    res.json({
      user: session.user,
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.patch("/api/user/profile", async (req: Request, res: Response) => {
  try {
    const session = await auth.api.getSession({ headers: req.headers });

    if (!session) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const updates: UserProfileUpdate = req.body;

    // Update user profile with custom fields
    // Note: This will be implemented once BetterAuth's user update API is available
    // For now, this is a placeholder

    res.json({
      message: "Profile updated successfully",
      user: {
        ...session.user,
        ...updates,
      },
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// RAG Query endpoint (placeholder - will be implemented later)
interface QueryRequest {
  query: string;
  selected_text?: string;
  context_section?: string;
  top_k?: number;
}

app.post("/v1/query", async (req: Request, res: Response) => {
  try {
    const startTime = Date.now();
    const queryRequest: QueryRequest = req.body;

    // TODO: Implement RAG pipeline
    // 1. Generate query embedding
    // 2. Search Qdrant for top-k chunks
    // 3. Retrieve section metadata
    // 4. Generate grounded response
    // 5. Format citations

    // Placeholder response
    res.json({
      response: "This is a placeholder response. The RAG backend is not yet configured. Please set up Qdrant and Neon Postgres to enable context-aware answers.",
      citations: [
        {
          section_id: "01-nodes-topics",
          section_title: "ROS 2 Nodes and Topics",
          module_id: "module-01-ros2",
          module_title: "Module 1: ROS 2",
          url: "/docs/module-01-ros2/01-nodes-topics",
          excerpt: "Topics enable asynchronous, many-to-many communication...",
        },
      ],
      confidence: 0.0,
      response_time_ms: Date.now() - startTime,
    });
  } catch (error) {
    console.error("Error processing query:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// List sections endpoint (placeholder)
app.get("/v1/sections", (req: Request, res: Response) => {
  // TODO: Query Neon Postgres for section metadata
  res.json([
    {
      section_id: "01-nodes-topics",
      module_id: "module-01-ros2",
      title: "ROS 2 Nodes and Topics",
      word_count: 0,
      flesch_kincaid_grade: 10.0,
    },
  ]);
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/`);
  console.log(`🔐 Auth endpoints: http://localhost:${PORT}/api/auth/*`);
});
