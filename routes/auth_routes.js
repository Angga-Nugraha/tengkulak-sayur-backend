import express from "express";
import {
    login,
    logout,
    register
} from "../controllers/auth.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.delete('/logout', verifyToken, logout);


export default router;