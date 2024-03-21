import mongoose from "mongoose"

const connectDB = async() =>{
    try {
        const connectionInstance = await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected successfully to host" , connectionInstance.connection.host);
    } catch (error) {
        console.log( "ERROR : " , error);
        process.exit(1);
    }
}

export default connectDB;