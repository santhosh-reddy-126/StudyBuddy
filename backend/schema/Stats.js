import mongoose,{ Schema } from "mongoose";

const Stats = new Schema({
    username: {
        type: String,
        required: true
    },
    weeklysesshours: {
        type: Number,
        default: 0
    },
    totalsesshours:{
        type: Number,
        default: 0
    }
})
const STATS = mongoose.model("Stats",Stats);
export default STATS;