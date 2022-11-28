import express from "express";
import {
    me,
    login,
    logout,
    register
} from "../controllers/auth.js";
import { refreshToken } from "../controllers/refreshToken.js";

const router = express.Router();

router.get('/me', me);
router.post('/register', register);
router.post('/login', login);
router.delete('/logout', logout);
router.get('/token', refreshToken);

export default router;