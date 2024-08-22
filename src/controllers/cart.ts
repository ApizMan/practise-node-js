import { Request, Response } from "express";
import { changeQuantitySchema, CreateCartSchema } from "../schema/cart";
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

    // Check if the user is deleting item own cart
    let item = await prismaClient.cartItem.findFirst({
        where: {
            id: +req.params.id
        }
    })

    // Check if the item is existing in database
    if (!item) {
        throw new NotFoundException('Item Not Found.', ErrorCode.ITEM_NOT_FOUND)
    }

    // Check if the user is deleting item own cart
    if (item!.userId !== req.user.id) {
        throw new NotFoundException('Item Not Belong To User.', ErrorCode.ITEM_NOT_BELONG_TO_USER)
    }

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

export const changeQuantity = async (req: Request, res: Response) => {

    const validateData = changeQuantitySchema.parse(req.body)

    let item = await prismaClient.cartItem.findFirst({
        where: {
            id: +req.params.id,
        }
    })

    // Check if the item is existing in database
    if (!item) {
        throw new NotFoundException('Item Not Found.', ErrorCode.ITEM_NOT_FOUND)
    }

    // Check if the user is deleting item own cart
    if (item.userId !== req.user.id) {
        throw new NotFoundException('Item Not Belong To User.', ErrorCode.ITEM_NOT_BELONG_TO_USER)
    }

    const updatedCart = await prismaClient.cartItem.update({
        where: {
            id: +req.params.id
        },
        data: {
            quantity: validateData.quantity
        }
    })

    res.json({
        success: true,
        message: "Item in the cart updated successfully",
        data: updatedCart
    })
}

export const getCart = async (req: Request, res: Response) => {

    const count = await prismaClient.cartItem.count({
        where: {
            userId: req.user.id
        }
    })

    const cart = await prismaClient.cartItem.findMany({
        skip: +req.query.skip! || 0,
        take: 5,
        where: {
            userId: req.user.id,
        },
        include: {
            product: true,
        }
    })

    res.json({
        success: true,
        message: "Cart items retrieved successfully",
        count: count,
        data: cart,
    })
}