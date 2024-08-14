import { Request, Response } from "express"
import { primaClient } from "..";
import { hashSync, compareSync } from "bcrypt";
import * as jwt from 'jsonwebtoken';
import { JWT_SECRET } from "../secrets";


export const signUp = async (req:Request, res:Response) => {
    const {email, password, name} = req.body;

    let user = await primaClient.user.findFirst({where: {email}})

    if (user) {
        throw Error('User already exist')
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


export const login = async (req:Request, res:Response) => {
    const {email, password} = req.body;

    let user = await primaClient.user.findFirst({where: {email}})

    if (!user) {
        throw Error('User does not exist!')
    }

    if (!compareSync(password, user.password)) {
        throw Error('Incorrect Password')
    }

    const token = jwt.sign({
        userId: user.id,
    }, JWT_SECRET)

    res.json({user, token})
}