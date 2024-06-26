import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: String,
    detail: String,
    image: String
})
const UserModel = mongoose.model("user", UserSchema)
export default UserModel