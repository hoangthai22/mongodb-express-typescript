import { Request, Response } from 'express';
import mongoose from 'mongoose';
import categoryModel from '../models/category.model';

const getAllCategories = async (_req: Request, res: Response,) => {
    return categoryModel.find()
        .then((categories) => res.status(200).json({ categories }))
        .catch((error) => res.status(500).json({ error }));
};

const createCategory = async (req: Request, res: Response,) => {
    const { name } = req.body;

    const category = new categoryModel({
        _id: new mongoose.Types.ObjectId(),
        name, status: true
    });
    return category
        .save()
        .then((category) => res.status(201).json({ category }))
        .catch((error) => res.status(500).json({ error }));
};

const deleteCategory = async (req: Request, res: Response,) => {
    const categoryId = req.params.id;
    return categoryModel.findByIdAndDelete(categoryId)
        .then((category) => (category ? res.status(201).json({ category, message: 'Deleted' }) : res.status(404).json({ message: 'not found' })))
        .catch((error) => res.status(500).json({ error }));

}
const updateCategory = (req: Request, res: Response) => {
    const categoryId = req.params.id;

    return categoryModel.findById(categoryId)
        .then((category) => {
            if (category) {
                category.set(req.body);
                return category
                    .save()
                    .then((category) => res.status(201).json({ category }))
                    .catch((error) => res.status(500).json({ error }));
            } else {
                return res.status(404).json({ message: 'not found' });
            }
        })
        .catch((error) => res.status(500).json({ error }));
};
const getCategory = (req: Request, res: Response) => {
    const categoryId = req.params.id;

    return categoryModel.findById(categoryId)
        .then((category) => (category ? res.status(200).json({ category }) : res.status(404).json({ message: 'not found' })))
        .catch((error) => res.status(500).json({ error }));
};
export { getAllCategories, createCategory, deleteCategory, getCategory, updateCategory };
