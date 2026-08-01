import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/database.js";
import userRoutes from "./routes/userRoutes.js";
import cookieParser from "cookie-parser";
import messageRoutes from "./routes/messageRoutes.js";
import cors from "cors";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());


const PORT = process.env.PORT || 8080;

connectDB();

// routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/message", messageRoutes);
//http://localhost:8080/api/v1/user/register

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});




