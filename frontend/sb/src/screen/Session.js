import React, { useEffect, useState, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import "../css/Session.css"
import Pause from "../images/Pause.png"
const blink = "https://studybuddy-jn19.onrender.com"

export default function Session() {
    const { id } = useParams();
    const [data,setdata] = useState({});
    const [notes,setnotes]=useState(false);
    const [note,setnote]=useState("");
    const nav = useNavigate();
    const [timelines,settimes]=useState([]);
    const [minute,setminute]=useState(0);
    const [second,setsecond]=useState(0);
    const [index,setindex]=useState(0);
    const totalMinutesRef = useRef(0);
    const [act,setact] = useState(false);
    const divideTime=(time)=>{
        let times = [];
        while(time>0){
            if(time>=30){
                time=time-30
                times.push(25)
                times.push(5)
            }else if(time>=25 && time<30){
                times.push(25)
                times.push(time-25)
                time=0;
            }else{
                times.push(time);
                time=0;
            }
        }
        settimes(times);
        setact(true);
    }
    
    useEffect(()=>{
        let interval = null;
        if(timelines.length>0 && act){
            interval=setInterval(()=>{
                if(second==59){
                    setsecond(0);
                    setminute((prev)=> prev+1);
                    totalMinutesRef.current += 1;
                }else{
                    setsecond((prev)=> prev+1);
                }
                if(minute==timelines[index]-1 && second==59){
                    setminute(0);
                    setsecond(0);
                    totalMinutesRef.current += 1;
                    if(index<timelines.length-1){
                        setindex((prev)=>prev+1);
                    }else{
                        setact(false);
                        setData();
                    }
                }
            },1000)
        }else if(interval){
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    },[act, second, minute, index, timelines]);
    const CreateTimer=(data)=>{
        const dur = Math.abs((new Date(data.enddate)-new Date(data.startdate))/60000)-data.skipped-data.progress;
        divideTime(dur);
    }
    const setData=async()=>{
        const tot = totalMinutesRef.current;
        const data01 = await fetch(blink + "/api/pausesession", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              id: id,
              durcom: tot,
              note: note,
              status: data.progress+tot==0 ? "upcoming" :  Math.abs((new Date(data.enddate)-new Date(data.startdate))/60000)-data.progress-tot-data.skipped > 0 ? "ongoing" : "completed"
            })
        })
        const resp = await data01.json();
          if (!resp.success) {
            alert("Something went wrong");
          }
    }
    const getData=async()=>{
        const data01 = await fetch(blink + "/api/playsession", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              id: id
            })
          })
          const resp = await data01.json();
          if (!resp.success) {
            nav("/study");
          }else if(resp.data){
            setdata(resp.data);
            CreateTimer(resp.data);
            setnote(resp.note);
          }
    }
    useEffect(()=>{
        getData();
    },[])

    useEffect(() => {
        const handleBeforeUnload = (event) => {
            setData(); 
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);

    const handlePause=()=>{
        setData();
        nav("/study");
    }
    
  return (
    <div>
        <div className='head'>
            <h1>{data.subject}</h1>
            <img src={Pause} onClick={handlePause}/>
            <button id="btn11" onClick={()=>{setnotes(!notes)}}>{!notes ? "Add Notes":"Close"}</button>
        </div>
        <div className='Timer' style={notes ? {filter: "blur(10px)"}:{}}>
            <h1>{String(minute).padStart(2,'0')}:{String(second).padStart(2,'0')}</h1>
            {index%2==0 ? <h2>Study Time</h2>:<h2>Break Time</h2>}
            
            
        </div>
        {notes ? <div className='Notepad'>
                <textarea value={note} onChange={(e)=>setnote(e.target.value)}></textarea>
            </div>:""}

        <div className='warn'>
            <h2>Session Pause and Progress Handling</h2>
            <ol>
                <li>Pausing the session or reloading the page will reset the Pomodoro timer to a 25-minute study period.</li>
                <li>Any progress made up until that point will be saved and counted towards your total progress.</li>
            </ol>
        </div>
    </div>
  )
}
