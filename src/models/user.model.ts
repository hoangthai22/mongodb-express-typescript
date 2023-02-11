import mongoose, { Document, Schema } from 'mongoose';

export interface IUser {

    name: string;
    userName: string,
    password: string,
    refreshTokenUser: [String]

}
export interface IUserModel extends IUser, Document { }
const UserSchema: Schema = new Schema(
    {

        name: { type: String, required: true },
        userName: { type: String, required: true },
        password: { type: String, required: true },
        refreshTokenUser: { type: [String], required: false },
    },
    {
        versionKey: false,
        timestamps: true,
    }
);

export default mongoose.model<IUserModel>('User', UserSchema);