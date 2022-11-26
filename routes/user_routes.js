import express from "express";
import {
    getUser,
    getUserById,
    updateUser,
    deleteUser,
    register
} from "../controllers/users.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { verifyUser } from "../middleware/authUser.js";

const router = express.Router();

router.get('/users', verifyToken, getUser);
router.get('/users/:id', verifyUser, getUserById);
router.patch('/users/:id', verifyUser, updateUser);
router.delete('/users/:id', verifyUser, deleteUser);
router.post('/users', register);

export default router;