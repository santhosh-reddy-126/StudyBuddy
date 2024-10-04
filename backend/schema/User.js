import mongoose,{Schema} from "mongoose";

const user = new Schema({
    username:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    class:{
        type: Array,
        default: []
    },
    words:{
        type: Array,
        default: []
    }
})


const User = mongoose.model("User",user);
export default User;