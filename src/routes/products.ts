import { Router } from "express";
import { errorHandler } from "../error-handler";
import { createProduct } from "../controllers/products";
import authMiddleware from "../middlewares/auth";
import adminMiddleware from "../middlewares/admin";

const productsRouters: Router = Router();

productsRouters.post('/createProduct', [authMiddleware, adminMiddleware], errorHandler(createProduct))

export default productsRouters
