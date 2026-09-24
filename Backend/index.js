import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/database.js";
import userRoutes from "./routes/userRoutes.js";
import cookieParser from "cookie-parser";
import messageRoutes from "./routes/messageRoutes.js";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import { app, server } from "./socket/socket.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const PORT = process.env.PORT || 8080;
let FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
if (FRONTEND_URL.endsWith('/')) {
  FRONTEND_URL = FRONTEND_URL.slice(0, -1);
}

const isProduction = process.env.NODE_ENV === "production";

// 1. Security Headers
app.use(helmet({
  // Allow the app to work inside iframes for local dev but restrict in production
  contentSecurityPolicy: isProduction ? undefined : false,
}));

// 2. CORS — in production the frontend is served from the same origin, but we still
//    need it for the Socket.IO handshake and any external API calls.
const corsOptions = {
  origin: isProduction
    ? [FRONTEND_URL]
    : ["http://localhost:5173", "http://localhost:4173"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
};
app.use(cors(corsOptions));

// 3. Global Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many requests from this IP, please try again later." },
});
app.use("/api", limiter);

// 4. Auth Route Rate Limiting
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many authentication attempts, please try again later." },
});
app.use("/api/v1/user/login", authLimiter);
app.use("/api/v1/user/register", authLimiter);

// 5. Body parser & Cookie parser
app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());

// 6. Data Sanitization against NoSQL injection & XSS
app.use(mongoSanitize());
app.use(xss());

// Connect to MongoDB
connectDB();

// API Routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/message", messageRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "Server is running", env: process.env.NODE_ENV });
});

// ── Production: Serve the React build ──────────────────────────────────────
if (isProduction) {
  const frontendDistPath = path.join(__dirname, "..", "Frontend", "dist");
  app.use(express.static(frontendDistPath));

  // All non-API routes → hand to React Router
  app.get("*", (req, res) => {
    if (!req.path.startsWith("/api")) {
      res.sendFile(path.join(frontendDistPath, "index.html"));
    }
  });
}

server.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running on port ${PORT} [${process.env.NODE_ENV || "development"}]`);
  if (isProduction) {
    console.log(`🌍 Serving frontend static files from Frontend/dist`);
  }
});
