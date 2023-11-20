import express from  "express";
import { Router } from "express";
import { isLoggedIn } from "../middlewares/auth.middleware.js";

import {register , login , logout , getProfile, forgotPassword, resetPassword} from "../controllers/user.controller.js"
import upload from "../middlewares/multer.middleware.js";

const router = Router();

router.post("/register",upload.single("avatar"), register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/me",isLoggedIn, getProfile)
router.post("/forgot-password", forgotPassword);
router.post("/reset-password" , resetPassword);

export default router;