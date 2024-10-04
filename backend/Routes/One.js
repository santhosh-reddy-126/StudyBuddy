import express from "express";
const router = express.Router();
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import user from "../schema/User.js"
import jsonwebtoken from "jsonwebtoken";
const jsecret = "thisismystudybuddyappletsstudy";
mongoose.connect('mongodb+srv://Santhosh:Santhosh@cluster0.ldd9p.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => {
        console.log('MongoDB connected successfully');
    })
    .catch(err => console.error('MongoDB connection error:', err));
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).json({ success: false, message: 'No token provided' });

    jwt.verify(token, jsecret, (err, decoded) => {
        if (err) return res.status(500).json({ success: false, message: 'Failed to authenticate token' });
        req.userId = decoded.id;
        next();
    });
};
router.post("/createuser", async (req, res) => {
    const salt = await bcrypt.genSalt(10);
    let secpass = await bcrypt.hash(req.body.pass, salt);
    try {
        const data = await user.findOne({ username: req.body.name });
        if (!data) {
            const data2 = await user.create({
                username: req.body.name,
                password: secpass
            })
            res.send({ success: true });

        } else {
            res.send({ success: false, msg: "Username not available" });
        }
    } catch (e) {
        console.log(e);
        res.send({ success: false, msg: "Error creating User" });
    }

})

router.post("/loginuser", async (req, res) => {
    try {
        const data = await user.findOne({ username: req.body.name });
        if (!data) {
            res.send({ success: false, msg: "Try any other unsername" });
        }
        const pwdcompare = await bcrypt.compare(req.body.pass, data.password);
        if (!pwdcompare) {
            return res.status(400).json({ success: "false", message: "Wrong password!!" })
        } else {
            const token = jsonwebtoken.sign({ username: user.username }, jsecret, { expiresIn: '2h' });
            return res.json({ success: true, token: token })
        }
    } catch (e) {
        console.log(e);
        return res.status(400).json({ success: "false", message: "Error logging in" })
    }
})


router.get('/', verifyToken, (req, res) => {
    res.json({ message: 'Welcome to the dashboard!', userId: req.userId });
});

function calculateDuration12Hour(startTime, endTime) {
    const convertToMinutes = (time) => {
        let hours = parseInt(time.hours);
        let minutes = parseInt(time.minutes);

        // Handle AM/PM conversion
        if (time.period === 'PM' && hours !== 12) {
            hours += 12; // Convert PM hours to 24-hour format
        } else if (time.period === 'AM' && hours === 12) {
            hours = 0; // Convert 12 AM to 0 (midnight)
        }

        return hours * 60 + minutes;
    };

    const startMinutes = convertToMinutes(startTime);
    const endMinutes = convertToMinutes(endTime);

    // If endMinutes is less than startMinutes, assume the time crosses midnight
    let diffMinutes = endMinutes - startMinutes;
    if (diffMinutes < 0) {
        diffMinutes += 24 * 60; // Add 24 hours in minutes
    }

    const diffHours = Math.floor(diffMinutes / 60);
    const remainingMinutes = diffMinutes % 60;

    return [diffHours, remainingMinutes];
}




router.post("/addclass", async (req, res) => {
    const data = req.body;
    let dur = calculateDuration12Hour({ hours: data.fh, minutes: data.fm, period: data.fs },
        { hours: data.th, minutes: data.tm, period: data.ts }
    )
    console.log({ hours: data.fh, minutes: data.fm, period: data.fs }, { hours: data.th, minutes: data.tm, period: data.ts })
    data.dur = dur;
    try {
        const data01 = await user.updateOne({
            username: data.username
        }, { $push: { class: data } });
        if (data01) {
            res.send({ success: true });
        }
        const data08 = await user.findOne({
            username: data.username
        });
        const newWords = [];

        if (!data08.words.includes(data.sub)) {
            newWords.push(data.sub);
        }

        if (!data08.words.includes(data.fac)) {
            newWords.push(data.fac);
        }


        if (newWords.length > 0) {
            const data02 = await user.updateOne(
                { username: data.username },
                { $push: { words: { $each: newWords } } }
            );
        }



    } catch (e) {
        res.send({ succes: false, msg: "something went wrong" });
    }

})

router.post("/getClass", async (req, res) => {
    try {
        const data00 = await user.findOne({
            username: req.body.username
        });

        if (data00) {
            console.log("ss");
            res.send({ success: true, data: data00.class, words: data00.words });
        }
    } catch (e) {
        res.send({ success: false, msg: "something went wrong" });
        console.log(e);
    }
})

router.post("/deleteclass", async (req, res) => {
    try {
        let data01 = await user.findOne({
            username: req.body.username
        });
        console.log(req.body);
        let Deletesone = {};
        data01 = data01.class;
        console.log(typeof (data01))
        for (let i = 0; i < data01.length; i++) {
            if (data01[i].day === req.body.day && data01[i].fh === req.body.fh && data01[i].fm === req.body.fm && data01[i].fs === req.body.fs) {
                Deletesone = data01[i];
                break;
            }
        }
        console.log(Deletesone);
        const data02 = await user.updateOne({
            username: req.body.username
        }, { $pull: { class: Deletesone } });
        res.send({ success: true, msg: "something went wrong" });
    } catch (e) {
        res.send({ success: false, msg: "something went wrong" });
    }

})

export default router;