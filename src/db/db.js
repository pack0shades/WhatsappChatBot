import mongoose from "mongoose";
import "dotenv/config";

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(process.env.MONGODB_URI, {
            connectTimeoutMS: 40000, serverSelectionTimeoutMS: 40000
        })
        console.log(`PORT = ${process.env.PORT}`)
        console.log(
            `\nMongoDB connected succesfully at DB host = ${connectionInstance.connection.host}`
        );
    } catch (error) {
        console.log(`\nMongoDB connection failed\n`, error);
        process.exit(1);
    }
};

export default connectDB;
