import {Router} from 'express';
import {verifyJWT} from '../middlewares/auth.middleware.js';
import { changeTaskStatus, createTask, deleteTask, editTask, filterTasks, getSharedTask } from '../controllers/tasks.controller.js';



const router = Router();

//general Routes
router.route('/shared-task/:taskId').get(getSharedTask);



//secured routes

router.route('/filter-tasks').get(verifyJWT, filterTasks);
router.route('/create-task').post(verifyJWT, createTask);
router.route('/update-taskStatus').post(verifyJWT, changeTaskStatus);
router.route('/edit-task/:taskId').post(verifyJWT, editTask);
router.route('/delete-task').post(verifyJWT, deleteTask);



export default router;