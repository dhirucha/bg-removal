import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import connectDb from './configs/mongoDb.js';
import userRouter from './routes/userRoutes.js';



//app config
const port = process.env.PORT || 3000;
const app = express();
await connectDb();

//middleware
app.use(express.json());
app.use(cors());

//api routes
app.get('/', (req, res) => res.status(200).send('Api working'));
app.use('/api/user', userRouter);

app.listen(port, () => console.log(`Server running on port ${port}`));