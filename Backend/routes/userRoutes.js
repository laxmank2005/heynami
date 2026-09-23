import express from "express";
import { register, login, logout, getOtherUsers, verifyOTP, resendOTP } from "../controllers/userController.js";
import isauthenticated from "../middleware/isAuthenticated.js";

const router = express.Router();

router.route("/register").post(register);
router.route("/verify-otp").post(verifyOTP);
router.route("/resend-otp").post(resendOTP);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/").get(isauthenticated, getOtherUsers);

export default router;