import {Router} from 'express';
import {verifyJWT} from '../middlewares/auth.middleware.js';
import { changeTaskStatus, createTask, deleteTask, editTask, filterTasks } from '../controllers/tasks.controller.js';



const router = Router();

//general Routes




//secured routes

router.route('/create-task').post(verifyJWT, createTask);
router.route('/update-taskStatus').post(verifyJWT, changeTaskStatus);
router.route('/edit-task/:taskId').post(verifyJWT, editTask);
router.route('/delete-task').post(verifyJWT, deleteTask);
router.route('/filter-tasks').post(verifyJWT, filterTasks);



export default router;