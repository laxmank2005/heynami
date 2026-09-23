import express from "express";
import { sendMessage, getMessage, markAsRead } from "../controllers/messageController.js";
import isauthenticated from "../middleware/isAuthenticated.js";

const router = express.Router();

router.route("/send/:id").post(isauthenticated, sendMessage);
router.route("/:id").get(isauthenticated, getMessage);
router.route("/read/:senderId").put(isauthenticated, markAsRead);

export default router;