import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email : {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        tasks : [
            {
                task: {
                    type: Schema.Types.ObjectId,
                    ref: "Task"
                }
            }
        ],

        analytics: {
            lowPriorityTasks: {
                type: Number,
                default: 0
            },
            moderatePriorityTasks: {
                type: Number,
                default: 0
            },
            highPriorityTasks: {
                type: Number,
                default: 0
            },
            backlogTasks:{
                tyepe: Number,
                default:0
            },
            todoTasks: {
                type: Number,
                default: 0
            },
            inProgressTasks: {
                type: Number,
                default: 0
            },
            doneTasks: {
                type: Number,
                default: 0
            },
            dueDateTasks: {
                type: Number,
                default: 0
            }
        }
        
    }, 
    {
        timestamps: true
    }
)

// encrypt password before saving it to database
userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return
    this.password = await bcrypt.hash(this.password, 10)
    next()
})


// check the given password with encrypted password
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateToken = async function () {
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.TOKEN_SECRET,
        {
            expiresIn: process.env.TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User", userSchema)
