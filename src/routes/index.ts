import { Router } from "express";
import authRoute from "./auth";
import productsRouters from "./products";
import userRoutes from "./users";

const rootRouter: Router = Router()

rootRouter.use('/auth', authRoute)
rootRouter.use('/products', productsRouters)
rootRouter.use('/users', userRoutes)

export default rootRouter;