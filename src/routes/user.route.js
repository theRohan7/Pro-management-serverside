import {Router} from 'express';
import {verifyJWT} from '../middlewares/auth.middleware.js';
import { changePassword, fetchAllUsers, loginUser, logoutUser, registerUser, updateEmail, updateName } from '../controllers/user.controller.js';



const router = Router();

//general Routes

router.route('/register').post(registerUser);
router.route('/allUser').get(fetchAllUsers);
router.route('/login').post(loginUser);


//secured routes

router.route('/logout').post(verifyJWT, logoutUser);
router.route('/change-password').put(verifyJWT, changePassword);
router.route('/update-name').put(verifyJWT, updateName);
router.route('/update-email').put(verifyJWT, updateEmail);


export default router;

