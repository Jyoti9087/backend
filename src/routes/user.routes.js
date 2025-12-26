import { Router } from "express";
import { loginUser, logoutUser, registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";  //middleware
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router=Router()

//inject middleware(upload),before the method which to be executed(registerUser)
router.route("/register").post(
    upload.fields([
      {
        name:"avatar",
        maxCount:1
      },
       {
        name:"coverimage",
        maxCount:1
      }
    ]),

    registerUser)
//http://localhost:8000/api/v1/users/register


router.route("/login").post(loginUser)


//secured routes
router.route("/logout").post(verifyJwt,logoutUser)

export default router