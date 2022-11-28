import express from "express";
import {
    getProducts,
    getProductById,
    saveProduct,
    updateProduct,
    deleteProduct,
    searchProduct
} from "../controllers/product.js";
import { verifyUser } from "../middleware/authUser.js";

const router = express.Router();

router.get('/product', getProducts);
router.get('/product/:id', verifyUser, getProductById);
router.post('/product', verifyUser, saveProduct);
router.patch('/product/:id', verifyUser, updateProduct);
router.delete('/product/:id', verifyUser, deleteProduct);
router.get('/search/product', searchProduct);

export default router;