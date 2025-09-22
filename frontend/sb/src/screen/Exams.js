import React, { useState } from 'react'
import Nav from '../components/Nav'
import "../css/Button.css";
import Exam from '../components/Exam';
const blink = "https://studybuddy-jn19.onrender.com"
export default function Exams() {
    const [popped,setpopped] = useState(false);
    const [data,setdata] = useState([]);
    const [form,setform] = useState({
        subject: "",
        exam: "",
        progress: "",
        target: "",
        date:"",
        username: localStorage.getItem("username")
    })
    const HandleChange=(e)=>{
        setform({...form,[e.target.name]:e.target.value})
    }
    const AddExam=async()=>{
        const data = await fetch(blink+"/api/addexam",{
            method: "POST",
            headers:{
              "Content-Type":"application/json"
            },
            body:JSON.stringify(form)
          });
          const resp = await data.json();
          if(!resp.success){
            alert(resp.msg);
          }else{
            setpopped(!popped);
            setform({
                subject: "",
                exam: "",
                progress: "",
                target: "",
                date:"",
                username: localStorage.getItem("username")
            })
            getExam();
          }
    }

    const getExam=async()=>{
        const data = await fetch(blink+"/api/getexam",{
            method: "POST",
            headers:{
              "Content-Type":"application/json"
            },
            body:JSON.stringify({username: localStorage.getItem("username")})
          });
          const resp = await data.json();
          if(!resp.success){
            alert(resp.msg);
          }else{
            setdata(resp.data);
          }
    }

    useState(()=>{
        getExam();
    },[])
  return (
    <div>
        <Nav button={popped ? "Close":"Add Exam"} clicked={()=>setpopped(!popped)}/>

        <div className='Exams' style={popped ? {filter:"blur(10px)"}:{}}>
            {data ? data.map((items)=> <Exam func={getExam} id={items._id} subject={items.subject} hrs={items.hrs} target={items.target} name={items.name} date={items.date}/>):""}
        </div>
        
        {popped ?<div className='ExamInput'>
            <h1>Exam</h1>
            <input type='text' placeholder='Enter Subject Name' name="subject" value={form.subject} onChange={HandleChange}/>
            <input type='text' placeholder='Enter Exam Name' name="exam" value={form.exam} onChange={HandleChange}/>
            <input type='Number' placeholder='progress in Hours' name="progress" value={form.progress} onChange={HandleChange}/>
            <input type='Date' name="date" value={form.date} onChange={HandleChange}/>
            <input type='Number' placeholder='target in Hours' name="target" value={form.target} onChange={HandleChange}/>
            <button id='btn' onClick={AddExam}>Add Exam</button>
        </div>:""}
        
    </div>
  )
}
