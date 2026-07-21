import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/database.js";
import userRoutes from "./routes/userRoutes.js";
dotenv.config();

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 8080;

connectDB();

// routes
app.use("/api/v1/user", userRoutes);
//http://localhost:8080/api/v1/user/register

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});




