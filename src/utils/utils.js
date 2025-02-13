import { response } from "express";
import { classifierPrompt, expensePrompt, queryPrompt } from "../constants/prompts.js";
import Message from "../models/Message.js";
import User from "../models/User.js";
import { processUser, sendMessage } from "../services/waapiServices.js";

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });


export const processUsers = async () => {
    try {
        // console.log("Fetching users from database...");
        const users = await User.find({});
        // console.log("Users fetched:", users);

        for (const user of users) {
            // console.log("Processing user:", user.id);
            await processUser(user);
        }
    } catch (err) {
        console.error("Error fetching users:", err);
    }
};

export const processMessage = async (messageBody, timestamp, user, messageId) => {
    try {
        // console.log("Processing message:", { messageBody, timestamp, user, messageId });

        // send to Gemini for classification into query, expense, or none
        console.log("Sending message to Gemini for classification...");
        const messageTypeString = await gemini(classifierPrompt + messageBody);
        const messageType = parseInt(messageTypeString);
        console.log("Received message type:", messageTypeString);

        switch (messageType) {
            case 0: {
                console.log("Message classified as unsupported type");
                sendMessage(user.chatId, "No support for this message type");
                break;
            }
            case 1: {
                console.log("Message classified as expense");

                // const response = await gemini(expensePrompt + messageBody);
                // const expenseData = JSON.parse(response);

                // console.log("Parsed expense data:", expenseData);

                // const expense = await Expense.create({
                //     timestamp: new Date(expenseData.timestamp),
                //     amount: expenseData.amount,
                //     tags: expenseData.tags
                // });

                const message = await Message.create({ messageId, user: user.id, message: messageBody, timestamp });
                console.log("Expense recorded in database with ID:", message.id);
                sendMessage(user.chatId, "Expense added");
                break;
            }
            case 2: {
                console.log("Message classified as query");
                const expenses = await Message.find({ user: user.id });
                console.log("Fetched user expenses:", expenses);
                const time = new Date(timestamp).toISOString();
                const er = JSON.stringify(expenses);

                const queryPromptFormatted = queryPrompt(
                    time,
                    er,
                    messageBody,
                );
                // console.log("formatted prompt: ", queryPromptFormatted)

                const response = await gemini(queryPromptFormatted);

                // console.log("Generated query response:", response);
                sendMessage(user.chatId, response);
                break;
            }
        }
    } catch (err) {
        console.error("Error processing message:", err);
    }
};

const gemini = async (prompt) => {
    try {
        // console.log("Sending prompt to Gemini:", prompt);
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        // console.log("Gemini response:", responseText);
        return responseText;
    } catch (err) {
        console.error("Error classifying message:", err);
        return 0;
    }
};
