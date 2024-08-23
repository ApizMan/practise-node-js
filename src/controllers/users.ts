import { Request, Response } from "express";
import { AddressSchema, UpdateUserSchema } from "../schema/users";
import { prismaClient } from "..";
import { NotFoundException } from "../exceptions/not-found";
import { ErrorCode } from "../exceptions/root";
import { Address } from "@prisma/client";
import { BadRequestsException } from "../exceptions/bad-requests";

export const addAddress = async (req: Request, res: Response) => {

    AddressSchema.parse(req.body)

    const address = await prismaClient.address.create({
        data: {
            ...req.body,
            userId: req.user.id,
        }
    })

    res.json({
        message: 'Address Added Successfully',
        data: address,
    })
}

export const deleteAddress = async (req: Request, res: Response) => {

    try {
        const address = await prismaClient.address.delete({
            where: {
                id: +req.params.id
            }
        })

        res.json({
            success: true,
            message: "Delete Address Successful"
        })
    } catch (error) {
        throw new NotFoundException('Address Not Found', ErrorCode.ADDRESS_NOT_FOUND)
    }

}

export const listAddress = async (req: Request, res: Response) => {

    const addresses = await prismaClient.address.findMany({
        where: {
            userId: req.user.id
        }
    })

    res.json({
        success: true,
        data: addresses
    })
}

export const updateUser = async (req: Request, res: Response) => {

    const validatedData = UpdateUserSchema.parse(req.body)
    let shippingAddress: Address;
    let billingAddress: Address;

    if (validatedData.defaultShippingAddress) {
        try {
            shippingAddress = await prismaClient.address.findFirstOrThrow({
                where: {
                    id: validatedData.defaultShippingAddress,
                }
            })


        } catch (error) {
            throw new NotFoundException('Address Not Found', ErrorCode.ADDRESS_NOT_FOUND)
        }

        if (shippingAddress.userId != req.user.id) {
            throw new BadRequestsException('Address Not Belong To User.', ErrorCode.ADDRESS_NOT_BELONG_TO_USER)
        }
    }

    if (validatedData.defaultBillingAddress) {
        try {
            billingAddress = await prismaClient.address.findFirstOrThrow({
                where: {
                    id: validatedData.defaultBillingAddress,
                }
            })


        } catch (error) {
            throw new NotFoundException('Address Not Found', ErrorCode.ADDRESS_NOT_FOUND)
        }

        if (billingAddress.userId != req.user.id) {
            throw new BadRequestsException('Address Not Belong To User.', ErrorCode.ADDRESS_NOT_BELONG_TO_USER)
        }
    }

    const updateUser = await prismaClient.user.update({
        where: {
            id: req.user.id
        },
        data: {
            name: validatedData.name!,
            defaultShippingAddress: validatedData.defaultShippingAddress,
            defaultBillingAddress: validatedData.defaultBillingAddress,
        }
    })

    res.json({
        success: true,
        message: 'User Updated Successful',
        date: updateUser,
    })
}

export const listUsers = async (req: Request, res: Response) => {

    const users = await prismaClient.user.findMany({
        skip: +req.query.skip! || 0,
        take: 5,
    })

    res.json({
        success: true,
        message: 'Users Retrieved Successful',
        data: users,
    })
}

export const getUserById = async (req: Request, res: Response) => {

}

export const changeUserRole = async (req: Request, res: Response) => {

}
