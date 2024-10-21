import mongoose,{ Schema } from "mongoose";

const Prof = new Schema({
    username: {
        type: String,
        required: true
    },
    friends: {
        type: Array,
        default: []
    },
    creationDate:{
        type: Date,
        default: new Date()
    },
    avgHours:{
        type: Number,
        default: 0
    }
})
const Profile = mongoose.model("Profile",Prof);
export default Profile;