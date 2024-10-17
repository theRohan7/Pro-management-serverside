import express from "express";
import cors from "cors";

const app = express();

const allowedOrigins = 'http://localhost:5173'


app.use(cors({
    origin: (origin, callback) => {
        if(!origin) return callback(null, true);
        if( allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}))

app.use(express.json({ limit: "16kb"}))
app.use(express.urlencoded({ extended:true, limit: "16kb"}))
app.use(express.static("public"));

//Routing Import

import userRouter from "./routes/user.route.js";
import tasksRouter from "./routes/tasks.route.js";


//Route Declaration

app.use('/api/v1/user', userRouter)
app.use('/api/v1/tasks', tasksRouter)










export { app };