import React,{useState} from 'react'
import axios from "axios"

import { useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import "../css/Main.css";
import Nav from '../components/Nav';
import Navs from '../components/Navs';


const blink = "http://localhost:3123"

export default function Main() {
  const navigate = useNavigate();
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
  return (
    <div>
      <Nav/>
      <div className='holder'>
      <div className='MainSection'>
          <h1>It's time to share your Details...</h1>
      </div>
      <Navs />
      </div>
      
    </div>
  )
}
