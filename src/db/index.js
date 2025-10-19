import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
  try{
   const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
   console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
  } catch (error){
    console.log("MONGODB connection error", error);
    process.exit(1)
  }
}
//we can use .then , .get after promises but accordingh to condiation

export default connectDB