import mongoose,{ Schema } from "mongoose";

const study = new Schema({
    username: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    startdate:{
        type: Date,
        required: true
    },
    enddate:{
        type: Date,
        required: true
    },
    status:{
        type: String,
        default: "upcoming"
    },
    progress:{
        type: Number,
        default: 0
    },
    skipped:{
        type: Number,
        default: 0
    },
    note: {
        type: String,
        default: ""
    }
})
const Study = mongoose.model("Study",study);
export default Study;