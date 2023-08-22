// const express = require("express");
import express from "express"
import cors from "cors";
import { config } from "dotenv";
config();
import cookieParser  from "cookie-parser";
import morgan from "morgan";


const app = express();



app.use(express.json());

app.use(cors({
    origin : [process.env.FRONTEND_URL],
    credentials : true
}));

app.use(cookieParser());

app.use(morgan("dev"));

app.get("/", (req, res ) => {
    res.send("Jai Shree Ram");
})

app.use("/ping" , function(req , res) {
    res.send("pong")
})

// app.use("/api/v1/user", userRoutes)

app.all("*" , (req , res) => {
    res.status(404).send("OOPS !! 404 page not found");
});

// module.exports = app
export default app;