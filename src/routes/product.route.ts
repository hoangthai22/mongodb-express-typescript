import { Router } from 'express';
import { createProduct, deleteProduct, getAllProducts, getProduct, updateProduct } from '../controllers/product.controller';

const productRoute = () => {
  const router = Router();

  router.post('/product', createProduct);

  router.get('/products', getAllProducts);

  router.get('/product/:id', getProduct);

  router.put('/product/:id', updateProduct);

  router.delete('/product/:id', deleteProduct);

  return router;
};

export { productRoute };