import React, { useState } from 'react'
import "../css/Lecture.css"
import { useNavigate } from 'react-router-dom';
const blink = "https://studybuddy-jn19.onrender.com"
const colorPalette = {
    "colors": {
        "easy": {
            "background": "rgba(168, 230, 206, 1)",
            "font": "rgba(37, 42, 52, 1)"
        },
        "medium": {
            "background": "rgba(255, 213, 79, 1)",
            "font": "rgba(37, 42, 52, 1)"
        },
        "hard": {
            "background": "rgba(255, 111, 64, 1)",
            "font": "rgba(255, 255, 255, 1)"
        },
        "neutral": {
            "background": "rgba(74, 74, 74, 1)",
            "font": "rgba(234, 234, 234, 1)"
        }
    }
}


export default function Lecture(props) {
    const [pop,setpop]=useState(false);
    const nav = useNavigate();
    const deletes=async()=>{
        const data = await fetch(blink+"/api/deleteclass",{
          method: "POST",
          headers:{
            "Content-Type":"application/json"
          },
          body:JSON.stringify({
            username: localStorage.getItem("username"),
            day: props.day,
            fh: props.fh,
            fm: props.fm,
            fs: props.fs
          })
        });
        const resp = await data.json();
        if(!resp.success){
          alert("Couldnt delete");
        }else{
          setpop(!pop);
          window.location.reload();
        }
      }
    return (
        <div>
        <div class="MainLecture" onDoubleClick={()=>setpop(!pop)} style={pop?{ backgroundColor: colorPalette.colors[props.diff].background, color: colorPalette.colors[props.diff].font,filter:"blur(5px)"}:{ backgroundColor: colorPalette.colors[props.diff].background, color: colorPalette.colors[props.diff].font}}>
            <span>{props.sub}</span>
            <span>{props.time}</span>
            <span>{props.dur}</span>
            <span>{props.faculty}</span>
        </div>
        {pop ? <div className='popup2'>
            <h3 style={{color:"#EAEAEA"}}>Are you sure you want to delete {props.sub} class</h3>
            <button id="btn" onClick={deletes}>Delete</button>
            <button id="btn" onClick={()=>setpop(!pop)}>Cancel</button>
        </div>:""}
        </div>


    )
}
