import { Router } from "express";
import authRoute from "./auth";
import productsRouters from "./products";

const rootRouter:Router = Router()

rootRouter.use('/auth', authRoute)
rootRouter.use('/products', productsRouters)

export default rootRouter;