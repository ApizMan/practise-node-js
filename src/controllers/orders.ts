import { Request, Response } from "express";
import { prismaClient } from "..";
import { NotFoundException } from "../exceptions/not-found";
import { ErrorCode } from "../exceptions/root";

export const createOrder = async (req: Request, res: Response) => {

    // 1. to create a transaction
    // 2. to list all the cart items and proceed if cart is not empty
    // 3. calculate the total amount
    // 4. fetch address of user
    // 5. to define computed field for formatted address on address module
    // 6. will create a order and order productOrder products
    // 7. create event
    // 8. to Empty the cart

    return await prismaClient.$transaction(async (tx) => {
        const cartItems = await tx.cartItem.findMany({
            where: {
                userId: req.user.id
            },
            include: {
                product: true,
            }
        })

        if (cartItems.length == 0) {
            return res.json({
                success: true,
                message: "Cart is empty"
            })
        }

        const price = cartItems.reduce((prev, curr) => {
            return prev + (curr.quantity * +curr.product.price)
        }, 0);

        const address = await tx.address.findFirst({
            where: {
                id: req.user.defaultShippingAddress!
            }
        })

        const order = await tx.order.create({
            data: {
                userId: req.user.id,
                netAmount: price,
                address: address!.formattedAddress,
                orderProduct: {
                    create: cartItems.map((cart) => {
                        return {
                            productId: cart.productId,
                            quantity: cart.quantity
                        }
                    })
                },

            }
        })

        await tx.orderEvent.create({
            data: {
                orderId: order.id,
            }
        })

        await tx.cartItem.deleteMany({
            where: {
                userId: req.user.id,
            }
        })

        res.json({
            success: true,
            message: "Order created successfully",
            data: order,
        })
    })
}

export const listOrder = async (req: Request, res: Response) => {

    const count = await prismaClient.order.count({
        where: {
            userId: req.user.id
        }
    })
    const orders = await prismaClient.order.findMany({
        skip: +req.query.skip! || 0,
        take: 5,
        where: {
            userId: req.user.id
        }
    })

    res.json({
        success: true,
        message: "Orders listed successfully",
        count: count,
        data: orders,
    })

}

export const cancelOrder = async (req: Request, res: Response) => {

    // 1. wrap inside transaction ✅
    // 2. check if the users is cancel it's own order

    return await prismaClient.$transaction(async (tx) => {

        // Check if the user is deleting item own cart
        let order = await tx.order.findFirst({
            where: {
                id: +req.params.id
            }
        })

        // Check if the item is existing in database
        if (!order) {
            throw new NotFoundException('Item Not Found.', ErrorCode.ITEM_NOT_FOUND)
        }

        // Check if the user is deleting item own cart
        if (order!.userId !== req.user.id) {
            throw new NotFoundException('Item Not Belong To User.', ErrorCode.ITEM_NOT_BELONG_TO_USER)
        }

        try {
            const order = await tx.order.update({
                where: {
                    id: +req.params.id
                },
                data: {
                    status: 'CANCELLED'
                }
            })

            await tx.orderEvent.create({
                data: {
                    orderId: order.id,
                    status: 'CANCELLED',
                }
            })

            res.json({
                success: true,
                message: "Order Display successfully",
                data: order,
            })
        } catch (error) {
            throw new NotFoundException('Order Not Found.', ErrorCode.ORDER_NOT_FOUND)
        }
    })
}

export const getOrderById = async (req: Request, res: Response) => {

    try {
        const order = await prismaClient.order.findFirstOrThrow({
            where: {
                id: +req.params.id
            },
            include: {
                orderProduct: true,
                orderEvent: true,
            }
        })

        res.json({
            success: true,
            message: "Order Display successfully",
            data: order,
        })
    } catch (error) {
        throw new NotFoundException('Order Not Found.', ErrorCode.ORDER_NOT_FOUND)
    }

}