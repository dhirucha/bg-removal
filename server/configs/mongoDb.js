import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectDb = async () => {

    mongoose.connection.on('connected', () => {
        console.log('Database connected')
    })

    await mongoose.connect(`${process.env.MONGODB_URI}bg-removal`)
}

export default connectDb;