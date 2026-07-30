import express from "express";
import { sendMessage } from "../controllers/messageController.js";
import isauthenticated from "../middleware/isAuthenticated.js";
import { getMessage } from "../controllers/messageController.js";


const router = express.Router();

router.route("/send/:id").post(isauthenticated, sendMessage);
router.route("/:id").get(isauthenticated, getMessage);


export default router;