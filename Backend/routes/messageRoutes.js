import express from "express";
import { sendMessage, getMessage, markAsRead, editMessage, deleteMessage, reactMessage } from "../controllers/messageController.js";
import isauthenticated from "../middleware/isAuthenticated.js";

const router = express.Router();

router.route("/send/:id").post(isauthenticated, sendMessage);
// IMPORTANT: /read/:senderId must be declared BEFORE /:id to avoid route conflict
router.route("/read/:senderId").put(isauthenticated, markAsRead);
router.route("/edit/:msgId").put(isauthenticated, editMessage);
router.route("/delete/:msgId").delete(isauthenticated, deleteMessage);
router.route("/react/:msgId").post(isauthenticated, reactMessage);
router.route("/:id").get(isauthenticated, getMessage);

export default router;