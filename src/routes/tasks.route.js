import {Router} from 'express';
import {verifyJWT} from '../middlewares/auth.middleware.js';
import { createTask } from '../controllers/tasks.controller.js';



const router = Router();

//general Routes




//secured routes

router.route('/create-task').post(verifyJWT, createTask);



export default router;