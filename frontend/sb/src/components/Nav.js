import React, { useState } from 'react';
import Logo from "../images/logo.jpg";
import { useNavigate } from 'react-router-dom';
import "../css/Navs.css";

export default function Nav(props) {
  const navigate = useNavigate();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div>
      <nav className="navbar">
        <img src={Logo} id="logos" alt="Study-Buddy" onClick={() => navigate("/")} />
        {localStorage.getItem("username") ? (
          <div className="navitems">
            <h3 onClick={() => navigate("/class")}>Class</h3>
            <h3 onClick={() => navigate("/study")}>Study Session</h3>
            <h3 onClick={() => navigate("/assignments")}>Assignments</h3>
            <h3 onClick={() => navigate("/resource")}>Resources</h3>
            <h3 onClick={() => navigate("/exams")}>Exams</h3>
            <h3 onClick={() => navigate("/profile")}>Profile</h3>
          </div>
        ) : null}
        {props.button ? (
          <button id="btn" onClick={props.clicked}>{props.button}</button>
        ) : null}

        {/* Hamburger icon for small screens */}
        <div className="hamburger" onClick={toggleSidebar}>
          &#9776;
        </div>
      </nav>

      {/* Sidebar for small devices */}
      {isSidebarOpen && (
        <div className="sidebar">
          {/* Close button inside the sidebar */}
          <span className="close-btn" onClick={toggleSidebar}>&times;</span>
          <h3 onClick={() => { toggleSidebar(); navigate("/class"); }}>Class</h3>
          <h3 onClick={() => { toggleSidebar(); navigate("/study"); }}>Session</h3>
          <h3 onClick={() => { toggleSidebar(); navigate("/assignments"); }}>Assignments</h3>
          <h3 onClick={() => { toggleSidebar(); navigate("/resource"); }}>Resources</h3>
          <h3 onClick={() => { toggleSidebar(); navigate("/exams"); }}>Exams</h3>
          <h3 onClick={() => { toggleSidebar(); navigate("/profile"); }}>Profile</h3>
          {props.button && (
            <button id="btn22" onClick={() => { toggleSidebar(); props.clicked(); }}>{props.button}</button>
          )}
        </div>
      )}
    </div>
  );
}
