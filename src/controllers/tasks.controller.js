import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Task } from "../models/tasks.model.js";
import { User } from "../models/user.model.js";


const createTask = asyncHandler(async (req, res) => {
    const {title, priority, status, dueDate, asignee, checklists} = req.body
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
        asignee: asignee,
        checklists: checklists,
    })

    const createdTask = await Task.findById(task._id)

    user.tasks.push(task)
    await user.save({validateBeforeSave: false})

    return res
    .status(201)
    .json(
        new ApiResponse (201, createdTask, "Task created successfully")
    )
})


export {
    createTask
}