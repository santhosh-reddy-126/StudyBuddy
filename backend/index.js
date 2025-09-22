import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const mongourl="mongodb+srv://Santhosh:Santhosh@cluster0.ldd9p.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
import router from "./Routes/One.js";
import router2 from "./Routes/Two.js";
import router3 from "./Routes/Three.js";
async function Connect() {
    try{
        const mongo = await mongoose.connect(mongourl)
        console.log("Connected to Database")
    }catch(e){
        console.log(e+"Error Connecting to Database")
    }
}

Connect();

const app = express()
const port = 3123
app.use(express.json());
app.use(cors());


app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "https://study-buddy-inky.vercel.app");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});


app.get("/", (req, res) => {
    res.send("<h1>Hello,I am Server</h1>");
});
app.use("/api/", router);
app.use("/api/", router2);
app.use("/api/", router3);
app.listen(port,()=>{
    console.log("Server Running on "+port)
})
