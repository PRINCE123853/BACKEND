import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";//for excess user browser and set it

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
); // iska use("use") ka use basically middleware ya config ke liye kiya jata hai

app.use(express.json({ limit: "16kb" })); //when form is filling then take the data for middleware etc , limit is maximum side setting in json
app.use(express.urlencoded({ extended: true, limit: "16kb" })); //url data
app.use(express.static("public"))
app.use(cookieParser())



//routes import
import userRouter from './routes/user.routes.js'
//routes declaration// in below line cannot do the "app.get" directly because router is not here , so  first step is compulsary that take the middleware
app.use("/api/v1/users", userRouter) //this line goes in "user.routes" file and run the register route and make the server like  "http://localhost:8000/api/v1/users/register" same for login etc



export { app }
