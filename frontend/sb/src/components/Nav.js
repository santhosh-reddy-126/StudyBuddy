import React from 'react'
import Logo from "../images/logo.jpg";
export default function Nav(props) {
  return (
    <div>
    <nav style={{display:"flex",flexDirection:"row",justifyContent:"space-between",alignItems:"center"}}>
        <img src={Logo} alt='Study-Buddy' width={240} height={60} style={{marginTop:"40px",paddingLeft:"5%"}}/>
        {props.button?<button id="btn" style={{width:"fit-content",marginRight:"5%"}} onClick={props.clicked}>{props.button}</button>:""}
    </nav>
    </div>
  )
}
