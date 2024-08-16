import { Router } from "express";
import { login, me, signUp } from "../controllers/auth";
import { errorHandler } from "../error-handler";
import authMiddleware from "../middlewares/auth";

const authRoute: Router = Router()

authRoute.post('/signup', errorHandler(signUp))
authRoute.post('/login', errorHandler(login))
authRoute.get('/me', [authMiddleware], errorHandler(me))

export default authRoute;