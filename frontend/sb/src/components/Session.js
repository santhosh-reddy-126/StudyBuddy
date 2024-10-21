import React, { useState } from 'react'
import "../css/Study.css"
import play from "../images/play.png";
import del from "../images/delete2.png";
import { useNavigate } from 'react-router-dom';
const blink = "http://localhost:3123"
export default function Session(props) {
  const sdate = new Date(new Date(props.sdate).getTime()-(5.5 * 60 * 60 * 1000));
  const edate = new Date(new Date(props.edate).getTime()-(5.5 * 60 * 60 * 1000));
  const nav = useNavigate();
  const duration = Math.max(0, Math.abs((edate - sdate) / 60000) - props.prog-props.skip);
  const duration2 = Math.max(0, Math.abs((edate - sdate) / 60000));
  const formatTime = (date) => {
    let hours = date.getHours();
    let minutes = date.getMinutes() === 0 ? '00' : date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'

    return `${String(hours).padStart(2,'0')}:${String(minutes).padStart(2,'0')} ${ampm}`;
};

  const handleDelete=async()=>{
    const data01 = await fetch(blink + "/api/deletesession", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        id: props.id
      })
    })
    const resp = await data01.json();
    if (!resp.success) {
      alert(resp.msg);
    }else{
      props.func();
    }
  }
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return (
    <div style={{position:"relative"}}>

    
    <div className='sessionUnit'>
      <div className='Theory'>
        <h1>{props.subject}</h1>
        <h4>{sdate.getDate()+" "+months[sdate.getMonth()]+","+sdate.getFullYear()}</h4>
        <h4>{formatTime(sdate)} - {formatTime(edate)}</h4>
        <h4>{duration}mins left</h4>
        <h4>{props.skip>0 ? `You Skipped ${props.skip} mins`:""}</h4>
      </div>
      <div className='visual'>
          <img src={play} width={100} height={100} onClick={()=>{nav("/study/session/"+props.id)}}/>
          {(props.prog + props.skip) ==0 ? <h2>Start</h2>: (props.prog+props.skip)>=duration2 ? <h2>Completed</h2>:<h2>Resume</h2>}
      </div>
    </div>
    <div className='delete'>
      {props.del ? <img src={del} width={30} height={30} onClick={handleDelete}/>:""}
    </div>
    </div>
  )
}
