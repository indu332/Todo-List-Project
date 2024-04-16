import axios from 'axios';
import { useState,useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import AppNavbar from './AppNavbar';
import { URL } from '../App';

function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get(`${URL}/protected`,{
      headers : {
        Authorization : token,
      }
    }).then(res => {
      localStorage.removeItem('token');
    }).catch(err => {
      console.log(err);
      
    })
  },[])

  return (
    <>
    <Navigate to="/signin" />
    </>
  );
}

export default Logout;