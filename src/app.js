import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser";


const app = express();

//to make specific frontend talk to the backend
app.use(cors({
    origin : process.env.CORS_ORIGIN,
    credentials : true
}))

//to parse json data
app.use(express.json({limit : "16kb"}))

//to parse url data
app.use(express.urlencoded({extended : true , limit : "16kb"}))

//to use static assests 
app.use(express.static("public"))

//to crud on cookies
app.use(cookieParser());


//routes import 
import userRouter from "./routes/user.route.js"



//route declartion 
app.use('/api/v1/users' , userRouter);

export default app;