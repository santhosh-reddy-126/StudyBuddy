import React, { useState } from 'react'
import "../css/Future.css"
export default function Future(props) {

    return (
        <div className="Future">
            {props.ongoing ? <h2 style={{ textAlign: "left", color: "#FF2E63" }}>Ongoing <br />Ends in {parseInt((props.left)/60,10)} hours and {(props.left)%60} minutes</h2> : <h2 style={{ textAlign: "left", color: "#FF2E63" }}>Upcoming <br />Class starts in {props.days} days {parseInt((props.left)/60,10)} hrs and {(props.left)%60} min</h2>}
            <hr />
            <h2>{props.sub}</h2>
            <h3>{props.fac}</h3>
            <div></div>
        </div>
    )
}
