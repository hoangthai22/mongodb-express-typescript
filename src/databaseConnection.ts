import mongoose, { ConnectionOptions } from 'mongoose';
import dotenv from 'dotenv';

mongoose.Promise = global.Promise;
dotenv.config();

const connectToDatabase = async (): Promise<void> => {
    const options: ConnectionOptions = { useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true, useUnifiedTopology: true };

    await mongoose.connect(`mongodb+srv://hoangthai22:Hoangthai2200@cluster0.wfjma26.mongodb.net/shoe_db_express?retryWrites=true&w=majority`, options);
};

export { connectToDatabase }; 