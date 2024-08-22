import { Router } from "express";
import authRoute from "./auth";
import productsRouters from "./products";
import userRoutes from "./users";
import cartRouters from "./cart";

const rootRouter: Router = Router()

rootRouter.use('/auth', authRoute)
rootRouter.use('/products', productsRouters)
rootRouter.use('/users', userRoutes)
rootRouter.use('/cart', cartRouters)

export default rootRouter;