import axios from 'axios';
import React, { useEffect } from 'react'
import { Navigate, Outlet, useNavigate } from 'react-router-dom'

export default function ProtectedRoute() {
  const navigate = useNavigate()
  const auth = {isAuthorized:true}
  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get("http://localhost:5000/protected",{
      headers : {
        Authorization : token,
      }
    }).then(res => {
      auth.isAuthorized = true;
      console.log(res);
    }).catch(err => {
      console.log(err);
      // navigate("/signin");
    })
  },[])


  return (
    auth.isAuthorized ? <Outlet/> : <Navigate to="/signin" />
  )
}
