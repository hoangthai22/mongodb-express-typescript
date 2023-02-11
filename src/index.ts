import express from 'express';
import dotenv from 'dotenv';
// import formidableMiddleware from 'express-formidable';
import * as admin from 'firebase-admin';
// import firebaseAccountCredentials from "./shoe-express-types-firebase-adminsdk-m1mk3-8d14c75371.json";
import cors from 'cors';
import { connectToDatabase } from './databaseConnection';
import { productRoute } from './routes/product.route';
import { categoryRoute } from './routes/category.route';
import { authRoute } from './routes/auth.routes';
dotenv.config();
const HOST = process.env.HOST || 'http://localhost';
const PORT = parseInt(process.env.PORT || '4500');

// const serviceAccount = firebaseAccountCredentials as admin.ServiceAccount
const privateKey = JSON.parse(`{
    "type": "service_account",
    "project_id": "shoe-express-types",
    "private_key_id": "${process.env.PRIVATE_KEY_ID}",
    "private_key": "${process.env.PRIVATE_KEY}",
    "client_email": "firebase-adminsdk-m1mk3@shoe-express-types.iam.gserviceaccount.com",
    "client_id": "110971450323003708220",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-m1mk3%40shoe-express-types.iam.gserviceaccount.com"
  }`);
const app = express();
admin.initializeApp({
    credential: admin.credential.cert(privateKey),

});

// app.use(formidableMiddleware());
app.use(cors({ origin: '*' }))
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/', productRoute());
app.use('/', categoryRoute());
app.use('/', authRoute());
app.get('/', (_req, res) => {
    return res.json({ message: 'Hello World!' });
});

app.listen(PORT, async () => {
    await connectToDatabase();

    console.log(`Application started on URL ${HOST}:${PORT} 🎉`);
});