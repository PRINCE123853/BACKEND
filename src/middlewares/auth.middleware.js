// this middleware checks that user available for logout(#prince)

import { ApiError } from "../utils/ApiError.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import jwt from "jsonwebtoken"
import { User } from "../models/user.models.js"


export const verifyJWT = asyncHandler(async(req, _, next)=>{
  try{
 const token =  req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")

 if(!token){
  throw new ApiError(401 , "Unauthorized request")
 }
  
 const decodedToken = jwt.verify(token , process.env.ACCESS_TOKEN_SECRET)
 
 const user = await User.findById(decodedToken?._id).select("-password -refreshToken") // why _id(in usermodel _id is the name of accesstoken's id)
 
 if(!user){
  
  throw new ApiError(401 , "Invalid Access Token")
 }
 
 req.user = user;// is page ka middleware use hone ke baad bar bar req.user ke andar user ka current condition bhej raha hai. V.V.I line
 next()
  }catch(error){
 throw new ApiError(401 , error?.message || "Invalid access token")
  }
 

})