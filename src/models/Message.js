import mongoose from "mongoose";

export const MessageSchema = new mongoose.Schema(
    {
        messageId: {
            type: String,
            required: true,
            unique: true
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        message: {
            type: String,
            required: true,
        },
        timestamp: {
            type: Date,
            required: true,
        },
        expense: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Expense",
        },

    }
)

const Message = mongoose.model("Message", MessageSchema);
export default Message;