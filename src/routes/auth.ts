import { Router } from "express";
import { signUp } from "../controllers/auth";

const authRoute:Router = Router()

authRoute.post('/signup', signUp)

export default authRoute;