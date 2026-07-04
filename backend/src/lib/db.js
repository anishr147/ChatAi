import mongoose from "mongoose"


export const connectDB = async () => {
    try {

        const { MONGO_URI } = process.env
        if(!MONGO_URI) {
            console.error("MONGO_URI is not defined in environment variables");
            process.exit(1)
        }
        const connectionInstance = await mongoose.connect(process.env.MONGO_URI)
        console.log("MONGODB CONNECTED:", connectionInstance.connection.host);

    }
    catch (error) {
        console.error("ERROR IN  DATABSE CONNECTION");
        process.exit(1) // 1 status code fail  and 0 means success

    }
}