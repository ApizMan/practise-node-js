import { Request, Response } from "express";
import { AddressSchema } from "../schema/users";
import { prismaClient } from "..";
import { NotFoundException } from "../exceptions/not-found";
import { ErrorCode } from "../exceptions/root";

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
