
// route means like    ./  , ./profaile , ./profile/temp 
import {Router} from "express"; // router comes from express
import { loginUser, logoutUser, registerUser, refreshAccessToken } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js"; 



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

export default router // dafter defalut we can import anyware as own wish name . if not default then same name







