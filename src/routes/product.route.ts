import { Router } from 'express';
import { createProduct, deleteProduct, getAllProducts, getProduct, updateProduct } from '../controllers/product.controller';
import multer from 'multer';
import { verifyToken } from '../middlewares/authJwt';

const productRoute = () => {
  const router = Router();
  const storage = multer.memoryStorage();
  const upload = multer({ storage });
  router.post('/product', upload.single('image'), createProduct);

  router.get('/products', verifyToken, getAllProducts);

  router.get('/product/:id', verifyToken, getProduct);

  router.put('/product/:id', upload.single('image'), updateProduct);

  router.delete('/product/:id', verifyToken, deleteProduct);

  return router;
};

export { productRoute };