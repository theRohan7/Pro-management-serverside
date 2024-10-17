import {Router} from 'express';
import {verifyJWT} from '../middlewares/auth.middleware.js';
import { loginUser, logoutUser, registerUser } from '../controllers/user.controller.js';



const router = Router();

//general Routes

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);


//secured routes

router.route('/logout').post(verifyJWT, logoutUser);

// router.route('/editUserProfile').post(verifyJWT, editUserProfile);
// router.route('/changePassword').post(verifyJWT, changePassword);

export default router;

