import React, { useEffect, useState } from 'react'
import AssignmentUnit from './AssignmentUnit.js';
const blink = "http://localhost:3123"
export default function AssignmentBlock() {
    const [Data, setData] = useState([]);
    const getAssignment = async () => {
        const data = await fetch(blink + "/api/getAssignment", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: localStorage.getItem("username")
            })
        });
        const resp = await data.json();
        if (resp.success) {
            setData(resp.data);
        } else {
            alert("Something is wrong!");
        }
    }

    useEffect(() => {
        getAssignment();
    }, [])
    return (
        <div>
            <div className='GameChanging'>
                <h1>Game Changing Assigments</h1>
                <div className='items'>

                
                {Data ? Data.filter(item => item.Importance == "Game Changing")
                    .map(items => (
                        <AssignmentUnit sub={items.subject} fac={items.faculty} note={items.Note} date={items.Deadline} func={getAssignment} id={items._id} progress={items.Progress} dur={items.TimeItTakes}/>
                    )) : ""}
                </div>
            </div>
            <div className='Considerable'>
                <h1>Considerable Assigments</h1>
                <div className='items'>
                {Data ? Data.filter(item => item.Importance == "Considerable")
                    .map(items => (
                        <AssignmentUnit sub={items.subject} fac={items.faculty} note={items.Note} date={items.Deadline} func={getAssignment} id={items._id} progress={items.Progress} dur={items.TimeItTakes}/>
                    )) : ""}
                </div>
            </div>
            <div className='Negligible'>
                <h1>Negligible Assigments</h1>
                <div className='items'>
                {Data ? Data.filter(item => item.Importance == "Negligible")
                    .map(items => (
                        <AssignmentUnit sub={items.subject} fac={items.faculty} note={items.Note} date={items.Deadline} func={getAssignment} id={items._id} progress={items.Progress} dur={items.TimeItTakes}/>
                    )) : ""}
                </div>
            </div>
        </div>
    )
}
