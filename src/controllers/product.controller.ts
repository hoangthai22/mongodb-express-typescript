import { Request, Response } from 'express';
import mongoose from 'mongoose';
import * as admin from 'firebase-admin';
import productModel from '../models/product.model';

const getAllProducts = async (req: Request, res: Response,) => {
    let limit = 10;
    let page = 1;
    if (req.query.limit) {
        limit = parseInt(req.query.limit.toString());
    }
    if (req.query.page) {
        page = parseInt(req.query.page.toString());
    }
    const skip = (page - 1) * limit;
    const total = await productModel.countDocuments();

    return productModel.find({})
        .populate({ path: 'category', select: ['-createdAt', '-updatedAt', '-status'] })
        .sort({ createdAt: -1 })
        .select(['-createdAt', '-updatedAt'])
        .skip(skip)
        .limit(limit)
        .exec()
        .then((products) => res.status(200).json({
            products, total: Math.ceil(total / limit),
            limit,
            page
        }))
        .catch((error) => res.status(500).json({ error }));
};

const createProduct = async (req: Request, res: Response) => {
    const bucket = admin.storage().bucket("shoe-express-types.appspot.com");
    const { name, categoryId, quantity, price } = req.body;
    const file = req.file;
    if (!file) {
        return res.status(400).send('No file uploaded.');
    }
    const gcsFileName = `images/${Date.now()}-${file.originalname}`;
    const fileUpload = bucket.file(gcsFileName);
    const stream = fileUpload.createWriteStream({
        public: true,
        metadata: {
            contentType: file.mimetype,
        },
    });
    stream.on('error', (err: any) => {
        return res.status(500).send(err);
    });
    let imageUrl = "";
    stream.on('finish', async () => {
        // ...
        imageUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(gcsFileName)}?alt=media`;
        console.log(imageUrl);
        const product = new productModel({
            _id: new mongoose.Types.ObjectId(),
            name, category: categoryId, quantity, price, image: imageUrl, status: true
        });
        return product
            .save()
            .then((productSave) => {
                console.log(productSave);
                productModel.findById(productSave._id).populate({ path: 'category', select: ['-createdAt', '-updatedAt', '-status'] }).select(['-createdAt', '-updatedAt'])
                    .then((product) => {
                        return res.status(201).json({ product })
                    })
                    .catch((error) => res.status(500).json({ error }));
            })
            .catch((error) => res.status(500).json({ error }));
    });

    stream.end(file.buffer);
    return;
};

const deleteProduct = async (req: Request, res: Response,) => {
    const productId = req.params.id;
    return productModel.findByIdAndDelete(productId)
        .then((product) => (product ? res.status(201).json({ product, message: 'Deleted' }) : res.status(404).json({ message: 'not found' })))
        .catch((error) => res.status(500).json({ error }));

}
const updateProduct = async (req: Request, res: Response) => {
    const bucket = admin.storage().bucket("shoe-express-types.appspot.com");
    const productId = req.params.id;
    const file = req.file;
    const { name, categoryId, quantity, price } = req.body;
    if (!file) {
        const prod = new productModel({
            _id: productId,
            name, category: categoryId, quantity, price,
        });
        return productModel.findById(productId)
            .then((product) => {
                if (product) {
                    product.set(prod);
                    return product
                        .save()
                        .then((product) => res.status(201).json({ product }))
                        .catch((error) => res.status(500).json({ error }));
                } else {
                    return res.status(404).json({ message: 'not found' });
                }
            })
            .catch((error) => res.status(500).json({ error }));
    } else {
        const gcsFileName = `images/${Date.now()}-${file.originalname}`;
        const fileUpload = bucket.file(gcsFileName);
        const stream = fileUpload.createWriteStream({
            public: true,
            metadata: {
                contentType: file.mimetype,
            },
        });
        stream.on('error', (err: any) => {
            return res.status(500).send(err);
        });
        let imageUrl = "";
        stream.on('finish', async () => {
            // ...
            imageUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(gcsFileName)}?alt=media`;
            const prod = new productModel({
                _id: productId,
                name, category: categoryId, quantity, price, image: imageUrl, status: true
            });
            return productModel.findById(productId)
                .then((product) => {
                    if (product) {
                        product.set(prod);
                        return product
                            .save()
                            .then((product) => res.status(201).json({ product }))
                            .catch((error) => res.status(500).json({ error }));
                    } else {
                        return res.status(404).json({ message: 'not found' });
                    }
                })
                .catch((error) => res.status(500).json({ error }));
        });

        stream.end(file.buffer);
    }
    return
};
const getProduct = async (req: Request, res: Response) => {
    const productId = req.params.id;

    return productModel.findById(productId).populate({ path: 'category', select: ['-createdAt', '-updatedAt', '-status'] }).select(['-createdAt', '-updatedAt'])
        .then((product) => (product ? res.status(200).json({ product }) : res.status(404).json({ message: 'not found' })))
        .catch((error) => res.status(500).json({ error }));
};
export { getAllProducts, createProduct, deleteProduct, getProduct, updateProduct };
