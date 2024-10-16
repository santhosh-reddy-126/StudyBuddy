import mongoose,{ Schema } from "mongoose";

const assignment = new Schema({
    subject: {
        type: String,
        required: true
    },
    faculty: {
        type: String,
        required: true
    },
    Deadline:{
        type: Date,
        required: true
    },
    Importance:{
        type: String,
        required: true
    },
    Note:{
        type: String,
        default: ""
    },
    TimeItTakes:{
        type: Number,
        default: 3
    },Username:{
        type:String,
        required: true
    },Progress:{
        type: Number,
        default: 0
    }
})

const Assignment = mongoose.model("Assignment",assignment);
export default Assignment;