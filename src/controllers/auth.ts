import { NextFunction, Request, Response } from "express"
import { primaClient } from "..";
import { hashSync, compareSync } from "bcrypt";
import * as jwt from 'jsonwebtoken';
import { JWT_SECRET } from "../secrets";
import { BadRequestsException } from "../exceptions/bad-requests";
import { ErrorCode } from "../exceptions/root";
import { UnprocessableEntity } from "../exceptions/validation";
import { SignUpSchema } from "../schema/users";


export const signUp = async (req: Request, res: Response, next: NextFunction) => {
    try {
        SignUpSchema.parse(req.body)
        const { email, password, name } = req.body;

        let user = await primaClient.user.findFirst({ where: { email } })

        if (user) {
            next(new BadRequestsException('User Already Exist', ErrorCode.USER_ALREADY_EXIST))
        }

        user = await primaClient.user.create({
            data: {
                name,
                email,
                password: hashSync(password, 10),
            }
        })

        res.json(user)
    } catch (error: any) {
        next(new UnprocessableEntity(error?.issues, 'Unprocessable Entity', ErrorCode.UNPROCESSABLE_ENTITY))
    }

}


export const login = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    let user = await primaClient.user.findFirst({ where: { email } })

    if (!user) {
        next(new BadRequestsException('User Not Found', ErrorCode.USER_NOT_FOUND))
    }

    if (!compareSync(password, user!.password)) {
        next(new BadRequestsException('Incorrect Password', ErrorCode.INCORRECT_PASSWORD))
    }

    const token = jwt.sign({
        userId: user!.id,
    }, JWT_SECRET)

    res.json({ user, token })
}