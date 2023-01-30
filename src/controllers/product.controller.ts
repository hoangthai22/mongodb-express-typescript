import { Request, Response } from 'express';
import mongoose from 'mongoose';
import productModel from '../models/product.model';
const getAllProducts = async (_req: Request, res: Response,) => {
    return productModel.find({}).populate({ path: 'category', select: ['-createdAt', '-updatedAt', '-status'] }).sort({ createdAt: -1 }).select(['-createdAt', '-updatedAt'])
        .then((products) => res.status(200).json({ products }))
        .catch((error) => res.status(500).json({ error }));
};

const createProduct = async (req: Request, res: Response,) => {
    const { name, category, quantity, price, image } = req.body;

    const product = new productModel({
        _id: new mongoose.Types.ObjectId(),
        name, category, quantity, price, image, status: true
    });
    return product
        .save()
        .then((product) => res.status(201).json({ product }))
        .catch((error) => res.status(500).json({ error }));
};

const deleteProduct = async (req: Request, res: Response,) => {
    const productId = req.params.id;
    return productModel.findByIdAndDelete(productId)
        .then((product) => (product ? res.status(201).json({ product, message: 'Deleted' }) : res.status(404).json({ message: 'not found' })))
        .catch((error) => res.status(500).json({ error }));

}
const updateProduct = (req: Request, res: Response) => {
    const productId = req.params.id;

    return productModel.findById(productId)
        .then((product) => {
            if (product) {
                product.set(req.body);
                return product
                    .save()
                    .then((product) => res.status(201).json({ product }))
                    .catch((error) => res.status(500).json({ error }));
            } else {
                return res.status(404).json({ message: 'not found' });
            }
        })
        .catch((error) => res.status(500).json({ error }));
};
const getProduct = (req: Request, res: Response) => {
    const productId = req.params.id;

    return productModel.findById(productId).populate({ path: 'category', select: ['-createdAt', '-updatedAt', '-status'] }).select(['-createdAt', '-updatedAt'])
        .then((product) => (product ? res.status(200).json({ product }) : res.status(404).json({ message: 'not found' })))
        .catch((error) => res.status(500).json({ error }));
};
export { getAllProducts, createProduct, deleteProduct, getProduct, updateProduct };
