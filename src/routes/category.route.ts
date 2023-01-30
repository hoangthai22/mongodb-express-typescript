import { Router } from 'express';
import { createCategory, deleteCategory, getAllCategories, getCategory, updateCategory } from '../controllers/category.controller';

const categoryRoute = () => {
    const router = Router();

    router.post('/category', createCategory);

    router.get('/categories', getAllCategories);

    router.get('/category/:id', getCategory);

    router.put('/category/:id', updateCategory);

    router.delete('/category/:id', deleteCategory);

    return router;
};

export { categoryRoute };