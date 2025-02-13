import mongoose from "mongoose";


export const UserSchema = new mongoose.Schema(
    {
        chatId: {
            type: String,
            required: true,
            unique: true
        },
        phoneNumber: {
            type: String,
            required: true,
            unique: true
        },
        lastMessageId: {
            type: String
        }
    }
)

const User = mongoose.model("User", UserSchema);
export default User;