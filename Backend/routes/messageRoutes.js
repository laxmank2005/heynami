import express from "express";
import { sendMessage } from "../controllers/messageController.js";
import isauthenticated from "../middleware/isAuthenticated.js";


const router = express.Router();

router.route("/send/:id").post(isauthenticated, sendMessage);


export default router;