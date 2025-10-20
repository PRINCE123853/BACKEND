import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"



const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    avatar: {
      type: String, // cloudinary url (like aws google cloud)
      required: true,
    },
    coverImage: {
      type: String, // cloudinary url
    },
    watchHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video",
      },
    ],

    password: {
      type: String, // not number
      required: [true, "Password is required"],
    },

    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
)

userSchema.pre("save", async function (next){
  if(!this.isModified("password")) return next();// agar password modify nhi hua hai to aeise hi chhor do next page par lekar jao
 
  
  this.password= bcrypt.hash(this.password, 10) // for encrepting(conert readable to secret data) the password // agar password change hua hai to phir encypt karo
  next()
})// a type of hook middleware

userSchema.methods.isPasswordCorrect = async function 
(password){
return await bcrypt.compare(password, this.password)// output is T or F
}

userSchema.methods.generateAccessToken = function(){
  return jwt.sign(
  {
   _id: this._id,
   email: this.email,
   username:this.username,
   fullName: this.fullName // using "this" we are taking from database 
  },
   process.env.ACCESS_TOKEN_SECRET,
   {
   expiresIn: process.env.ACCESS_TOKEN_EXPIRY
   }
  
)
}


userSchema.methods.generateRefreshToken = function(){
   return jwt.sign(
  {
   _id: this._id,
  },
   process.env.REFRESH_TOKEN_SECRET,
   {
   expiresIn: process.env.REFRESH_TOKEN_EXPIRY
   }
  
)
}


export const User = mongoose.model("User", userSchema);
