import React, { useState } from 'react'
import Logo from "../images/logo.jpg";
import boy from "../images/Login.jpg";
import Nav from '../components/Nav';
import "../css/Input.css"
import axios from 'axios';
import "../css/Home.css";
import Button from '../components/Button';
import { Link, useNavigate } from 'react-router-dom';
const blink = "https://studybuddy-jn19.onrender.com"
export default function Home() {
  const nav = useNavigate();
  const [data, setdata] = useState({
    name: "",
    pass: ""
  });
  axios.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers['Authorization'] = token;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  const [msg, setmsg] = useState("");
  const sendData = async () => {
    if (data.name.length == 0) {
      setmsg("Username is required")
    } else {
      const newReq01 = await fetch(blink + "/api/loginuser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: data.name,
          pass: data.pass
        })

      })
      const resp01 = await newReq01.json();
      if (!resp01.success) {
        setmsg(resp01.msg);
      }else{
          localStorage.setItem('token', resp01.token);
          console.log(resp01.token);
          localStorage.setItem("username",data.name);
          nav("/");
      }
    }

  }

  const handleChange = (e) => {
    setdata({ ...data, [e.target.name]: e.target.value });
  }
  return (
    <div>
     <Nav />
      <div className='items'>
        <div>
          <div id="form">
            <h1>Login</h1>
            <div className="form">
              <input name="name" value={data.name} autoComplete='off' onChange={handleChange} className="input" placeholder="Username" type="text" />
              <span className="input-border"></span>
            </div><br />
            <div className="form">
              <input name="pass" value={data.pass} onChange={handleChange} className="input" placeholder="Password" type="password" />
              <span className="input-border"></span>
            </div>
            {msg != "" ? <h3 style={{ color: "#FF2E63" }}>{msg}</h3> : ""}
            <Button name="Login" oc={sendData} />
            <p>New User?<Link to="/register" id="Link"> Register</Link></p>
          </div>
        </div>
        <div>
          <img src={boy} id="Boy"/>
        </div>

      </div>

    </div>
  )
}
