import express from "express";
import {
    getProducts,
    getProductById,
    saveProduct,
    updateProduct,
    deleteProduct
} from "../controllers/product.js";
import { verifyUser } from "../middleware/authUser.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get('/product', verifyToken, getProducts);
router.get('/product/:id', verifyToken, getProductById);
router.post('/product', verifyToken, saveProduct);
router.patch('/product/:id', verifyToken, updateProduct);
router.delete('/product/:id', verifyToken, deleteProduct);

export default router;