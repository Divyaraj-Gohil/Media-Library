import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: String,
    detail: String,
    image: String,
}, { timestamps: true })
const UserModel = mongoose.model("image", UserSchema)
export default UserModel