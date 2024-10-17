import {Router} from 'express';
import {verifyJWT} from '../middlewares/auth.middleware.js';
import { changePassword, fetchAllUsers, loginUser, logoutUser, registerUser } from '../controllers/user.controller.js';



const router = Router();

//general Routes

router.route('/register').post(registerUser);
router.route('/allUser').get(fetchAllUsers);
router.route('/login').post(loginUser);


//secured routes

router.route('/logout').post(verifyJWT, logoutUser);
router.route('/change-password').post(verifyJWT, changePassword);
// router.route('/editUserProfile').post(verifyJWT, editUserProfile);


export default router;

