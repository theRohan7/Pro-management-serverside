import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";


const registerUser = asyncHandler(async (req, res) => {

    const { name, email, password } = req.body;

    if(!name || name === ''){
        throw new ApiError(400, "Name is required")
    }
    if(!email || !email.includes('@') ){
        throw new ApiError(400, "Email is required")
    }
    if(!password || password.length < 6){
        throw new ApiError(400, "Password is required")
    }

    const  existedUser = await User.findOne({ email })

    if(existedUser){
        throw new ApiError(409, "User with this email already exists.")
    }

    const user = await User.create({
        name: name,
        email: email,
        password: password,
        tasks: [],
        analytics: {
            lowPriorityTasks: 0,
            moderatePriorityTasks: 0,
            highPriorityTasks: 0,
            backlogTasks: 0,
            todoTasks: 0,
            inProgressTasks: 0,
            doneTasks: 0,
            dueDateTasks: 0,
        }
    })

    const createdUser = await User.findById(user._id).select("-password")

    if(!createdUser){
        throw new ApiError(500, "Something went wrong while registering.") 
    }

    return res
    .status(201)
    .json(
        new ApiResponse( 201, createdUser, "User registered successfully.")
    )

})

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if(!email || email === ''){
        throw new ApiError(400, "Email is required")
    }

    if(!password || password === '') {
        throw new ApiError(400, "Password is required")
    }

    const user = await User.findOne({ email })

    if(!user){
        throw new ApiError(404, "User not found")
    }

    const checkPassword = await user.isPasswordCorrect(password)

    if(!checkPassword){
        throw new ApiError(500, "Invalid user credentials")
    }

    const token = await user.generateToken()
    await user.save({validateBeforeSave: false})

    const loggedinUser = await User.findById(user._id).select("-password")

    return res
    .status(200)
    .json(
        new ApiResponse( 200, {user:loggedinUser, token}, "user logged in successfully." )
    )
})

const logoutUser = asyncHandler ( async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
           $set:{
            token : undefined
           } 
        }, 
        {
            new: true
        }
    )

    return res
    .status(200)
    .json( new ApiResponse(200, {}, "User logged out."))
})

const changePassword = asyncHandler( async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const id = req.user._id

    if(!oldPassword || oldPassword === ''){
        throw new ApiError(400, "Old Password is required")
    }

    if(!newPassword || newPassword === ''){
        throw new ApiError(400, "New Password is required")
    }

    const user = await User.findById(id)

    if(!user){
        throw new ApiError(404, "User not found")
    }

    const checkPassword = await user.isPasswordCorrect(oldPassword)

    if(!checkPassword){
        throw new ApiError(500, "Invalid user credentials")
    }

    user.password = newPassword
    await user.save({validateBeforeSave: false})

    const token = await user.generateToken()

    return res
    .status(200)
    .json(
        new ApiResponse( 200, {}, "Password changed successfully.")
    )
})

const fetchAllUsers = asyncHandler( async (req, res) => {

    const users = await User.find({},'email');

    if(!users){
       throw new ApiError(404, "No Users found")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, users, "Users fetched successfully"))
})

const updateName = asyncHandler( async (req, res) => {
    const { name } = req.body;
    const id = req.user._id

    if(!name || name === ""){
        throw new ApiError(400, "Name is required")
    }

    const updatedUser = await User.findByIdAndUpdate(id, { name: name }, {new: true, runValidators: true}).select("-password")

    if(!updatedUser){
        throw new ApiError(404, "something went wrong while updating user.")
    }

    const token = await updatedUser.generateToken()

    return res
    .status(200)
    .json(
        new ApiResponse(200, updatedUser, "Name updated successfully")
    )

})

const updateEmail = asyncHandler( async (req, res) => {
    const { email } = req.body;
    const id = req.user._id

    if(!email || !email.includes("@")){
        throw new ApiError(400, "Email is required")
    }

    const user = await User.findById(id)

    if(!user){
        throw new ApiError(404, "User not found")
    }

    const updatedUser = await User.findByIdAndUpdate(id, { email: email }, {new: true, runValidators: true}).select("-password")

    if(!updatedUser){
        throw new ApiError(404, "something went wrong while updating Email.")
    }

    const token = await updatedUser.generateToken()

    return res
    .status(200)
    .json(
        new ApiResponse(200, updatedUser, "Email updated successfully")
    )
})





export {
    registerUser,
    loginUser,
    logoutUser,
    changePassword,
    updateName,
    updateEmail,
    fetchAllUsers,

}