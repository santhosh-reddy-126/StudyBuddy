import React, { useState } from 'react'
import Nav from '../components/Nav'
import "../css/Form.css";
import AssignmentBlock from '../components/AssignmentBlock';
const blink = "http://localhost:3123"
export default function Assignments() {
    const [popped, setpop] = useState("");// to create pop up window
    const [Data, setData] = useState({
        Subject: "",
        Faculty: "",
        Date: "",
        Time: "",
        Importance: "Considerable",
        Note: "",
        Hours: "",
        username: localStorage.getItem("username")
    })
    const HandleChange = (e) => {//Handle Input Change
        setData({ ...Data, [e.target.name]: e.target.value });
    }
    const toggle = () => {
        setpop(!popped);// toggle the pop to add and close
    }
    const addAssignment = async (e) => {
        e.preventDefault();
        const data = await fetch(blink + "/api/addAssignment", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(Data)
        });
        const resp = await data.json();
        if (resp.success) {
            toggle();
            setData({
                Subject: "",
                Faculty: "",
                Date: "",
                Time: "",
                Importance: "Considerable",
                Note: "",
                Hours: "",
                username: localStorage.getItem("username")
            });
            window.location.reload();
        } else {
            alert("Something is wrong!");
        }
    }
    return (
        <div ><Nav button={popped ? "Close" : "Add Assignment"} clicked={toggle} />
            <div style={popped ? { filter: "blur(5px)" } : {}}>
                <AssignmentBlock />
            </div>
            <div >
                {popped ? <div className="form-container">
                    <h2>Assignment</h2>
                    <form>
                        <div class="form-group">
                            <input type="text" id="text1" name="Subject" placeholder='Subject' onChange={HandleChange} value={Data.Subject} />
                        </div>

                        <div class="form-group">
                            <input type="text" id="text2" name="Faculty" placeholder='Faculty' onChange={HandleChange} value={Data.Faculty} />
                        </div>

                        <div class="form-group">
                            <label for="date">Submission Date:</label>
                            <input type="date" id="date" name="Date" value={Data.Date} onChange={HandleChange} />
                        </div>

                        <div class="form-group">
                            <label for="time">End Time:</label>
                            <input type="time" id="time" name="Time" value={Data.Time} onChange={HandleChange} />
                        </div>

                        <div class="form-group">
                            <select id="select" name="Importance" value={Data.Importance} onChange={HandleChange}>
                                <option value="" selected disabled>Importance</option>
                                <option value="Negligible">Negligible</option>
                                <option value="Considerable">Considerable</option>
                                <option value="Game Changing">Game Changing</option>
                            </select>
                        </div>

                        <div class="form-group">
                            <textarea id="textarea" name="Note" rows="4" placeholder='Note' onChange={HandleChange} value={Data.Note}></textarea>
                        </div>

                        <div class="form-group">

                            <input type="number" id="number" name="Hours" placeholder='Time to Complete(hrs)' onChange={HandleChange} value={Data.Hours} />
                        </div>
                        <button type="submit" class="submit-btn" onClick={addAssignment}>Add Assignment</button>
                    </form>
                </div> : ""}
            </div>
            
        </div>
    )
}
