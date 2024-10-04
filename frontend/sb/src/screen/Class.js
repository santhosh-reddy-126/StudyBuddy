import React, { useEffect, useState,useRef } from 'react'
import Nav from '../components/Nav'
import Navs from '../components/Navs'
import "../css/Class.css";
import Day from '../components/Day';
const blink = "http://localhost:3123"
export default function Class() {
  const [popped, setpop] = useState(false);
  const [classs,setclass]=useState([]);
  const [words,setwords]=useState([]);
  const [warn,setwarn] = useState("Make sure that your classes wont clash while adding data.");
  const [Data,setData]=useState({
    sub:"",
    fh:"",
    fm:"",
    fs:"AM",
    th:"",
    tm:"",
    ts:"AM",
    fac:"",
    day:"Monday",
    diff: "neutral"
  })
  const toggle = () => {
    setpop(!popped);
  }
  const [sugg,setsugg]=useState("");
  const [place,setplace]=useState("sub");
  const HandleChange=(e)=>{
    if(e.target.name=="sub" || e.target.name=="fac"){
      setsugg(MatchedOne(e.target.value))
      setplace(e.target.name);
    }else{
      setsugg("");
    }
    setData({...Data,[e.target.name]:e.target.value});
  }
  const handleKeyDown = (event) => {
    if (event.key === 'Tab' && sugg.length > 0) {
      event.preventDefault();
      setData({...Data,[event.target.name]:sugg,diff: searchDiff(sugg)});
      
    }
  };
  const addClasss=async()=>{
    Data.username=localStorage.getItem("username");
    const data = await fetch(blink+"/api/addclass",{
      method: "POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify(Data)
    });
    const resp = await data.json();
    if(!resp.success){
      setwarn(resp.msg);
    }else{
      setwarn("Make sure that your classes wont clash while adding data.");
      toggle();
      setData({
        sub:"",
        fh:"",
        fm:"",
        fs:"AM",
        th:"",
        tm:"",
        ts:"AM",
        fac:"",
        day:"Monday",
        diff: "neutral"
      })
      getClass();
    }
  }
  const getClass=async()=>{
    Data.username=localStorage.getItem("username");
    const data = await fetch(blink+"/api/getClass",{
      method: "POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        username: localStorage.getItem("username")
      })
    });
    const resp = await data.json();
    if(!resp.success){
      alert("Something went wrong");
    }else{
      setclass(resp.data);
      setwords(resp.words);
    }
  }
  function searchDiff(sugg){
    for(let i=0;i<classs.length;i++){
      if(classs[i].sub==sugg || classs[i].fac==sugg){
       return classs[i].diff;
      }
    }
  }
  
  const MatchedOne=(target)=>{
    let newArray = [];
    for(let i=0;i<words.length;i++){
      newArray.push(words[i].toLowerCase());
    }
    const matches = newArray.filter(item => item.toLowerCase().startsWith(target.toLowerCase()));
    for(let i=0;i<words.length;i++){
      if(matches[0]==newArray[i]){
        matches[0]=words[i];
      }
    }
    return matches.length > 0 ? matches[0] : "";
  }
  useEffect(()=>{
    getClass();
  },[])

  return (
    <div>
      <Nav button={popped ? "Close" : "Add a Class"} clicked={toggle} />
      <div className='MainClass' style={popped ? { filter: "blur(5px)" } : {}}>
        <div>
          <Day day="Monday" data={classs} func={getClass}/>
          <Day day="Tuesday" data={classs} func={getClass}/>
          <Day day="Wednesday" data={classs} func={getClass}/>
          <Day day="Thursday" data={classs} func={getClass}/>
          <Day day="Friday" data={classs} func={getClass}/>
          <Day day="Saturday" data={classs} func={getClass}/>
          <Day day="Sunday" data={classs} func={getClass}/>
        </div>
        <Navs />
      </div>
      {popped ? <div className='popup'>
            <h2>Add your class</h2>
            <input type='text' name="sub" onChange={HandleChange} autoComplete='off' onKeyDown={handleKeyDown}  value={Data.sub} placeholder='Subject'></input>
            {place=="sub"? sugg==""?"":<h3 style={{color: "#FF2E63"}}>Press Tab: {sugg}</h3>:""}
            <select name="day" value={Data.day} onChange={HandleChange} style={{width:"80%",height:"30px"}}>
                <option>Sunday</option>
                <option>Monday</option>
                <option>Tuesday</option>
                <option>Wednesday</option>
                <option>Thursday</option>
                <option>Friday</option>
                <option>Saturday</option>
              </select>
              <select name="diff" value={Data.diff} onChange={HandleChange} style={{width:"80%",height:"30px"}}>
                <option>easy</option>
                <option>neutral</option>      
                <option>medium</option>
                <option>hard</option>
              </select>
            <div class="sub">
              <input type='number' name="fh" onChange={HandleChange}  value={Data.fh} placeholder='FROM(HRS)'></input>
              <input type='number' name="fm" onChange={HandleChange}  value={Data.fm}placeholder='FROM(MIN)'></input>
              <select name="fs" value={Data.fs} onChange={HandleChange}>
                <option>AM</option>
                <option>PM</option>
              </select>
            </div>
            <div class="sub">
              <input type='number' name="th" onChange={HandleChange}  value={Data.th} placeholder='TO(HRS)'></input>
              <input type='number' name="tm" onChange={HandleChange}  value={Data.tm} placeholder='TO(MIN)'></input>
              <select name="ts" value={Data.ts} onChange={HandleChange}>
                <option>AM</option>
                <option>PM</option>
              </select>
            </div>
            <input type='text' name="fac" autoComplete='off' onKeyDown={handleKeyDown} onChange={HandleChange}  value={Data.fac} placeholder='Faculty'></input>
            {place=="fac"? sugg==""?"":<h3 style={{color: "#FF2E63"}}>Press Tab: {sugg}</h3>:""}
            {warn==""?"":<h3 style={{color:"#252A34"}}>{warn}</h3>}
            <button id='btn' onClick={addClasss}>Add</button>
      </div> : ""}
    </div>
  )
}
