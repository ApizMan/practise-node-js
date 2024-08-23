import { Router } from "express";
import authMiddleware from "../middlewares/auth";
import { errorHandler } from "../error-handler";
import { cancelOrder, createOrder, getOrderById, listOrder } from "../controllers/orders";

const ordersRouters: Router = Router();

ordersRouters.post('/createOrder', [authMiddleware], errorHandler(createOrder))
ordersRouters.get('/getListOrder', [authMiddleware], errorHandler(listOrder))
ordersRouters.get('/:id/cancelOrder', [authMiddleware], errorHandler(cancelOrder))
ordersRouters.get('/:id/getOrder', [authMiddleware], errorHandler(getOrderById))

export default ordersRouters