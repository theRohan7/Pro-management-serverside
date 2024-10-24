import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Task } from "../models/tasks.model.js";
import { User } from "../models/user.model.js";
import moment from "moment";


const createTask = asyncHandler(async (req, res) => {
    const {title, priority, status, dueDate, asigneeId, checklists} = req.body
    const id = req.user._id

    if(!title || title === ''){
        throw new ApiError(400, "Title is required")
    }

    if(!priority || priority === ''){
        throw new ApiError(400, "Priority is required")
    }
    if(!status || status === ''){
        throw new ApiError(400, "Status is required")
    }
    if(checklists.length < 1){
        throw new ApiError(400, "Atleast 1 checklist is required")
    }

    const user = await User.findById(id)

    if(!user){
        throw new ApiError(404, "User not found")
    }

    const task = await Task.create({
        title: title,
        owner: id,
        priority: priority,
        status: status,
        dueDate: dueDate,
        asignee: asigneeId,
        checklists: checklists,
    })

    const createdTask = await Task.findById(task._id)

    const asignedUser = await User.findById(asigneeId)
    if(!asignedUser){
        throw new ApiError(404, "Asigned user not found")
    }

    if(!asignedUser.tasks.includes(task._id)){
        asignedUser.tasks.push(task._id);
        await asignedUser.save({validateBeforeSave: false})
    }

    user.tasks.push(task)
    await user.save({validateBeforeSave: false})
    
    let analyticsUpdate = {};

    switch (priority) {
        case 'Low Priority':
            analyticsUpdate['analytics.lowPriorityTasks'] = 1;
            break;
        case 'Moderate Priority':
            analyticsUpdate['analytics.moderatePriorityTasks'] = 1;
            break;
        case 'High Priority':
            analyticsUpdate['analytics.highPriorityTasks'] = 1;
            break;
    }

    switch (status) {
        case 'Backlog':
            analyticsUpdate['analytics.backlogTasks'] = 1;
            break;
        case 'Todo':
            analyticsUpdate['analytics.todoTasks'] = 1;
            break;
        case 'In Progress':
            analyticsUpdate['analytics.inProgressTasks'] = 1;
            break;
        case 'Done':
            analyticsUpdate['analytics.doneTasks'] = 1;
            break;
    }

    if (dueDate) {
        analyticsUpdate['analytics.dueDateTasks'] = 1;
    }

  
    await User.findByIdAndUpdate(id, {
        $inc: analyticsUpdate
    });

    return res
    .status(201)
    .json(
        new ApiResponse (201, createdTask, "Task created successfully")
    )
})

const changeTaskStatus = asyncHandler(async (req, res) => {
    const { status, taskId } = req.body
    const id = req.user._id

    const user = await User.findById(id)
    if(!user){
        throw new ApiError(404, "User not found")
    }   

    const task = await Task.findById(taskId)
    if(!task){
        throw new ApiError(404, "Task not found")
    }

    if(!['Backlog', 'Todo', 'In Progress', 'Done'].includes(status)){
        throw new ApiError(400, "Invalid status")
    }

    const oldStatus = task.status

    task.status = status
    await task.save({validateBeforeSave: false})

    let analyticsUpdate = {};

    switch (oldStatus) {
        case 'Backlog':
            analyticsUpdate['analytics.backlogTasks'] = -1;
            break;
        case 'Todo':
            analyticsUpdate['analytics.todoTasks'] = -1;
            break;
        case 'In Progress':
            analyticsUpdate['analytics.inProgressTasks'] = -1;
            break;
        case 'Done':
            analyticsUpdate['analytics.doneTasks'] = -1;
            break;
    }

    switch (status) {
        case 'Backlog':
            analyticsUpdate['analytics.backlogTasks'] = analyticsUpdate['analytics.backlogTasks'] ? 0 : 1;
            break;
        case 'Todo':
            analyticsUpdate['analytics.todoTasks'] = analyticsUpdate['analytics.todoTasks'] ? 0 : 1;
            break;
        case 'In Progress':
            analyticsUpdate['analytics.inProgressTasks'] = analyticsUpdate['analytics.inProgressTasks'] ? 0 : 1;
            break;
        case 'Done':
            analyticsUpdate['analytics.doneTasks'] = analyticsUpdate['analytics.doneTasks'] ? 0 : 1;
            break;
    }

  
    await User.findByIdAndUpdate(id, {
        $inc: analyticsUpdate
    });

    return res
    .status(200)
    .json(
        new ApiResponse(200, task, "Task status updated successfully")
    )
})

const  editTask = asyncHandler(async (req, res) => {

    const { title, priority, dueDate, asigneeId, checklists } = req.body
    const  {taskId} = req.params
    const id = req.user._id

    const user = await User.findById(id)
    if(!user){
        throw new ApiError(404, "User not found")
    } 

    const task = await Task.findById(taskId)
    if(!task){
        throw new ApiError(404, "Task not found")
    }

    const oldPriority = task.priority

    task.title = title
    task.priority = priority
    task.dueDate = dueDate
    task.asignee = asigneeId
    task.checklists = checklists
    await task.save({validateBeforeSave: false})

    const asignedUser = await User.findById(asigneeId)
    if(!asignedUser){
        throw new ApiError(404, "Asigned user not found") 
    }

    if(!asignedUser.tasks.includes(task._id)){
        asignedUser.tasks.push(task._id);
        await asignedUser.save({validateBeforeSave: false})
    }

    let analyticsUpdate = {};

    switch (oldPriority) {
        case 'Low Priority':
            analyticsUpdate['analytics.lowPriorityTasks'] = -1;
            break;
        case 'Moderate Priority':   
            analyticsUpdate['analytics.moderatePriorityTasks'] = -1;
            break;
        case 'High Priority':
            analyticsUpdate['analytics.highPriorityTasks'] = -1;
            break;
    }

    switch (priority) {
        case 'Low Priority':
            analyticsUpdate['analytics.lowPriorityTasks'] = analyticsUpdate['analytics.lowPriorityTasks'] ? 0 : 1;
            break;
        case 'Moderate Priority':
            analyticsUpdate['analytics.moderatePriorityTasks'] = analyticsUpdate['analytics.moderatePriorityTasks'] ? 0 : 1;
            break;
        case 'High Priority':
            analyticsUpdate['analytics.highPriorityTasks'] = analyticsUpdate['analytics.highPriorityTasks'] ? 0 : 1;
            break;
    }

  
    await User.findByIdAndUpdate(id, {
        $inc: analyticsUpdate
    });

    return res
    .status(200)
    .json(
        new ApiResponse(200, task, "Task updated successfully")
    )

 })

 const deleteTask = asyncHandler(async (req, res) => {

    const { taskId } = req.params
    const id = req.user._id

    const user = await User.findById(id)
    if(!user){
        throw new ApiError(404, "User not found")
    } 

    const task = await Task.findById(taskId)
    if(!task){
        throw new ApiError(404, "Task not found")
    }

    await Task.findByIdAndDelete(taskId)

    return res
    .status(200)
    .json(
        new ApiResponse(200, {}, "Task deleted successfully")
    )
 })

 const filterTasks = asyncHandler(async (req, res) => {
    const  {filter = 'This Week'} = req.query;
    const id = req.user._id

    const user = await User.findById(req.user._id)

    let  startDate;
    let  endDate 
    if(filter === 'Today'){
        
        startDate = moment().startOf('day');
        endDate = moment().endOf('day');

    } else if(filter === 'This Week'){

        startDate = moment().startOf('week');
        endDate = moment().endOf('week');

    } else if(filter === 'This Month'){

        startDate = moment().startOf('month');
        endDate = moment().endOf('month');

    } else {
        throw new ApiError(400, "Invalid filter")
    }

    const tasks = await Task.find({
        createdAt: {
            $gte: startDate.toDate(),
            $lte: endDate.toDate()
        }
    })

    res
    .status(200)
    .json( new ApiResponse(200, tasks, "Tasks fetched successfully"))

 })

 const getSharedTask = asyncHandler(async (req, res) => {
    const {taskId} = req.params

    const task = await Task.findById(taskId)

    if(!task){
        throw new ApiError(404, "Task not found")
    }

    return res
    .status(200)
    .json( new ApiResponse(200, task, "Task fetched successfully"))
 })

 const taskChecklistCompletion = asyncHandler(async (req, res) => {

    const { taskId, checklistIndex } = req.body;

    const task = await Task.findById(taskId);

    if (!task) {
        throw new ApiError(404, "Task not found");
    }

    if(task.checklists[checklistIndex]){
        task.checklists[checklistIndex].completed = !task.checklists[checklistIndex].completed
    } else {
        throw new ApiError(404, "Checklist item not found");
    }

    await task.save({ validateBeforeSave: false });

    return res
    .status(200)
    .json( new ApiResponse(200, task, "Task checklist updated successfully"))
 })




export {
    createTask,
    changeTaskStatus,
    editTask,
    deleteTask,
    filterTasks,
    getSharedTask,
    taskChecklistCompletion
}