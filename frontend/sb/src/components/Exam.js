import React,{useState} from 'react';
import "../css/Button.css"; 
const blink = "https://studybuddy-jn19.onrender.com"
export default function Exam(props) {
  const [edit,setedit]=useState(false);
  const [hours,sethours]=useState(props.hrs);
  const toggle=async()=>{
      const data = await fetch(blink+"/api/updateexam",{
        method: "POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({id: props.id,
          hrs: hours
        })
      });
      const resp = await data.json();
      if(!resp.success){
        alert(resp.msg);
      }else{
        props.func();
      }
      setedit(!edit);
  }
  const deleteExam=async()=>{
    const data = await fetch(blink+"/api/deleteexam",{
        method: "POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({id: props.id})
      });
      const resp = await data.json();
      if(!resp.success){
        alert(resp.msg);
      }else{
        props.func();
      }
  }
  return (
    <div className="ExamCard">
      <h2 className="Examsubject">{props.subject}</h2>
      <p><strong>Name:</strong> {props.name}</p>
      <p><strong>Date:</strong> {props.date}</p>
      {edit ? (
        <input
          type="number"
          value={hours}
          onChange={(e) => sethours(e.target.value)}
          className="edit-input"
        />
      ) : (
        <p><strong>Hours Completed:</strong> {hours}</p>
      )}
      <p><strong>Target Hours:</strong> {props.target}</p>
      <div className="ExamButtons">
        <button className="btn" onClick={toggle}>
          {edit ? "Submit" : "Edit"}
        </button>
        <button className="btn" onClick={deleteExam}> Delete</button>
      </div>
    </div>
  );
}

