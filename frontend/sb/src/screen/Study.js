import React, { useEffect, useState } from 'react'
import Nav from '../components/Nav'
import "../css/Study.css"
import Session from '../components/Session';
const blink = "http://localhost:3123"
export default function Study() {
  const [popped, setpopped] = useState(false);
  const [Data, setData] = useState([]);
  const [data, setdata] = useState({
    Subject: "",
    date: "",
    stime: "",
    etime: ""
  })
  const toggle = () => {
    setpopped(!popped);
  }
  const handleChange = (e) => {
    setdata({ ...data, [e.target.name]: e.target.value });
  }

  const getData = async () => {
    const data01 = await fetch(blink + "/api/getsession", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: localStorage.getItem("username")
      })
    })
    const resp = await data01.json();
    if (!resp.success && resp.msg != "") {
      alert(resp.msg);
    } else {
      setData(resp.data);
    }
  }
  const CreateStudy = async () => {
    const data01 = await fetch(blink + "/api/createsession", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: localStorage.getItem("username"),
        data: data
      })
    })
    const resp = await data01.json();
    if (!resp.success && !resp.msg) {
      alert("Something went wrong");
    }else if(!resp.success){
      alert(resp.msg);
    } else {
      setpopped(!popped);
      setdata({
        Subject: "",
        date: "",
        stime: "",
        etime: ""
      })
      getData();
    }
  }
  useEffect(() => {
    getData();
  }, [])

  return (
    <div>
      <Nav button={popped ? "close" : "create"} clicked={toggle} />
      <div className='session'>
        <div className='sessions' style={popped ? { filter: "blur(3px)" } : {}}>
          <h1>Ongoing</h1>
          <div className='one'>
            {Data ? Data.map((items) => (
              items.status === "ongoing" ? <Session subject={items.subject} sdate={items.startdate} edate={items.enddate} prog={items.progress} id={items._id} skip={items.skipped} func={getData} del={true}/> : ""
            )) : ""}
          </div>
          <h1>Upcoming</h1>
          <div className='one'>
            {Data ? Data.map((items) => (
              items.status === "upcoming" ? <Session subject={items.subject} sdate={items.startdate} edate={items.enddate} prog={items.progress} id={items._id} skip={items.skipped} func={getData} del={true}/> : ""
            )) : ""}
          </div>
          <h1>Completed</h1>
          <div className='one'>
            
            {Data ? Data.map((items) => (
              items.status === "completed" || items.status === "updated" ? <Session subject={items.subject} sdate={items.startdate} edate={items.enddate} prog={items.progress} id={items._id} skip={items.skipped} func={getData} del={true}/> : ""
            )) : ""}
          </div>
        </div>
        {popped ? <div className='forms'>
          <h1>Create a Study Session</h1>
          <input type="text" placeholder='Subject' name="Subject" value={data.Subject} onChange={handleChange} />
          <input type="date" placeholder='Date' name="date" value={data.date} onChange={handleChange} />
          <div>
            <label>Start Time: </label><br />
            <input type="time" name="stime" value={data.stime} onChange={handleChange} />
          </div>
          <div>
            <label>End Time: </label><br />
            <input type="time" name="etime" value={data.etime} onChange={handleChange} />
          </div>
          <button id='btn11' onClick={CreateStudy}>Create</button>
        </div> : ""}
        <div className='warn'>
            <h2>Weekly Challenge Progress Criteria</h2>
            <ol>
                <li>Your study session will only contribute to weekly challenges if your progress time exceeds 75% of the total session time.</li>
                <li>Ensure that you skip sessions that are less than 25% of the total duration.</li>
                <li>Sessions will be deleted every Sunday, 7 days after their start date.</li>
            </ol>
        </div>
      </div>
    </div>
  )
}
