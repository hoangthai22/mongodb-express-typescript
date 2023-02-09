import express from 'express';
import dotenv from 'dotenv';
// import formidableMiddleware from 'express-formidable';
import * as admin from 'firebase-admin';
import firebaseAccountCredentials from "./shoe-express-types-firebase-adminsdk-m1mk3-8d14c75371.json";
import cors from 'cors';
import { connectToDatabase } from './databaseConnection';
import { productRoute } from './routes/product.route';
import { categoryRoute } from './routes/category.route';
dotenv.config();
const HOST = process.env.HOST || 'http://localhost';
const PORT = parseInt(process.env.PORT || '4500');

const serviceAccount = firebaseAccountCredentials as admin.ServiceAccount

const app = express();
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),

});

// app.use(formidableMiddleware());
app.use(cors({ origin: '*' }))
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/', productRoute());
app.use('/', categoryRoute());
app.get('/', (_req, res) => {
    return res.json({ message: 'Hello World!' });
});

app.listen(PORT, async () => {
    await connectToDatabase();

    console.log(`Application started on URL ${HOST}:${PORT} 🎉`);
});