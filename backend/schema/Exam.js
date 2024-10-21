import mongoose,{ Schema } from "mongoose";

const exam = new Schema({
    username:{
        type: String,
        required: true
    },
    subject:{
        type: String,
        required: true
    },
    name:{
        type: String,
        required: true
    },
    date:{
        type: String,
        required: true
    },
    hrs:{
        type: Number,
        default: 0
    },
    target:{
        type: Number,
        required: true
    }
})

const Exam = mongoose.model("Exam",exam);
export default Exam;