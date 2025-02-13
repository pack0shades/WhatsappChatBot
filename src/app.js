import express from "express";
import cors from "cors";
import axios from "axios";
import User from "./models/User.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => { 
    res.send("Welcome to the server");
})
app.post("/register", async (req, res) => {
    const { phoneNumber } = req.body;
    // find chatId from phoneNumber
    const response = await axios.post(
        `${process.env.WAAPI_ENDPOINT}/${process.env.WAAPI_INSTANCE}/client/action/get-number-id`,
        { number: phoneNumber },
        {
            headers: {
                accept: "application/json",
                authorization: `Bearer ${process.env.WAAPI_TOKEN}`,
                "content-type": "application/json",
            },
        }
    );

    const chatId = response.data.data.data.numberId._serialized;

    if (chatId) {
        await User.create({ chatId, phoneNumber });
        res.send({msg: "User registered successfully"});
    }
})

export {app};