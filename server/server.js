import { config } from "dotenv";
config();
import app from "./app.js"
import mongoose from "mongoose";
import connectionToDB from "./config/dbConnection.js";

const PORT = process.env.PORT|| 5000;

app.listen(PORT, async() => {
    await connectionToDB();
    console.log(`APP is running at http:localhost : ${PORT}`);
});