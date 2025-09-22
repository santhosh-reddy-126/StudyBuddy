import React, { useEffect, useState } from 'react'
import Logo from "../images/logo.jpg";
import boy from "../images/Login.jpg";
import "../css/Home.css";
import "../css/Button.css"
import Button from '../components/Button';
import { Link, useNavigate } from 'react-router-dom';
const blink = "https://studybuddy-jn19.onrender.com"
export default function Register() {
  const nav = useNavigate();
  const [data, setdata] = useState({
    name: "",
    pass: "",
    cpass: ""
  });
  const [msg, setmsg] = useState("");
  const handleChange = (e) => {
    setdata({ ...data, [e.target.name]: e.target.value });
  }
  const sendData = async () => {
    if(data.name.length === 0){
      setmsg("Username is required");
    }
    else if (data.pass.length <= 5 ) {
      setmsg("Password Length is too short");
    } else if (data.pass === data.cpass) {
      const newReq01 = await fetch(blink + "/api/createuser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: data.name,
          pass: data.pass,
          cpass: data.cpass
        })

      })
      const resp01 = await newReq01.json();
      if (!resp01.success) {
        setmsg(resp01.msg);
      }else{
        localStorage.setItem("username",data.name);
        nav("/");
      }
    } else {
      setmsg("Passwords do not match.");
    }

  }
  return (
    <div>
      <nav>
        <img src={Logo} alt='Study-Buddy' width={240} height={60} />
      </nav>
      <div className='items'>
        <div>
          <div id="form">
            <h1>Register</h1>
            <div className="form">
              <input name="name" value={data.name} autoComplete='off' onChange={handleChange} className="input" placeholder="Username" type="text" />
              <span className="input-border"></span>
            </div><br />
            <div className="form">
              <input name="pass" value={data.pass} autoComplete='off' onChange={handleChange} className="input" placeholder="Password" type="password" />
              <span className="input-border"></span>
            </div><br />
            <div className="form">
              <input name="cpass" value={data.cpass} autoComplete='off' onChange={handleChange} className="input" placeholder="Confirm Password" type="password" />
              <span className="input-border"></span>
            </div>
            {msg != "" ? <h3 style={{color:"#FF2E63"}}>{msg}</h3> : ""}

            <Button name="Register" oc={sendData}/>
            <p>Already Have an Account?<Link to="/login" id="Link"> Login</Link></p>
          </div>
        </div>
        <div>
          <img src={boy} id="Boy" width={650} height={650} />
        </div>

      </div>

    </div>
  )
}
