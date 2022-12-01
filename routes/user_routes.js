import express from "express";
import {
    getUser,
    getUserById,
    updateUser,
    deleteUser,
} from "../controllers/users.js";
import { verifyToken } from "../middleware/verifyToken.js";
// import { verifyUser } from "../middleware/authUser.js";

const router = express.Router();

router.get('/users', verifyToken, getUser);
router.get('/users/:id', getUserById);
router.patch('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);


export default router;