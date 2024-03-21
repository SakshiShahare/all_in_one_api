import dotenv from "dotenv"
import connectDB from "./db/connect.js"
import { log } from "console";


dotenv.config({path : './.env'});
const port = process.env.PORT || 8000;

//connectDB is an async function so it returns a promise solve it using await and try catch block or then and catch it is the same
connectDB()
.then(()=>{
    app.on(error , (error) =>{
        console.log("Error while listening on app" , error);
    })
    app.listen(port , ()=>{
        console.log("Server is listening on port " , port );
    })

})
.catch((error) => {
    console.log("MONGODB CONNECTION FAILED :" , error);

})