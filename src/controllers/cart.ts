import { Request, Response } from "express";
import { CreateCartSchema } from "../schema/cart";
import { NotFoundException } from "../exceptions/not-found";
import { ErrorCode } from "../exceptions/root";
import { CartItem, Product } from "@prisma/client";
import { prismaClient } from "..";
import { BadRequestsException } from "../exceptions/bad-requests";

export const addItemToCart = async (req: Request, res: Response) => {

    const validateData = CreateCartSchema.parse(req.body)
    let product: Product;

    try {
        product = await prismaClient.product.findFirstOrThrow({
            where: {
                id: validateData.productId
            }
        })
    } catch (error) {
        throw new NotFoundException('Product Not Found.', ErrorCode.PRODUCT_NOT_FOUND)
    }


    const cart = await prismaClient.cartItem.create({
        data: {
            userId: req.user.id,
            productId: product.id,
            quantity: validateData.quantity,
        }
    })

    res.json({
        success: true,
        message: 'Item added to cart successfully.',
        data: cart,
    })
}

export const deleteItemFromCart = async (req: Request, res: Response) => {

    try {
        let item = await prismaClient.cartItem.findFirstOrThrow({
            where: {
                userId: req.user.id,
                id: +req.params.id
            }
        })

        if (item) {
            await prismaClient.cartItem.delete({
                where: {
                    id: +req.params.id
                },
            })

            res.json({
                success: true,
                message: 'Item deleted successfully'
            })
        }

    } catch (error) {
        throw new NotFoundException('Item Not Found.', ErrorCode.ITEM_NOT_FOUND)
    }
}

export const changeQuantity = async (req: Request, res: Response) => {

}

export const getCart = async (req: Request, res: Response) => {

}