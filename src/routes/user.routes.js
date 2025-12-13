import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";  //middleware

const router=Router()

//inject middleware(upload),before the method which to be executed(registerUser)
router.route("/register").post(
    upload.fields([
      {
        name:"avatar",
        maxCount:1
      },
       {
        name:"coverImage",
        maxCount:1
      }
    ]),

    registerUser)
//http://localhost:8000/api/v1/users/register

export default router