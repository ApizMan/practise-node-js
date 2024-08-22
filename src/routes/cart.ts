import { Router } from "express";
import authMiddleware from "../middlewares/auth";
import { errorHandler } from "../error-handler";
import { addItemToCart, changeQuantity, deleteItemFromCart, getCart } from "../controllers/cart";

const cartRouters: Router = Router();

cartRouters.post('/addIntoCart', [authMiddleware], errorHandler(addItemToCart))
cartRouters.get('/getItem', [authMiddleware], errorHandler(getCart))
cartRouters.delete('/delete/:id', [authMiddleware], errorHandler(deleteItemFromCart))
cartRouters.put('/quantity/:id', [authMiddleware], errorHandler(changeQuantity))

export default cartRouters