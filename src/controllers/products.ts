import { Request, Response } from "express";
import { prismaClient } from "..";
import { NotFoundException } from "../exceptions/not-found";
import { ErrorCode } from "../exceptions/root";
import { count } from "console";

export const createProduct = async (req: Request, res: Response) => {

    const product = await prismaClient.product.create({
        data: {
            ...req.body,
            tags: req.body.tags.join(',')
        }
    })
    res.json(product)
}

export const updateProduct = async (req: Request, res: Response) => {

    try {
        const product = req.body;

        if (product.tags) {
            product.tags = product.tags.join(',')
        }

        const updateProduct = await prismaClient.product.update({
            where: {
                id: +req.params.id
            },
            data: product
        })

        res.json(updateProduct)

    } catch (error) {
        throw new NotFoundException('Product Not Found.', ErrorCode.PRODUCT_NOT_FOUND)
    }

}

export const deleteProduct = async (req: Request, res: Response) => {
    try {
        const deletedProduct = await prismaClient.product.delete({
            where: {
                id: +req.params.id
            },
        })

        res.json({
            message: 'Product deleted successfully',
            product: deletedProduct,
        })

    } catch (error) {
        throw new NotFoundException('Product Not Found.', ErrorCode.PRODUCT_NOT_FOUND)
    }
}


export const listProducts = async (req: Request, res: Response) => {

    // {
    //     count: 100,
    //     data: {

    //     }
    // }

    const count = await prismaClient.product.count()
    const products = await prismaClient.product.findMany({
        skip: +req.query.skip! || 0,
        take: 5
    })

    res.json({
        count: count,
        data: products
    })

}

export const getProductById = async (req: Request, res: Response) => {

    try {
        const product = await prismaClient.product.findFirstOrThrow({
            where: {
                id: +req.params.id
            }
        })

        res.json(product)
        
    } catch (error) {
        throw new NotFoundException('Product Not Found.', ErrorCode.PRODUCT_NOT_FOUND)
    }

}
