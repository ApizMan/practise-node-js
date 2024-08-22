import { Router } from "express";
import authMiddleware from "../middlewares/auth";
import adminMiddleware from "../middlewares/admin";
import { errorHandler } from "../error-handler";
import { addAddress, deleteAddress, listAddress, updateUser } from "../controllers/users";

const userRoutes: Router = Router();

userRoutes.post('/createAddress', [authMiddleware], errorHandler(addAddress));
userRoutes.delete('/address/:id', [authMiddleware], errorHandler(deleteAddress));
userRoutes.get('/listAddress', [authMiddleware], errorHandler(listAddress));
userRoutes.put('/updateUser', [authMiddleware], errorHandler(updateUser));

export default userRoutes
