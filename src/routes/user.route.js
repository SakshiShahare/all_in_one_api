import Router from "express"
import {loginUser, logoutUser, refreshAccessToken, registerUser} from "../controllers/user.controller.js"
import {upload} from "../middlewares/multer.middleware.js"
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.route('/register').post(
    upload.fields([
        {
            name : "avatar",
            maxCount : 1
        },
        {
            name : "coverImage",
            maxCount : 1
        }
    ]),
    registerUser
    );
 
router.route('/login').post(loginUser);

//secured route
router.route('/logout').post(verifyToken , logoutUser);
//not need to use middleware all the logic is decoded in the function only
router.route('/refresh-token').post(refreshAccessToken);


export default router;