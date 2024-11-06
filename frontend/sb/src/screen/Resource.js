import React, { useEffect, useState,useRef } from 'react'
import Nav from "../components/Nav.js"
import GoogleOAuth from './GoogleOAuth.js'
import "../css/Future.css"
import FIle from '../components/FIle.js'
const blink = "http://localhost:3123"
export default function Resource() {
  const [data, setdata] = useState([]);
  const googleRef = useRef();
  
  const handleDelete = (fileId) => {
    console.log("Requesting to delete file with ID:", fileId);
        if (googleRef.current) {
            googleRef.current.deleteFileById(fileId);
        } else {
            console.error("GoogleDriveUserUpload ref is not set");
        }
  };
  const getFiles = async () => {
    const data1 = await fetch(blink + "/api/getFiles", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username: localStorage.getItem("username") })
    });
    const resp = await data1.json();
    if (!resp.success) {
      alert("Sorry,Unable to fetch files");
    } else {
      let raw_data = resp.data;
      const groupedUsers = raw_data.reduce((accumulator, user) => {
        if (!accumulator[user.subject]) {
          accumulator[user.subject] = [];
        }
        accumulator[user.subject].push(user);
        return accumulator;
      }, {});
      const groupedArray = Object.entries(groupedUsers).map(([subject, raw_data]) => ({
        subject,
        raw_data,
      }));
      console.log(groupedArray);
      setdata(groupedArray)
    }
  }
  
  useEffect(() => {
    getFiles();
  }, [])

  return (
    <div><Nav/>
      <GoogleOAuth func={getFiles} ref={googleRef}/>
      <div className="UserFiles">
        {localStorage.getItem("logged")===true ? <div><h1>Your Files</h1>
        <div className='userfiles2'>
          {data ? data.map((items) => (
            <div>
              <h1>{items.subject}</h1>
              <div className='userfiles3'>
                {items.raw_data ? items.raw_data.map((units)=>{
                  return <FIle title={units.filename} id={units.id} delfunc={handleDelete} url={units.url}/>
                }):""}
              </div><hr/>
            </div>
          )) : ""}

        </div></div>:""}
        
      </div>
    </div>


  )
}


