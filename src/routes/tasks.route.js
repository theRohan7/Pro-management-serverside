import {Router} from 'express';
import {verifyJWT} from '../middlewares/auth.middleware.js';
import { changeTaskStatus, createTask, deleteTask, editTask, filterTasks, getSharedTask, taskChecklistCompletion } from '../controllers/tasks.controller.js';



const router = Router();

//general Routes
router.route('/shared-task/:taskId').get(getSharedTask);



//secured routes

router.route('/filter-tasks').get(verifyJWT, filterTasks);
router.route('/create-task').post(verifyJWT, createTask);
router.route('/update-taskStatus').post(verifyJWT, changeTaskStatus);
router.route('/task-checklist').post(verifyJWT, taskChecklistCompletion);
router.route('/edit-task/:taskId').post(verifyJWT, editTask);
router.route('/delete-task/:taskId').delete(verifyJWT, deleteTask);



export default router;