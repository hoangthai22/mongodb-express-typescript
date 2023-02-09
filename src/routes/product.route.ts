import { Router } from 'express';
import { createProduct, deleteProduct, getAllProducts, getProduct, updateProduct } from '../controllers/product.controller';
import multer from 'multer';

const productRoute = () => {
  const router = Router();
  const storage = multer.memoryStorage();
  const upload = multer({ storage });
  router.post('/product', upload.single('image'), createProduct);

  router.get('/products', getAllProducts);

  router.get('/product/:id', getProduct);

  router.put('/product/:id', upload.single('image'), updateProduct);

  router.delete('/product/:id', deleteProduct);

  return router;
};

export { productRoute };