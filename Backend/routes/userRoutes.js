import express from "express";
import { register, login, logout, getConversationUsers, searchUsers, verifyOTP, resendOTP } from "../controllers/userController.js";
import isauthenticated from "../middleware/isAuthenticated.js";

const router = express.Router();

router.route("/register").post(register);
router.route("/verify-otp").post(verifyOTP);
router.route("/resend-otp").post(resendOTP);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/search").get(isauthenticated, searchUsers);
router.route("/").get(isauthenticated, getConversationUsers);

export default router;