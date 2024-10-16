import React, { useEffect, useState } from 'react'
import "../css/Lecture.css"
import del from "../images/delete.png"
const blink = "http://localhost:3123"
export default function AssignmentUnit(props) {
  const [date, setdate] = useState("");
  const [time, settime] = useState("");
  const [prog, setprog] = useState("");
  const [inp, setin] = useState(false);
  const getdateandtime = () => {
    let storedDate = new Date(props.date);
    const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    setdate(weekdays[storedDate.getDay()] + ", " + storedDate.getDate() + " " + months[storedDate.getMonth()] + " " + storedDate.getFullYear());
    storedDate.setTime(storedDate.getTime() - (5.5 * 60 * 60 * 1000));
    settime((storedDate.getHours() > 12 ? storedDate.getHours() - 12 : storedDate.getHours()) + ":" + (storedDate.getMinutes() == 0 ? storedDate.getMinutes() + "0" : storedDate.getMinutes()) + " " + (storedDate.getHours() > 12 ? "PM" : "AM"));
  }
  const updateProgress = async () => {
    if (inp) {
      const data = await fetch(blink + "/api/updateProgress", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ id: props.id , prog: prog})
      });
      const resp = await data.json();
      if (resp.success) {
        props.func();
      } else {
        alert("Something is wrong!");
      }
    }
    setin(!inp);
  }
  const handleDelete = async () => {
    const data = await fetch(blink + "/api/deleteAssignment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ id: props.id })
    });
    const resp = await data.json();
    if (resp.success) {
      props.func();
    } else {
      alert("Something is wrong!");
    }
  }
  useEffect(() => {
    getdateandtime();
  }, [])
  return (
    <div className="Future2" onDoubleClick={updateProgress}>
      <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ textAlign: "left", color: "#FF2E63" }}>{props.sub}</h2> <img src={del} width={20} height={20} onClick={handleDelete} />
      </div>
      <div style={{display:'flex',justifyContent:'space-between'}}>
        <h3 style={{ color: "#FF2E63" }}>{props.fac}</h3>
        <h3 style={{ color: "#FF2E63" }}>{props.progress}%</h3>
        <h3 style={{ color: "#FF2E63" }}>{Math.round((props.progress / 100) * props.dur * 1000) / 1000}hrs</h3>
      </div>
      {inp ? <input type='number' placeholder='progress' value={prog} onChange={(e) => setprog(e.target.value)} /> : <div style={{width:`${(props.progress/100)*400}px`,backgroundColor:"red",height:"3px"}}></div>}
      <hr />
      <p>{props.note}</p>
      <div className='dt'>
        <p>{date}</p>
        <p>{time}</p>
      </div>
    </div>
  )
}
