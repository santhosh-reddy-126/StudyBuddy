import React, { useState } from 'react'
import axios from "axios"

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "../css/Main.css";
import Nav from '../components/Nav';
import Navs from '../components/Navs';
import Future from '../components/Future';


const blink = "http://localhost:3123"

export default function Main() {
  const navigate = useNavigate();
  const [data, setdata] = useState({});
  const [ongoing, seton] = useState(false);
  const [dur, setdur] = useState(0);
  const [days,setdays] = useState(0);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(blink);
      } catch (err) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    };

    fetchData();
  }, [navigate]);
  const getClass = async () => {
    const data = await fetch(blink + "/api/getRecentClass", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: localStorage.getItem("username")
      })
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
  }
  useEffect(() => {
    getClass();
  }, [])
  return (
    <div>
      <Nav />
      <div className='holder'>
        <div className='MainSection'>
          <div class="Up">
            <Future sub={data.sub} left={dur} ongoing={ongoing} fac={data.fac} days={days} />
          </div>
        </div>
        <Navs />
      </div>

    </div>
  )
}
