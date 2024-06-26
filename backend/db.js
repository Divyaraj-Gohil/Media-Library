import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.uri);
        console.log(`Database successfully connected ${mongoose.connection.host}`);
    } catch (error) {
        console.log(error)
    }
}
export default connectDB