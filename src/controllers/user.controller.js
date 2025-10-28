


// p



//  //till now my handwritten code (avatar require)
// import { asyncHandler } from "../utils/asyncHandler.js";
// import { ApiError } from "../utils/ApiError.js"//
// import { User } from "../models/user.models.js"
// import {uploadOnCloudinary} from "../utils/cloudinary.js"
// import { ApiResponse } from "../utils/ApiResponse.js";
 
 
 
// const registerUser = asyncHandler( async ( req , res) => { 
// /*
// //this was just for demo
//  res.status(200).json({ // explore this concept(200 why > Request successful. The server has responded as required.)
//   message: "chai-aur-code"
//   })
// */


// //get user detaols from frontend
// //validation mainly -not empty , like username or email etc valid or not
// // check if user already exists: username , email
// //check for image , check for avatar
// //upload on cloudinary
// // create user object = create entry in db
// //remove password and refresh token field from response 
// // check for user creation 
// // return response

// const {fullName , email , username , password} = req.body
// // console.log("email", email);

// // if(fullName === ""){// we can do for everyone like this , learner can do it
// // throw new ApiError(400,"fullname is required")
// // }

//    if(
//       [fullName,email,username,password].some((field)=>//explore some() 
//       field?.trim() === "")//afetr triming if any field is empty"" then return true 
//     ) {
//    throw new ApiError(400,"All fields are required")
//     }
    
//    const existedUser = await User.findOne({
//       $or: [{ username }, { email }]
//     })
//    if(existedUser){
//     throw new ApiError(409,"User with email or username already exists")
//    }

//     // console.log(req.files)


//   // all data comes under "req.body" by express
//   // excess of files "req.files" by multer
//   const avatarLocalPath = req.files?.avatar[0]?.path;  // work happens by multer (take file and bring at server not cloudinary)     //we are taking 1st properties so "0", so may properties are happens EXPLORE  

//   // const coverImageLocalPath = req.files?.coverImage[0]?.path;
//   let coverImageLocalPath;
//   if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
//   coverImageLocalPath = req.files.coverImage[0].path
//   }

//   if(!avatarLocalPath){
//     throw new ApiError(400,"Avatar file is required")
//   }
  

//   //now upload from local to cloudinary
//   const avatar = await uploadOnCloudinary(avatarLocalPath)
//   const coverImage = await uploadOnCloudinary(coverImageLocalPath)
  
//   if(!avatar){
//      throw new ApiError(400,"Avatar file is required")
//   } 

//   //create object and entry in database
//  const user = await User.create({
//     fullName,
//     avatar: avatar.url, // we are sending url in datbase
//    coverImage: coverImage?.url || "", // this is not compulsory so if available then ok otherwise empty
//    email,
//    password,
//    username: username.toLowerCase()
//   })
   




//   const createdUser = await User.findById(user._id).select(// for conformation that object is created or not "_id" given by mongodb to all entry
//     "-password -refreshToken" //remove unwanted(thoda ajiv syntax hai)
//   ) 

//   if(!createdUser){
//     throw new ApiError(500 , "Something went wrong while registering the user")
//   }

//   return res.status(201).json(
//     new ApiResponse(200, createdUser, "User registered Successfully")
//   )



// }) 
// export {registerUser,}


//  k













// TILL NOW MY RUNNING CODE (10H) (avatar optional , aur bus maine userModule se avatar ka required comment kar diya hai) , other everything like above code

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"
import mongoose from "mongoose";



const generateAccessAndRefereshTokens =  async(userId)=>{
try {
  const user = await User.findById(userId)
  const accessToken = user.generateAccessToken() 
  const refreshToken= user.generateRefreshToken() 

  user.refreshToken = refreshToken // refresh token stored in database
  await user.save({validateBeforeSave: false})
  return {accessToken , refreshToken}
} catch (error) {
  throw new ApiError(500, "Something went wrong while generating refresh and access token")
}
}


const registerUser = asyncHandler(async (req, res) => {
  // 1. Get user details from frontend
  const { fullName, email, username, password } = req.body;

  // 2. Validate required text fields
  if ([fullName, email, username, password].some(field => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  // 3. Check if user already exists
  const existedUser = await User.findOne({
    $or: [{ username }, { email }]
  });
  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists");
  }

  // 4. Handle avatar upload (optional)
  let avatar;
  let avatarLocalPath;
  if (req.files && Array.isArray(req.files.avatar) && req.files.avatar.length > 0) {
     avatarLocalPath = req.files.avatar[0].path;
     if(!avatarLocalPath){
    throw new ApiError(400,"Avatar localpath  is required.")
  }
   avatar = await uploadOnCloudinary(avatarLocalPath);
      if(!avatar){
     throw new ApiError(400,"Avatar file is required..")
  } 
  }

  // 5. Handle coverImage upload (optional)
  let coverImage;
  let coverImageLocalPath;
  if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
     coverImageLocalPath = req.files.coverImage[0].path;
    coverImage = await uploadOnCloudinary(coverImageLocalPath); 
  }
 


  // 6. Create user in database
  const user = await User.create({
    fullName,
    avatar: avatar?.url || "",       // optional
    coverImage: coverImage?.url || "", // optional
    email,
    password,
    username: username.toLowerCase()
  });


  // 7. Confirm user creation and remove sensitive fields
  const createdUser = await User.findById(user._id).select("-password -refreshToken");
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  // 8. Send response
  return res.status(201).json(
    new ApiResponse(200, createdUser, "User registered Successfully")
  );
});


//login if user already exist and signup for new user
const loginUser = asyncHandler(async(req, res)=>{
    //req body -->  data
    // username or email
    // find the user
    // password check
    // access and refresh token
    //send cookie
    const {email , username , password} = req.body
   
    if((!username && !email)){
      throw new ApiError(400 , "username or email is required")
    }
     // here is an alternative of above code based on logic discussed in video:
     //if (!(username || email)){
     // throw new ApiError(400, "username or email is required")
     //}
   const user = await User.findOne({
      $or: [{username}, {email}]
    })

    if(!user){
      throw new ApiError(404 , "User does not exist")
    }

     // not User(mongodb already store data object) , here is user (our user)
    const isPasswordValid = await user.isPasswordCorrect(password)
    
    if(!isPasswordValid){
      throw new ApiError(401 , "Invalid user credentials")
    }
     
   const {accessToken , refreshToken} = await generateAccessAndRefereshTokens(user._id)
    
   const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

   const options ={
    httpOnly : true,
    secure : true
   }
    
   return res
   .status(200)
   .cookie("accessToken" , accessToken , options)//key ,value , option
   .cookie("refreshToken", refreshToken , options)
   .json(
    new ApiResponse(//case if user want to save in own device 
      200,
      {
        user: loggedInUser, accessToken, refreshToken
      },
   "User logged In Successfully"
   )
   )
})

const logoutUser = asyncHandler(async(req, res)=>{
await User.findByIdAndUpdate(
  req.user._id,
  {
    $set:{
     refreshToken: undefined
    }
  },
  {
  new: true
  }
 )
    const options ={
    httpOnly : true,
    secure : true
   }

   return res
   .status(200)
   .clearCookie("accessToken", options)
   .clearCookie("refreshToken", options)
   .json(new ApiResponse(200 , {} , "User logged out"))
})

const refreshAccessToken = asyncHandler(async(req,res)=>{
const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

if(!incomingRefreshToken){
  throw new ApiError(401 , "unauthorized request") // apierror is the responce of the error (extended) so we are using it
}

try{
 const decodedToken =  jwt.verify(
    incomingRefreshToken,
    process.env.REFRESH_TOKEN_SECRET
  )

  const user = await User.findById(decodedToken?._id)
  
  if(!user){
  throw new ApiError(401 , "Refresh token is expired or used") 
}

  if(incomingRefreshToken !== user?.refreshToken){
  throw new ApiError(401 , "Refresh token is expired or used") 
}

const options = {
  httpOnly: true,
  secure: true
}

 const {accessToken, newRefreshToken} = await generateAccessAndRefereshTokens(user._id)

 return res
 .status(200)
 .cookie("accessToken", accessToken, options)
 .cookie("refreshToken", newRefreshToken, options)
 .json(
  new ApiResponse(
    200,
    {accessToken, refreshToken: newRefreshToken},"Access token refreshed"
  )
 )
}catch(error){
  throw new ApiError(401, error?.message || "Invalid refresh token")
}

})

const changeCurrentPassword = asyncHandler(async(req, res)=>{
  const {oldPassword, newPassword} = req.body
// password change ho raha hai , old password means aapne jo password aap pahle se use karte aaye ho aur new matlab jisse aap new password set karna chahte ho this is not forgot password
  const user = await User.findById(req.user?._id) // middleware auth me hamne req.user= user kar rakha hai to id mil jayega

  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

  if(!isPasswordCorrect){
    throw new ApiError(400, "Invalid old password")
  }
   
  user.password = newPassword
 await user.save({validateBeforeSave: false})

   return res
   .status(200)
   .json(new ApiResponse(200, {}, "Password changed successfully"))

})

const getCurrentUser = asyncHandler(async(req, res)=>{
  return res
  .status(200)
  .json(new ApiResponse(200, req.user , " user fetched successfully"))
})

const updateAccountDetails = asyncHandler(async(req, res)=>{
  const {fullName,email} = req.body
  // agar koi file update karna ho to best advice hota hai ki alag se karo ,kyuki pura user save hone par text data bhi baar baar jata hai
  if(!fullName || !email){
    throw new ApiError(400 , "All fields are required")
  }

 const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set:{
        // fullName: fullName
        // fullName (thsi both line is right to write)
        fullName,
        email: email
      }
    },
    {new: true}//update hone ke baad return value aayega
  ).select("-password")//password field nhi chahiye. jaisa man kare vaisa kar sakte hai depends upon developer
   
  return res
  .status(200)
  .json(new ApiResponse(200, user, "Account details updated successfully"))


})


const updateUserAvatar = asyncHandler(async(req, res)=>{
  const avatarLocalPath = req.file?.path

  if(!avatarLocalPath){
  throw new ApiError(400, "Avatar file is missing")
  }

  //TODO delete old image - assignment

  const avatar = await uploadOnCloudinary(avatarLocalPath)

  if(!avatar.url){
    throw new ApiError(400, "Error while uploading on avatar")
  }

 const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set:{
        avatar: avatar.url//yaha new avatar me cloudinary par uploaded avatar ka url dal rahe hai
      }
    },
    {new: true}
  ).select("-password")

    return res
  .status(200)
  .json(
    new ApiResponse(200, user , "Avatar updated successfully")
  )

})

const updateUserCoverImage = asyncHandler(async(req, res)=>{
  const coverImageLocalPath = req.file?.path

  if(!coverImageLocalPath){
  throw new ApiError(400, "Cover image file is missing")
  }

  const coverImage = await uploadOnCloudinary(coverImageLocalPath)

  if(!coverImage.url){
    throw new ApiError(400, "Error while uploading on cover image")
  }

const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set:{
        coverImage: coverImage.url
      }
    },
    {new: true}
  ).select("-password")

  return res
  .status(200)
  .json(
    new ApiResponse(200, user , "Cover image updated successfully")
  )

})

const getUserChannelProfile = asyncHandler(async(req, res)=>{
  const {username} = req.params //not req.body we are taking url so req.params
  if(!username?.trim()){
    throw new ApiError(400, "username is missing")
  }

  const channel = await User.aggregate([
    {
      $match:{
        username: username?.toLowerCase()
      }
    },
    {
      // find the subscriber of a channel
      $lookup:{
        from:"subscriptions",//Subscription be remember all in lowercase and plural
        localField:"_id",
        foreignField:"channel",
        as: "subscribers"

      }
    },
    {
      // find subscribed by me
      $lookup:{
        from:"subscriptions",
        localField:"_id",
        foreignField:"subscriber",
        as: "subscribedTo"
      }
    },
    {
      $addFields:{
        subscribersCount:{
        $size: "$subscribers" 
        },
       channelSubscribedToCount:{
       $size: "$subscribedTo"
       },
       isSubscribed:{
        $cond:{
          if:{$in: [req.user?._id, "$subscribers.subscriber"]},// "$in" can find in arrays and objects both
          then: true,
          else: false
        }
       }
      }
    },
    {
      // what is to prject on user profile 
      $project:{
        fullName: 1,
        username: 1,
        subscribersCount: 1,
        channelSubscribedToCount: 1,
        isSubscribed: 1,
        avatar: 1,
        coverImage: 1,
        email: 1
      }
    }




  ])//after pipilene valoue comes form of array
  // we can see more detail abd deep after "console.log(channel);""

  if(!channel?.length){
  throw new ApiError(404, "channel does not exists")
  }
   
  return res
  .status(200)
  .json(
    new ApiResponse(200, channel[0], "User channel fetched successfully")
  )

})


const getWatchHistory = asyncHandler(async(req, res)=>{

  // req.user._id // mock question= req.user se string milta hai mongoose ke through vo id me convert ho jata hai
  const user = await User.aggregate([
    {
      $match:{
        // _id: req.user._id // ye nhi likhenge kyuki yaha mongoose kaam nhi karta hai aggregation pipeline ka code directly database me store hota hai
      _id: new mongoose.Types.ObjectId(req.user._id)
      
    }
    },
    {
     $lookup:{
      from: "videos",
      localField:"watchHistory",
      foreignField: "_id",
      as: "watchHistory",
      pipeline:[
        {
        $lookup:{
          from: "users",
          localField: "owner",
          foreignField: "_id",
          as: "owner",
         pipeline:[
          {
            $project:{ // owner ke andar hai ye isiliye jitna bhi store hoga project data sab owner me hi hoga
              fullName: 1,
              username:1,
              avatar: 1

            }
          }
         ]
        }
        },
        {
          $addFields:{
            owner:{
              $first: "$owner" // array ka first value nikalkar bhi kar sakte the aur aeise bhi kar sakte hai
            }
          }
        }
      ]
     }
    }
  ])

   return res
   .status(200)
   .json(
    new ApiResponse(
      200,
      user[0].watchHistory,// agar pura user bhejte to bahut sara information jayega jabki "0" par hi hamara watch history mil jayega. 
      "Watch history fetched successfully"
    )
   )

})


export { 
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
  getUserChannelProfile,
  getWatchHistory
 };


