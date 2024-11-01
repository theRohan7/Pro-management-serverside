import mongoose, { Schema } from "mongoose";

const taskSchema = new Schema (
    {
        title: {
            type: String,
            required: true
        },
        owner :{
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        priority: {
            type: String,
            required: true,
            enum : ['High Priority', 'Moderate Priority', 'Low Priority']
        },
        status : {
            type: String,
            required: true,
            enum : ['Backlog', 'Todo', 'In Progress', "Done"]
        },
        checklists :[
            {
                title: { type: String, required: true },
                completed: { type: Boolean, default: false },
                
            }
        ],
        dueDate: {
            type: Date,
        },
        asignee: {
            type: Schema.Types.ObjectId,
            ref: "User"       
        }
    }, {
        timestamps: true
    }
)

export const Task = mongoose.model("Task", taskSchema); 