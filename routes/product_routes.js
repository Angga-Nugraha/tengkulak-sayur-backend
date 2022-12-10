import express from "express";
import {
    getProducts,
    getProductById,
    saveProduct,
    updateProduct,
    deleteProduct,
    searchProduct,
    getProductByCategory
} from "../controllers/product.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get('/product', verifyToken, getProducts);
router.get('/product/:id', verifyToken, getProductById);
router.get('/product/category/:category', verifyToken, getProductByCategory);
router.post('/product', verifyToken, saveProduct);
router.patch('/product/:id', verifyToken, updateProduct);
router.delete('/product/:id', verifyToken, deleteProduct);
router.get('/search/product', verifyToken, searchProduct);

export default router;