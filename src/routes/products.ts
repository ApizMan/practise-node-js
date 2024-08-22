import { Router } from "express";
import { errorHandler } from "../error-handler";
import { createProduct, deleteProduct, getProductById, listProducts, updateProduct } from "../controllers/products";
import authMiddleware from "../middlewares/auth";
import adminMiddleware from "../middlewares/admin";

const productsRouters: Router = Router();

productsRouters.post('/createProduct', [authMiddleware, adminMiddleware], errorHandler(createProduct))
productsRouters.put('/updateProduct/:id', [authMiddleware, adminMiddleware], errorHandler(updateProduct))
productsRouters.delete('/deleteProduct/:id', [authMiddleware, adminMiddleware], errorHandler(deleteProduct))
productsRouters.get('/getAllProduct', [authMiddleware, adminMiddleware], errorHandler(listProducts))
productsRouters.get('/getProduct/:id', [authMiddleware, adminMiddleware], errorHandler(getProductById))

export default productsRouters
