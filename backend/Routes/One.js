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

        if (time.period === 'PM' && hours !== 12) {
            hours += 12;
        } else if (time.period === 'AM' && hours === 12) {
            hours = 0;
        }

        return hours * 60 + minutes;
    };

    const startMinutes = convertToMinutes(startTime);
    const endMinutes = convertToMinutes(endTime);
    let diffMinutes = endMinutes - startMinutes;
    if (diffMinutes < 0) {
        diffMinutes += 24 * 60;
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
            res.send({ success: true, data: data00.class, words: data00.words });
        }
    } catch (e) {
        res.send({ success: false, msg: "something went wrong" });
        console.log(e);
    }
})
const week = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
function timeToMinutes(hour, minute, period) {
    hour = parseInt(hour, 10);
    minute = parseInt(minute, 10);
    const hh = (period === "PM" && hour !== 12) ? hour + 12 : (period === "AM" && hour === 12) ? 0 : hour;
    return hh * 60 + minute;
}

function sortByDay(array, day) {
    const class1 = array.filter(item => item.day === week[day.getDay()]);
    return class1.sort((a, b) => {
        const aStartTime = timeToMinutes(a.fh, a.fm, a.fs);
        const bStartTime = timeToMinutes(b.fh, b.fm, b.fs);
        return aStartTime - bStartTime;
    });
}



router.post("/getRecentClass", async (req, res) => {
    try {
        const data = await user.findOne({ username: req.body.username });
        let istOffset = 5 * 60 * 60 * 1000 + 30 * 60 * 1000;
        let MyDay = new Date();
        MyDay = new Date(MyDay.getTime() + istOffset);
        let maxiter = 7;
        let iter = 0;
        while (iter < maxiter) {
            if (sortByDay(data.class, MyDay).length != 0) {
                let k = sortByDay(data.class, MyDay);
                let tim1 = timeToMinutes(k[k.length - 1].th, k[k.length - 1].tm, k[k.length - 1].ts);
                let tim2 = MyDay.getUTCHours() * 60 + MyDay.getUTCMinutes();
                if (tim2 < tim1) {
                    break;
                }
            }
            MyDay.setDate(MyDay.getDate() + 1);
            iter = iter + 1;
        }
        const sortedClass = sortByDay(data.class, MyDay)
        let noOfdays = Math.abs(new Date().getDay() - week.indexOf(sortedClass[0].day));
        if(noOfdays>1){
            noOfdays=noOfdays-1;
        }else{
            noOfdays=0;
        }
        let tim3 = MyDay.getUTCHours() * 60 + MyDay.getUTCMinutes(); 
        let sent = false;
        if (!sent && iter > 0) {
            sent = true;
            let rem = timeToMinutes(sortedClass[0].fh, sortedClass[0].fm, sortedClass[0].fs) - tim3;
            if (rem < 0) {
                iter = iter - 1;
                rem = 1440 + rem;
            }
            res.send({ success: true, ongoing: false, remaining: rem, data: sortedClass[0], days: noOfdays });
        }
        for (let i = 0; i < sortedClass.length; i++) {
            if (timeToMinutes(sortedClass[i].fh, sortedClass[i].fm, sortedClass[i].fs) <= tim3 && tim3 <= timeToMinutes(sortedClass[i].th, sortedClass[i].tm, sortedClass[i].ts) && !sent) {
                sent = true;
                res.send({ success: true, ongoing: true, remaining: timeToMinutes(sortedClass[i].th, sortedClass[i].tm, sortedClass[i].ts) - tim3, data: sortedClass[i], days: 0 });
                break;
            }
        }
        for (let i = 0; i < sortedClass.length; i++) {
            if (timeToMinutes(sortedClass[i].fh, sortedClass[i].fm, sortedClass[i].fs) >= tim3 && !sent) {
                res.send({ success: true, ongoing: false, remaining: timeToMinutes(sortedClass[i].fh, sortedClass[i].fm, sortedClass[i].fs) - tim3, data: sortedClass[i], days: noOfdays });
                break;
            }
        }

    } catch (e) {
        console.log(e);
    }
});

router.post("/deleteclass", async (req, res) => {
    try {
        let data01 = await user.findOne({
            username: req.body.username
        });
        let Deletesone = {};
        data01 = data01.class;
        for (let i = 0; i < data01.length; i++) {
            if (data01[i].day === req.body.day && data01[i].fh === req.body.fh && data01[i].fm === req.body.fm && data01[i].fs === req.body.fs) {
                Deletesone = data01[i];
                break;
            }
        }
        const data02 = await user.updateOne({
            username: req.body.username
        }, { $pull: { class: Deletesone } });
        res.send({ success: true, msg: "something went wrong" });
    } catch (e) {
        res.send({ success: false, msg: "something went wrong" });
    }

})

export default router;
