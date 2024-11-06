import React, { useState } from "react";
import axios from "axios";

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Main.css";
import Nav from "../components/Nav";
import Future from "../components/Future";
import coin from "../images/coin.png";
import Session from "../components/Session";

const blink = "http://localhost:3123";

export default function Main() {
  const navigate = useNavigate();
  const [data, setdata] = useState({});
  const [adata, setadata] = useState({});
  const [ongoing, seton] = useState(false);
  const [sessdata, setsessdata] = useState({});
  const [statdata, setstat] = useState({});
  const [lb, setlb] = useState([]);
  const [dur, setdur] = useState(0);
  const [days, setdays] = useState(0);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(blink);
      } catch (err) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    };

    fetchData();
  }, [navigate]);
  const getClass = async () => {
    const data = await fetch(blink + "/api/getRecentClass", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: localStorage.getItem("username"),
      }),
    });
    const resp = await data.json();
    if (!resp.success) {
      alert("Something went wrong");
    } else {
      setdata(resp.data);
      seton(resp.ongoing);
      setdur(resp.remaining);
      setdays(resp.days);
    }
  };
  const getData = async () => {
    const data = await fetch(blink + "/api/getRecent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: localStorage.getItem("username"),
      }),
    });
    const resp = await data.json();
    if (!resp.success) {
      alert("Something went wrong");
    } else {
      setadata(resp.data);
      setsessdata(resp.sessdata);
      setstat(resp.stats);
      setlb(resp.lb);
    }
  };
  const LogOut = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const check = () => {
    if (localStorage.getItem("token") === null) {
      LogOut();
    }
  };
  useEffect(() => {
    check();
    getClass();
    getData();
    console.log(adata);
  }, []);
  return (
    <div>
      <Nav button="logout" clicked={LogOut} />
      <div className="holder">
        <div className="MainSection">
          <div className="sessiondash">
            {sessdata ? (
              <div>
                <h1>{sessdata.status}</h1>
                <Session
                  subject={sessdata.subject}
                  sdate={sessdata.startdate}
                  edate={sessdata.enddate}
                  prog={sessdata.progress}
                  id={sessdata._id}
                  skip={sessdata.skipped}
                  func={getData}
                  del={false}
                />
              </div>
            ) : (
              ""
            )}
            <div className="coins">
              <div>
                <h1>{statdata.coins}</h1>
                <img src={coin} width={100} height={100} />
              </div>{" "}
            </div>
          </div>
          <div
            class="Up"
          >
            <Future
              sub={data.sub}
              left={dur}
              ongoing={ongoing}
              fac={data.fac}
              days={days}
            />
            {adata ? (
              <div
                className="Future"
              >
                <h2 style={{ textAlign: "left", color: "#FF2E63" }}>
                  Upcoming Assignment in{" "}
                  {Math.abs(
                    new Date(adata.Deadline).getDate() - new Date().getDate()
                  )}{" "}
                  Days
                </h2>
                <hr />
                <h2>{adata.subject}</h2>
                <h3>{adata.faculty}</h3>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
      <div className="LeaderBoard">
        <h1>Leaderboard</h1>
        {lb
          ? lb.map((item,index) => (
              <div className="litem" key={item.username}>
                <h2>#{index+1}</h2>
                <h1>{item.username}</h1>
                <h1>{item.coins}</h1>
                <img id="coin" src={coin} width={30} height={30} />
              </div>
            ))
          : ""}
      </div>
      <div className='warn'>
            <h2>Challenges</h2>
            <ol>
                <li>Get Extra 10 coins for completing Study Session on Weekends</li>
                <li>Complete Assignment based on priority to get more coins </li>
            </ol>
        </div>
    </div>
  );
}
