import express from "express";
const router = express.Router();
import mongoose from "mongoose";
import Exam from "../schema/Exam.js";
import Profile from "../schema/Profile.js";
import STATS from "../schema/Stats.js";
mongoose.connect('mongodb+srv://Santhosh:Santhosh@cluster0.ldd9p.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => {
        console.log('MongoDB connected successfully');
    })
    .catch(err => console.error('MongoDB connection error:', err));
function StringtoDate(a){
    return new Date(new Date()+ (5.5 * 60 * 60 * 1000));
}
router.post("/addexam",async(req,res)=>{
    try{
        const data01 = await Exam.create({
            username: req.body.username,
            subject: req.body.subject,
            name: req.body.exam,
            hrs: req.body.progress,
            date: StringtoDate(req.body.date),
            target: req.body.target
        })
        res.send({success: true});
    }catch(e){
        res.send({success: false,msg:"Something went wrong!"});
        console.log(e);
    }
})

router.post("/getexam",async(req,res)=>{
    try{
        const data01 = await Exam.find({
            username: req.body.username
        })
        res.send({success: true, data: data01});
    }catch(e){
        res.send({success: false,msg:"Something went wrong!"});
        console.log(e);
    }
})

router.post("/deleteexam",async(req,res)=>{
    try{
        const data01 = await Exam.deleteOne({
            _id: req.body.id
        })
        res.send({success: true});
    }catch(e){
        res.send({success: false,msg:"Something went wrong!"});
        console.log(e);
    }
})

router.post("/updateexam",async(req,res)=>{
    try{
        const data01 = await Exam.updateOne({
            _id: req.body.id
        },{$set: {hrs: parseInt(req.body.hrs)}});
        res.send({success: true});
    }catch(e){
        res.send({success: false,msg:"Something went wrong!"});
        console.log(e);
    }
})


router.post("/getProfile",async(req,res)=>{
    try{
        const data = await Profile.findOne({
            username: req.body.username
        })
        const data2 = await STATS.findOne({
            username: req.body.username
        })
        res.send({success: true,data: data,statdata: data2});
    }catch(e){
        res.send({success: false,msg:"Something went wrong!"});
        console.log(e);
    }
})


router.post("/getFriend",async(req,res)=>{
    try{
        const data = await Profile.find({})
        res.send({success: true,data: data});
    }catch(e){
        res.send({success: false,msg:"Something went wrong!"});
        console.log(e);
    }
})
export default router;