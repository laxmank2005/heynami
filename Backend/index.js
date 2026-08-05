import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/database.js";
import userRoutes from "./routes/userRoutes.js";
import cookieParser from "cookie-parser";
import messageRoutes from "./routes/messageRoutes.js";
import cors from "cors";
import { app, server } from "./socket/socket.js";

dotenv.config();

const PORT = process.env.PORT || 8080;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

connectDB();

// routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/message", messageRoutes);

// Health check endpoint
app.get("/", (req, res) => {
  res.json({ message: "Chat API is running!", status: "ok" });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});





