import express from "express";
import { Auth } from "../middleware/userAuth.js";
import {
  SignUp,
  Login,
  VerifyEmail,
  ResendEmailOtp,
  ResendPasswordOtp,
  CheckResetPasswordOtp,
  ResetPassword,
  getUserProfile,
  addLocation,
  checkIfSlugisAvailable,
  CompleteProfile,
} from "../controllers/user.Controllers.js";
import { appleAuth, facebookAuth, googleAuth } from "../controllers/SocialAuthControllers.js";
const router = express.Router();
router.post("/signup", SignUp);
router.post("/login", Login);
router.post("/verifyEmail", Auth, VerifyEmail);
router.post("/sendEmailOtp", Auth, ResendEmailOtp);
router.post("/sendPasswordResetOtp", ResendPasswordOtp);
router.post("/sendPasswordResetOtp", CheckResetPasswordOtp);
router.post("/resetPassword", ResetPassword);
router.get("/", Auth, getUserProfile);
router.post("/location", Auth, addLocation);
router.post("/slugExist", checkIfSlugisAvailable);
router.post("/updateProfile", Auth, CompleteProfile);
// Social login
router.post("/google", googleAuth);
router.post("/facebook", facebookAuth);
router.post("/apple", appleAuth);
export default router;
