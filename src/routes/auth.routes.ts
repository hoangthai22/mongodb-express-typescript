import { Router } from 'express';
import { isAuth, verifyRefreshToken, verifyToken } from '../middlewares/authJwt';
import { checkLogin, login, logout, refreshTokenHanlde, register } from '../controllers/auth.controller';
import multer from 'multer';
const authRoute = () => {

    const router = Router();
    const upload = multer();

    router.post('/login', upload.array('files', 2), login);
    router.post('/logout', isAuth, logout);
    router.post('/checklogin', verifyToken, checkLogin);
    router.post('/register', register);
    router.post('/refresh-token', verifyRefreshToken, refreshTokenHanlde);

    return router;
};

export { authRoute };