import { processMessage } from "../utils/utils.js";
import axios from "axios";

export const processUser = async (user) => {
    try {
        // console.log("processing user = ", user);
        const response = await axios.post(
            `https://waapi.app/api/v1/instances/${process.env.WAAPI_INSTANCE}/client/action/fetch-messages`,
            { fromMe: false, chatId: user.chatId },
            {
                headers: {
                    accept: "application/json",
                    authorization: `Bearer ${process.env.WAAPI_TOKEN}`,
                    "content-type": "application/json",
                },
            }
        );
        const data = response.data

        // Validate response structure
        if (!data || typeof data !== "object") {
            console.error("Unexpected API response:", data);
            return;
        }

        const messages = data.data.data;
        console.log(messages)
        if (messages.length === 0) return;

        let newLastMessageId = user.lastMessageId;

        for (const { message } of messages.slice().reverse()) {
            if (!message || !message._data?.id?._serialized) {
                console.warn("Skipping invalid message format:", message);
                continue;
            }

            const messageId = message._data.id._serialized;
            if (messageId == user.lastMessageId) {
                break;
            }

            await processMessage(message.body, message.timestamp, user, messageId);
            newLastMessageId = messageId;
        }

        console.log("newLastMessageId = ", newLastMessageId);
        user.lastMessageId = newLastMessageId;
        user.save();
    } catch (err) {
        console.error("Error fetching messages for user:", err);
    }
};


export const sendMessage = async (chatId, message, replyToMessageId = null) => {
    try {
        const response = await axios.post(
            `https://waapi.app/api/v1/instances/${process.env.WAAPI_INSTANCE}/client/action/send-message`,
            { chatId, message, replyToMessageId },
            {
                headers: {
                    accept: "application/json",
                    authorization: `Bearer ${process.env.WAAPI_TOKEN}`,
                    "content-type": "application/json",
                },
            }
        );
    } catch (errMessage) {
        console.error('Error sending message:', errMessage);
    }
};