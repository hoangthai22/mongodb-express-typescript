import mongoose, { Document, Schema } from 'mongoose';

export interface ICategory {
    name: string;
    status: boolean,

}
export interface ICategoryModel extends ICategory, Document { }
const CategorySchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        status: { type: Boolean, required: false },
    },
    {
        versionKey: false,
        timestamps: true,
    }
);

export default mongoose.model<ICategoryModel>('Category', CategorySchema);