
// route means like    ./  , ./profaile , ./profile/temp 

import {Router} from "express"; // router comes from express
import { 
  loginUser, 
  logoutUser, 
  registerUser, 
  refreshAccessToken, 
  changeCurrentPassword, 
  getCurrentUser, 
  updateAccountDetails, // vdo X
  updateUserAvatar, 
  updateUserCoverImage, 
  getUserChannelProfile, 
  getWatchHistory 
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js"; 
// import { JsonWebTokenError } from "jsonwebtoken";



const router= Router()

router.route("/register").post(
  upload.fields([
  {
    name:"avatar",
    maxCount: 1
  },
  {
    name:"coverImage",
    maxCount: 1
  }
  ]),  // middleware
  registerUser
) //from app and after app go on the registerUser (in user.controller)
//for postman we have to give route name not file(basic things)// post basic meaning that send data from user , one server to another because this is http method


router.route("/login").post(loginUser)

//secured routes
router.route("/logout").post(verifyJWT, logoutUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/change-password").post(verifyJWT, changeCurrentPassword)
router.route("/current-user").get(verifyJWT, getCurrentUser)// yaha user ko direct data chahiye koi set nhi kar raha hai isiliye get.
router.route("/update-account").patch(verifyJWT,updateAccountDetails )// patch rakhte hai nhi to sari detail update ho jayegi, patch me particular hoga

router.route("/avatar").patch(verifyJWT, upload.single("avatar"), updateUserAvatar)
router.route("/cover-Image").patch(verifyJWT, upload.single("coverImage"), updateUserCoverImage)


//yaha params se data aa raha hai jab url se aata hai to ye format sahi rahega. "c->channel" anythinhg
router.route("/c/:username").get(verifyJWT, getUserChannelProfile)

router.route("/history").get(verifyJWT, getWatchHistory)


export default router // dafter defalut we can import anyware as own wish name . if not default then same name







