import { NextFunction, Request, Response } from 'express';

import userModel, { IUser } from '../models/user.model';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import config from '../configs/config';

interface RequestWithUser extends Request {
    user?: IUser;
    newToken?: string,
    id?: string
}
const login = async (req: Request, res: Response) => {
    const { body: { userName, password } } = req;
    console.log(req.body);

    try {
        const user = await userModel.findOne({ userName }).exec();
        if (!user) {
            return res.status(404).send({ message: "User Not found." });
        }
        const passwordIsValid = bcrypt.compareSync(password, user.password);
        if (!passwordIsValid) {
            return res.status(401).send({
                accessToken: null,
                message: "Invalid Password!"
            });
        }
        const token = jwt.sign({ id: user._id }, config.jwtSecret, {
            expiresIn: 30
        });
        const refreshToken = jwt.sign({ id: user._id }, config.jwtRefreshSecret, {
            expiresIn: "30d"
        });
        user.set({ ...user, refreshTokenUser: [...user.refreshTokenUser, refreshToken] });
        console.log({ user });

        await user.save();
        return res.status(200).send({
            _id: user._id,
            userName: user.userName,
            name: user.name,
            accessToken: token,
            refreshToken: refreshToken
        });
    } catch (err) {
        return res.status(500).send({ message: err });
    }
};
const register = async (req: Request, res: Response) => {
    const { body: { userName, name, password } } = req;
    const hashedPassword = bcrypt.hashSync(password, 8);
    const user = new userModel({
        userName,
        name,
        password: hashedPassword
    });

    return user
        .save()
        .then((user) => res.status(201).json({ user }))
        .catch((error) => res.status(500).json({ error }));
};

const refreshTokenHanlde = (req: RequestWithUser, res: Response,) => {
    let { refreshToken } = req.body;
    let newToken = req.newToken;

    try {
        return res.status(200).send({
            newAccessToken: newToken,
            refreshToken: refreshToken
        });
    } catch (error) {
        res.status(401).send({ message: "expired_refreshtoken" });
        return;
    }
};
const logout = async (req: RequestWithUser, res: Response,) => {
    let refreshToken = req.headers["x-refresh-token"];
    let user = req.user;
    let id = req.id;
    if (!user) {
        return res.status(404).send({ message: "User Not found." });
    }
    const newRefreshTokens = user.refreshTokenUser.filter((t) => t !== refreshToken)
    await userModel.findByIdAndUpdate(id, { refreshTokenUser: newRefreshTokens })
    return res.status(200).send({
        message: "Logout successfully!"
    });
};
const checkLogin = async (req: RequestWithUser, res: Response,) => {
    let id = req.id;
    const user = await userModel.findOne({ _id: id }).exec();
    if (!user) {
        return res.status(404).send({ message: "User Not found." });
    }
    return res.status(200).send({
        _id: user._id,
        userName: user.userName,
        name: user.name,
    });
};
export { login, register, refreshTokenHanlde, logout, checkLogin };