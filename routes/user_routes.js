import express from "express";
import {
    getUser,
    getUserById,
    updateUser,
    deleteUser,
} from "../controllers/users.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get('/users', verifyToken, getUser);
router.get('/users/:id', verifyToken, getUserById);
router.patch('/users/:id', verifyToken, updateUser);
router.delete('/users/:id', verifyToken, deleteUser);


export default router;