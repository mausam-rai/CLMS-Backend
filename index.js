import express from 'express';
import dotenv from 'dotenv';
import connectDB from './DB/DB_Connect.js'; 
import cors from 'cors';
import cookieParser from 'cookie-parser';
import userRouter from './Router/User.Router.js';
import projectRouter from './Router/Project.Router.js'
import activityRouter from './Router/Activity.Router.js'

const corsOptions={
    origin:'*',
    credentials:true
}


dotenv.config();
const app=express();
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

const PORT= process.env.PORT || 8000;



app.use('/user', userRouter);
app.use('/project', projectRouter);
app.use('/activity', activityRouter);



connectDB();
app.listen(PORT, ()=>{
    console.log("server is running on port :", PORT);
})