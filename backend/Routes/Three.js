import express from "express";
const router = express.Router();
import mongoose from "mongoose";

mongoose.connect('mongodb+srv://Santhosh:Santhosh@cluster0.ldd9p.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => {
        console.log('MongoDB connected successfully');
    })
    .catch(err => console.error('MongoDB connection error:', err));


export default router;