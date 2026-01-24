import axios from 'axios';
import React from 'react'
import { BiLogOut } from 'react-icons/bi'
import { useState } from 'react';
import Cookies from 'js-cookie';


export default function Logout() {
const [loading, setLoading] = React.useState(false);

  const handleLogout=async ()=>{
setLoading(true);
try{
 const response = await axios.post("http://localhost:5002/api/users/logout");
localStorage.removeItem("userInfo");
alert("Logout successful");
Cookies.remove("jwt");
setLoading(false);
}
  catch(err){
    console.log("Error in logout", err);
  }
  }
  return (
    <div className='w-[3%] bg-slate-950 text-white flex flex-col justify-end'>
     <div className='p-4 align-bottom'>
          <form action="">
            <div className='flex space-x-3'>
            
            <button><BiLogOut onClick={handleLogout} className='text-5xl p-2 hover:bg-gray-600 rounded-lg'/></button>
            </div>
          </form>
        </div>
    
    
    </div>
  )
}
