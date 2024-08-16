import { NextFunction, Request, Response } from "express"
import { primaClient } from "..";
import { hashSync, compareSync } from "bcrypt";
import * as jwt from 'jsonwebtoken';
import { JWT_SECRET } from "../secrets";
import { BadRequestsException } from "../exceptions/bad-requests";
import { ErrorCode } from "../exceptions/root";
import { UnprocessableEntity } from "../exceptions/validation";
import { SignUpSchema } from "../schema/users";
import { NotFoundException } from "../exceptions/not-found";


export const signUp = async (req: Request, res: Response, next: NextFunction) => {
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
}


export const login = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    let user = await primaClient.user.findFirst({ where: { email } })

    if (!user) {
        throw new NotFoundException('User Not Found', ErrorCode.USER_NOT_FOUND)
    }

    if (!compareSync(password, user.password)) {
        throw new BadRequestsException('Incorrect Password', ErrorCode.INCORRECT_PASSWORD)
    }

    const token = jwt.sign({
        userId: user.id,
    }, JWT_SECRET)

    res.json({ user, token })
}

// me API --> return the logged in user
export const me = async (req: any, res: Response, next: NextFunction) => {
    res.json(req.user)
}