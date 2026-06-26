import express from "express";
import {
    register,
    login,
    profile,
    updateProfile,
    updatePassword
} from "../controllers/auth.controller.js";

import authMiddleware from "../middleware/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.get(
    "/profile",
    authMiddleware,
    profile
);

router.patch(
    "/profile",
    authMiddleware,
    updateProfile
);

router.patch(
    "/profile/password",
    authMiddleware,
    updatePassword
);

export default router;
