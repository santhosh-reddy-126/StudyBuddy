import express from "express";
const router = express.Router();
import mongoose from "mongoose";
import user from "../schema/User.js";
import STATS from "../schema/Stats.js";
import Study from "../schema/Study.js";
import file from "../schema/Files.js"
import assign from "../schema/Assignment.js";
mongoose.connect('mongodb+srv://Santhosh:Santhosh@cluster0.ldd9p.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => {
        console.log('MongoDB connected successfully');
    })
    .catch(err => console.error('MongoDB connection error:', err));

router.post("/addAssignment", async (req, res) => {
    try {
        const Userdata = req.body;
        const [hours, minutes] = (Userdata.Time).split(':');
        const MongoData = {
            subject: Userdata.Subject,
            faculty: Userdata.Faculty,
            Deadline: new Date(new Date(Userdata.Date).setHours(hours, minutes, 0) + (5.5 * 60 * 60 * 1000)),
            Importance: Userdata.Importance,
            Note: Userdata.Note,
            TimeItTakes: Userdata.Hours,
            Username: Userdata.username
        }

        const data01 = await assign.create(MongoData);


        // // Below is code for suggestion words
        // const data08 = await user.findOne({
        //     username: Userdata.username
        // });
        // const newWords = [];

        // if (!data08.words.includes(Userdata.Subject)) {
        //     newWords.push(Userdata.Subject);
        // }

        // if (!data08.words.includes(Userdata.Faculty)) {
        //     newWords.push(Userdata.Faculty);
        // }


        // if (newWords.length > 0) {
        //     const data02 = await user.updateOne(
        //         { username: Userdata.username },
        //         { $push: { words: { $each: newWords } } }
        //     );
        // }
        res.send({ success: true });
    } catch (e) {
        console.log(e);
        res.send({ success: false });
    }
});

router.post("/getAssignment", async (req, res) => {
    try {
        const data = await assign.find({
            Username: req.body.username
        });
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7); 

        if (sevenDaysAgo.getDay() === 0) {
            const result = await Study.deleteMany({
                startdate: { $lt: sevenDaysAgo }
            });
        }
        res.send({ success: true, data: data });
    } catch (e) {
        console.log(e);
        res.send({ success: false });
    }
})

router.post("/updateProgress", async (req, res) => {
    try {
        const data = await assign.updateOne({
            _id: req.body.id
        }, { $set: { Progress: req.body.prog } });
        res.send({ success: true });
    } catch (e) {
        console.log(e);
        res.send({ success: false });
    }
})

router.post("/deleteAssignment", async (req, res) => {
    try {
        const data = await assign.deleteOne({
            _id: req.body.id
        });
        res.send({ success: true });
    } catch (e) {
        console.log(e);
        res.send({ success: false });
    }
})


router.post("/getRecent", async (req, res) => {
    try {
        let assigns = [];

        const data = await assign.findOne({
            Username: req.body.username,
            Importance: "Game Changing"
        }).sort({ Deadline: 1 });
        const data1 = await assign.findOne({
            Username: req.body.username,
            Importance: "Considerable"
        }).sort({ Deadline: 1 });
        const data2 = await assign.findOne({
            Username: req.body.username,
            Importance: "Negligible"
        }).sort({ Deadline: 1 });
        if (data) {
            assigns.push(data);
        }
        if (data1) {
            assigns.push(data1);
        }
        if (data2) {
            assigns.push(data2);
        }


        let sessions = [];
        const data3 = await Study.findOne({
            username: req.body.username,
            status: "ongoing"
        }).sort({ startdate: 1 });
        if (data3) {
            sessions.push(data3)
        }
        const data4 = await Study.findOne({
            username: req.body.username,
            status: "upcoming"
        }).sort({ startdate: 1 });
        if (data4) {
            sessions.push(data4)
        }
        res.send({ success: true, data: assigns[0], sessdata: sessions[0] });
    } catch (e) {
        console.log(e);
        res.send({ success: false });
    }
})

router.post("/uploadFile", async (req, res) => {
    try {
        const data = await file.findOne({
            username: req.body.username
        })
        if (!data) {
            const data2 = await file.create({
                username: req.body.username
            })
        }
        const obj = {
            filename: req.body.filename,
            subject: req.body.subject,
            url: req.body.url,
            id: req.body.id
        }
        const data3 = await file.updateOne({
            username: req.body.username
        }, { $push: { Files: obj } });
        res.send({ success: true });
    } catch (e) {
        console.log(e)
        res.send({ success: false });
    }
})



router.post("/getFiles", async (req, res) => {
    try {
        const data1 = await file.findOne({
            username: req.body.username
        })
        if (data1) {
            res.send({ success: true, data: data1.Files });
        } else {
            res.send({ success: false });
        }
    } catch (e) {
        console.log(e);
        res.send({ success: false });
    }
})


router.post("/deleteFile", async (req, res) => {
    try {
        const data1 = await file.updateOne({
            username: req.body.username
        },
            { $pull: { Files: { id: req.body.id } } });
        res.send({ success: true });
    } catch (e) {
        console.log(e);
        res.send({ success: false });
    }
})


router.post("/createsession", async (req, res) => {
    try {
        const start = new Date(new Date(`${req.body.data.date}T${req.body.data.stime}:00`).getTime() + (5.5 * 60 * 60 * 1000));
        const end = new Date(new Date(`${req.body.data.date}T${req.body.data.etime}:00`).getTime() + (5.5 * 60 * 60 * 1000))
        const base = new Date(new Date().getTime() + (5.5 * 60 * 60 * 1000));
        if (start <= end && base <= start && base <= end) {
            const data1 = await Study.create({
                username: req.body.username,
                subject: req.body.data.Subject,
                startdate: start,
                enddate: end
            });
            res.send({ success: true });
        } else {
            res.send({ success: false, msg: "Please enter valid times" });
        }

    } catch (e) {
        console.log(e);
        res.send({ success: false });
    }
})

router.post("/getsession", async (req, res) => {
    try {
        const base = new Date(new Date().getTime() + (5.5 * 60 * 60 * 1000));

        const updatesProgress = await Study.updateMany(
            {
                startdate: { $lt: base }  // Only update documents where startdate < base
            },
            [
                {
                    $set: {
                        skipped: {
                            $trunc: {
                                $divide: [{ $subtract: [base, "$startdate"] }, 60000]  // Calculate the time difference in minutes and truncate the result
                            }
                        },
                        status: "ongoing"
                    }
                }
            ]
        );

        const updatesProgress2 = await Study.updateMany(
            {
                enddate: { $lt: base }  // Only update documents where startdate < base
            },
            [
                {
                    $set: {
                        status: "completed"
                    }
                }
            ]
        );

        const getcompleted = await Study.find({
            username: req.body.username,
            status: "completed"
        });
        let total_hrs = 0;
        for (let k = 0; k < getcompleted.length; k++) {

            const sdate = new Date(new Date(getcompleted[k].startdate).getTime() - (5.5 * 60 * 60 * 1000));
            const edate = new Date(new Date(getcompleted[k].enddate).getTime() - (5.5 * 60 * 60 * 1000));
            const duration2 = Math.max(0, Math.abs((edate - sdate) / 60000));
            if (0.75 * duration2 < getcompleted[k].progress) {
                total_hrs += duration2;
            }
        }
        const check = await STATS.findOne({
            username: req.body.username
        });
        if (check) {
            const updateStats = await STATS.updateOne({
                username: req.body.username
            }, {
                $inc: { weeklysesshours: Number(total_hrs), totalsesshours: Number(total_hrs) }
            })
        } else {
            const check2 = await STATS.create({
                username: req.body.username
            });
            const updateStats = await STATS.updateOne({
                username: req.body.username
            }, {
                $inc: { weeklysesshours: Number(total_hrs), totalsesshours: Number(total_hrs) }
            })
        }


        const data1 = await Study.find({
            username: req.body.username
        });
        if (data1.length > 0) {
            res.send({ success: true, data: data1 });
        } else {
            res.send({ success: false, msg: "" });
        }
    } catch (e) {
        console.log(e);
        res.send({ success: false, msg: "Something is wrong" });
    }
})


router.post("/playsession", async (req, res) => {
    try {
        const base = new Date(new Date().getTime() + (5.5 * 60 * 60 * 1000));
        const data = await Study.findById(req.body.id);
        if (data && data.startdate <= base) {
            res.send({ success: true, data: data })
        } else if (data && data.startdate > base) {
            res.send({ success: false, msg: "Time not started" })
        } else {
            res.send({ success: false, msg: "Something went wrong" })
        }
    } catch (e) {
        console.log(e);
        res.send({ success: false, msg: "Something went wrong" })
    }
})

router.post("/pausesession", async (req, res) => {
    try {
        const updatedDocument = await Study.findByIdAndUpdate(
            req.body.id,
            {
                $inc: { progress: Number(req.body.durcom) },
                $set: { status: req.body.status }
            },
            { new: true }
        );
        console.log(req.body);
        if (updatedDocument) {
            res.send({ success: true })
        } else {
            res.send({ success: false })
        }
    } catch (e) {
        console.log(e);
        res.send({ success: false })
    }
})



router.post("/deletesession", async (req, res) => {
    try {
        const updatedDocument = await Study.deleteOne({
            _id: req.body.id
        });
        res.send({ success: true })

    } catch (e) {
        console.log(e);
        res.send({ success: false, msg: "Something went wrong" })
    }
})
export default router;