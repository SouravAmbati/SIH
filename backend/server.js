import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./configs/db.js";
import userRouter from "./routes/user.route.js";
import streamRouter from "./routes/stream.route.js";
import collegeRouter from "./routes/college.route.js";
import cookieParser from "cookie-parser";
import voiceRoute from "./routes/voice.route.js";

const app=express();
app.use(cors(
    {
        origin:"http://localhost:5173",
        credentials:true
    }
));
app.use(express.json());
app.use(cookieParser());   
const port=process.env.PORT;

connectDB();

app.get("/",(req,res)=>{
    res.send("API IS WORKING")
})

app.use('/api/user',userRouter)
app.use('/api/quiz',streamRouter)
app.use('/api/college',collegeRouter)
app.use('api/voice',voiceRoute)
app.listen(port,()=>{
    console.log(`server running on port ${port}`);
    
})