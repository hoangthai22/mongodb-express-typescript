import { Request, Response, NextFunction } from 'express';
import config from '../configs/config';
import jwt from "jsonwebtoken";
import userModel, { IUser } from '../models/user.model';

interface RequestWithUser extends Request {
    user?: IUser;
    newToken?: string,
    id?: string
}

const verifyToken = (req: RequestWithUser, res: Response, next: NextFunction) => {
    let token = req.headers["x-access-token"];
    if (!token) {
        return res.status(401).send({ message: "invalid_token" });
    }
    let jwtPayload;
    try {
        jwtPayload = <any>jwt.verify(token.toString(), config.jwtSecret);
        res.locals.jwtRefreshPayload = jwtPayload;
        req.id = jwtPayload.id
        next();
    } catch (error) {
        res.status(401).send({ message: "access_token_expired" });
        return;
    }

    return
};

const verifyRefreshToken = (req: RequestWithUser, res: Response, next: NextFunction) => {
    let { refreshToken } = req.body;
    if (!refreshToken) {
        res.status(401).send({ message: "invalid_refreshtoken" });
        return;
    }
    let jwtPayload;
    try {
        jwtPayload = <any>jwt.verify(refreshToken.toString(), config.jwtRefreshSecret);
        res.locals.jwtRefreshPayload = jwtPayload;
    } catch (error) {
        res.status(401).send({ message: "expired_refreshtoken" });
        return;
    }
    const newToken = jwt.sign({ id: jwtPayload.id }, config.jwtSecret, {
        expiresIn: 30
    });
    req.newToken = newToken;
    next();
};


const isAuth = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    let refreshToken = req.headers["x-refresh-token"];
    if (!refreshToken) {
        res.status(401).send("Refresh token not found!");
        return;
    }
    let jwtPayload;
    try {
        jwtPayload = <any>jwt.verify(refreshToken.toString(), config.jwtRefreshSecret);
        res.locals.jwtRefreshPayload = jwtPayload;
        const user = await userModel.findOne({ _id: jwtPayload.id }).exec();
        if (!user) {
            return res.status(404).send({ message: "User Not found." });
        }

        req.user = user;
        req.id = user._id
        next();
    } catch (error) {
        res.status(401).send("Wrong refresh token!");
        return;
    }
    return

};


export { verifyToken, verifyRefreshToken, isAuth, };