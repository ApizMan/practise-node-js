import { Request, Response } from "express"
import { primaClient } from "..";
import { hashSync } from "bcrypt";


export const signUp = async (req:Request, res:Response) => {
    const {email, password, name} = req.body;

    let user = await primaClient.user.findFirst({where: {email}});

    if (user) {
        throw Error('User already exist');
    }

    user = await primaClient.user.create({
        data: {
            name,
            email,
            password: hashSync(password, 10),
        }
    });

    res.json(user);
}