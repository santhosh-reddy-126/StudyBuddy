import mongoose,{ Schema } from "mongoose";

const files = new Schema({
    username: {
        type: String,
        required: true
    },
    Files: {
        type: Array,
        default: []
    }
})
const Files = mongoose.model("Files",files);
export default Files;