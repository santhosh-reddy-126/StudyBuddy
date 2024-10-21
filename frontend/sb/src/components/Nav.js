import React from 'react'
import Logo from "../images/logo.jpg";
import { useNavigate } from 'react-router-dom';
import "../css/Navs.css"
export default function Nav(props) {
  const navigate = useNavigate();
  return (
    <div>
      <nav style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" ,gap: "60px"}}>
        <img src={Logo} alt='Study-Buddy' onClick={() => navigate("/")} width={240} height={60} style={{ marginTop: "40px", paddingLeft: "2%" }} />
        {localStorage.getItem("username") ? <div className="navitems" style={{color:"#08D9D6",display: 'flex',flexDirection:'row',alignItems:"center",gap:"50px",marginTop:"20px",fontSize:"20px"}}>
          <h3 onClick={() => navigate("/class")}>Class</h3>
          <h3 onClick={() => navigate("/study")}>Study Session</h3>
          <h3 onClick={() => navigate("/assignments")}>Assigments</h3>
          <h3 onClick={() => navigate("/resource")}>Resources</h3>
          <h3 onClick={() => navigate("/exams")}>Exams</h3>
          <h3 onClick={() => navigate("/profile")}>profile</h3>
        </div>:""}
        {props.button ? <button id="btn" style={{ width: "fit-content", marginRight: "5%" }} onClick={props.clicked}>{props.button}</button> : ""}
      </nav>
    </div>
  )
}
