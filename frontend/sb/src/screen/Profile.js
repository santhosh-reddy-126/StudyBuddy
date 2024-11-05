import React,{useEffect,useState} from 'react'
import Nav from '../components/Nav'
import profile from "../images/profile.png"
import "../css/Profile.css"
const blink = "http://localhost:3123"
export default function Profile() {
  const [data,setdata] = useState({});
  const [sdata,setsdata] = useState({});
  const [search,setsearch]=useState("");
  const [friend,setfriend]=useState([]);
  const getData=async(a)=>{
    const data = await fetch(blink+"/api/getProfile",{
      method: "POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({username: a})
    });
    const resp = await data.json();
    if(!resp.success){
      alert(resp.msg);
    }else{
      setdata(resp.data)
      setsdata(resp.statdata)
    }
  }

  const getFriend=async(e)=>{
    setsearch(e.target.value);
    const data = await fetch(blink+"/api/getFriend",{
      method: "POST",
      headers:{
        "Content-Type":"application/json"
      }
    });
    const resp = await data.json();
    if(!resp.success){
      alert(resp.msg);
    }else{
      setfriend(resp.data);
    }
  }

  const addFriend=async(a)=>{
    const data = await fetch(blink+"/api/addFriend",{
      method: "POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({username: localStorage.getItem("username"),fusername: a})
    });
    const resp = await data.json();
    if(!resp.success){
      alert(resp.msg);
    }
  }
  useEffect(() => {
    getData(localStorage.getItem("username"));
    
  }, []);
  return (
    <div>
        <Nav />
        <div className='ProfilePart'>
            <img src={profile} width={300} height={300}/>
            <div className='ProfileText'>
                <h1>{data.username}</h1>
                <div>
                    <p>{data.avgHours<=1.5 ? "Beginner": data.avgHours<=4.5 ? "Intermediate":"Expert"}</p>
                    {data && data.username === localStorage.getItem("username") ? "" : data && data.friends && !data.friends.includes(localStorage.getItem("username")) ? <button id="btn" onClick={() => addFriend(data.username)}>Add Friend</button> : <button id="btn" disabled>Friend</button>}

                </div>
                
            </div>
        </div>
        <div className='Stats'>
                <h1><span>Daily Average:</span> {data.avgHours}hr</h1>
                <h1><span>This Week:</span> {(sdata.weeklysesshours)/60}hr</h1>
                <h1><span>Total Hours:</span> {(sdata.totalsesshours)/60}hr</h1>
        </div>
        <div className='Friends'>
            <h1>Friends</h1>
              <input type='text' placeholder='Search your friend' value={search} onChange={getFriend}/>
              <div className='displayFriends'>
              {friend ? friend.filter((items) => {
                    return (items.username).toLowerCase().includes(search.toLowerCase());
              }).map((item) => {
                  return (<h1 key={item.username} onClick={()=>getData(item.username)}>{item.username}</h1>);
              }): "No Friends Added"}
              </div>
        </div>
    </div>
  )
}
