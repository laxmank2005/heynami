import express from "express";
import dotenv from "dotenv";
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

const PORT = process.env.PORT || 8080;
let FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
if (FRONTEND_URL.endsWith('/')) {
  FRONTEND_URL = FRONTEND_URL.slice(0, -1);
}

// 1. Security Headers
app.use(helmet());

// 2. Strict CORS
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"]
  })
);

// 3. Global Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Limit each IP to 1000 requests per window
  message: { message: "Too many requests from this IP, please try again later." }
});
app.use("/api", limiter);

// 4. Auth/Login Rate Limiting (Stricter limit for auth routes)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Limit each IP to 50 login/register requests
  message: { message: "Too many authentication attempts, please try again later." }
});
app.use("/api/v1/user/login", authLimiter);
app.use("/api/v1/user/register", authLimiter);

// 5. Body parser & Cookie parser
app.use(express.json({ limit: "10kb" })); // limit body size
app.use(cookieParser());

// 6. Data Sanitization
import { Conversation } from "./models/conversationModel.js";
import { User } from "./models/userModel.js";
import { Messages } from "./models/messageModel.js";

connectDB();

// routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/message", messageRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "Server is running" });
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});





