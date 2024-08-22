import { Router } from "express";
import authMiddleware from "../middlewares/auth";
import adminMiddleware from "../middlewares/admin";
import { errorHandler } from "../error-handler";
import { addAddress, deleteAddress, listAddress } from "../controllers/users";

const userRoutes: Router = Router();

userRoutes.post('/createAddress', [authMiddleware], errorHandler(addAddress));
userRoutes.delete('/address/:id', [authMiddleware], errorHandler(deleteAddress));
userRoutes.get('/listAddress', [authMiddleware], errorHandler(listAddress));

export default userRoutes
