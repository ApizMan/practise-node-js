import { Router } from "express";
import authMiddleware from "../middlewares/auth";
import adminMiddleware from "../middlewares/admin";
import { errorHandler } from "../error-handler";
import { addAddress, changeUserRole, deleteAddress, getUserById, listAddress, listUsers, updateUser } from "../controllers/users";

const userRoutes: Router = Router();

userRoutes.post('/createAddress', [authMiddleware], errorHandler(addAddress));
userRoutes.delete('/address/:id', [authMiddleware], errorHandler(deleteAddress));
userRoutes.get('/listAddress', [authMiddleware], errorHandler(listAddress));
userRoutes.put('/updateUser', [authMiddleware], errorHandler(updateUser));
userRoutes.get('/getListUser', [authMiddleware, adminMiddleware], errorHandler(listUsers))
userRoutes.get('/:id/getUser', [authMiddleware, adminMiddleware], errorHandler(getUserById))
userRoutes.put('/changeRole', [authMiddleware, adminMiddleware], errorHandler(changeUserRole))

export default userRoutes
