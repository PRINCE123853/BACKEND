import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.models.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler( async ( req , res) => { 
/*
//this was just for demo
 res.status(200).json({ // explore this concept(200 why > Request successful. The server has responded as required.)
  message: "chai-aur-code"
  })
*/


//get user detaols from frontend
//validation mainly -not empty , like username or email etc valid or not
// check if user already exists: username , email
//check for image , check for avatar
//upload on cloudinary
// create user object = create entry in db
//remove password and refresh token field from response 
// check for user creation 
// return response

const {fullName , email , username , password} = req.body
console.log("email", email);

// if(fullName === ""){// we can do for everyone like this , learner can do it
// throw new ApiError(400,"fullname is required")
// }

   if(
      [fullName,email,username,password].some((field)=>//explore some() 
      field?.trim() === "")//afetr triming if any field is empty"" then return true 
    ) {
   throw new ApiError(400,"All fields are required")
    }
    
   const existedUser = User.findOne({
      $or: [{ username }, { email }]
    })
   if(existedUser){
    throw new ApiError(409,"User with email or username already exists")
   }
  // all data comes under "req.body" by express
  // excess of files "req.files" by multer
  const avatarLocalPath = req.files?.avatar[0]?.path;  // work happens by multer (take file and bring at server not cloudinary)     //we are taking 1st properties so "0", so may properties are happens EXPLORE  
  const coverImageLocalPath = req.files?.coverImage[0]?.path;
  if(!avatarLocalPath){
    throw new ApiError(400,"Avatar file is required")
  }
  
  //now upload from local to cloudinary
  const avatar = await uploadOnCloudinary(avatarLocalPath)
  const coverImage = await uploadOnCloudinary(coverImageLocalPath)
  
  if(!avatar){
     throw new ApiError(400,"Avatar file is required")
  }

  //create object and entry in database
 const user = await User.create({
    fullName,
    avatar: avatar.url, // we are sending url in datbase
   coverImage: coverImage?.url || "", // this is not compulsory so if available then ok otherwise empty
   email,
   password,
   username: username.toLowerCase()
  })
   
  const createdUser = await User.findById(user._id).select(// for conformation that object is created or not "_id" given by mongodb to all entry
    "-password -refreshToken" //remove unwanted(thoda ajiv syntax hai)
  ) 

  if(!createdUser){
    throw new ApiError(500 , "Something went wrong while registering the user")
  }

  return res.status(201).json(
    new ApiResponse(200, createdUser, "User registered Successfully")
  )

}) 
export {registerUser,}