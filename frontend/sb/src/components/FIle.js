import React from 'react'
import bin from "../images/delete.png"
import "../css/Future.css"

export default function FIle(props) {
    const handleDelete=()=>{
        props.delfunc(props.id);
    }
    const openFile=()=>{
        window.open(props.url, "_blank");
    }
    return (
        <div  className="FileUnit" style={{ display: "flex", flexDirection: "row", justifyContent: "space-evenly", alignItems: "center" }}>
            <h3 onClick={openFile}>{props.title}</h3>
            <img src={bin} width={30} height={30} onClick={handleDelete}/>
        </div>
    )
}
