import React,{useState} from 'react'
import { useNavigate } from 'react-router-dom';
import "../css/Navs.css";
export default function Navs() {
    const navigate = useNavigate();
    const [spread,setSpread] = useState(false);
    const handleSpread=()=>{
        setSpread(!spread);
    }
    return (
        <div className='bottom'>
            <button id="one" className={spread ? "animate1 back" : "normal1 back"} title="Class Schedule" onClick={() => navigate("/class")}>C</button>
            <button id="two" className={spread ? "animate2 back" : "normal2 back"} title="Study Session">S</button>
            <button id="three" className={spread ? "animate3 back" : "normal3 back"} title="Assignments">A</button>
            <button id="four" className={spread ? "animate4 back" : "normal4 back"} title="Exams">E</button>
            <button id="five" className={spread ? "animate5 back" : "normal5 back"} title="Resources">R</button>
            <button id="six" className={spread ? "animate6 back" : "normal6 back"} title="Home" onClick={() => navigate("/")}>H</button>
            <button id="zero" className={spread ? "animate back" : "normal back"} onClick={handleSpread}>+</button>
        </div>
    )
}
