import { Router } from "express";
import { loginUser, logoutUser, refrestAccessToken, registerUser ,changeCurrentPassword ,updateUser, updateUserAvatar , updateUserCoverImage} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router()
router.route("/register").post(upload.fields([
    {
        name: "avatar",
        maxCount: 1
    }, {
        name: "coverImage",
        maxCount: 1
    }
]), registerUser)
router.post("/login", loginUser)
router.post("/refreshAccessToken",refrestAccessToken)
// Secured routes
router.post("/logout", verifyJWT, logoutUser)
router.post("/change-password",verifyJWT,changeCurrentPassword)
// update User
router.patch("/update-user",verifyJWT,updateUser)
router.patch("/update-avatar",upload.single("avatar"),verifyJWT,updateUserAvatar)
router.patch("/update-cover-image",upload.single("coverImage"),verifyJWT,updateUserCoverImage)


export default router