import { asyncHandler } from "../utils/asyncHandler.js";

const registerUser = asyncHandler( async ( req , res) => { 
 res.status(200).json({ // explore this concept(200 why > Request successful. The server has responded as required.)
  message: "chai-aur-code"
})
})
export {registerUser,}