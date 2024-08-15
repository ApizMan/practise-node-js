import { Router } from "express";
import { login, signUp } from "../controllers/auth";
import { errorHandler } from "../error-handler";

const authRoute: Router = Router()

authRoute.post('/signup', errorHandler(signUp))
authRoute.post('/login', errorHandler(login))

export default authRoute;