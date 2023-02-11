import { Router } from 'express';
import { verifyToken } from "../middlewares/authJwt";
import { createCategory, deleteCategory, getAllCategories, getCategory, updateCategory } from '../controllers/category.controller';
import multer from 'multer';
const categoryRoute = () => {
    const storage = multer.memoryStorage();
    const upload = multer({ storage });
    const router = Router();

    router.post('/category', upload.single('image'), createCategory);

    router.get('/categories', verifyToken, getAllCategories);

    router.get('/category/:id', getCategory);

    router.put('/category/:id', upload.single('image'), updateCategory);

    router.delete('/category/:id', deleteCategory);

    return router;
};

export { categoryRoute };