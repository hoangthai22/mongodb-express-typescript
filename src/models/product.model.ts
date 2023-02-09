import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct {
    name: string;
    image: string,
    quantity: number,
    price: number,
    status: boolean,
    category: string
}
export interface IProductModel extends IProduct, Document { }
const ProductSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        image: { type: String, required: false },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        status: { type: Boolean, required: false },
        category: { type: Schema.Types.ObjectId, required: true, ref: 'Category' }
    },
    {
        versionKey: false,
        timestamps: true,

    }
);

export default mongoose.model<IProductModel>('Product', ProductSchema);