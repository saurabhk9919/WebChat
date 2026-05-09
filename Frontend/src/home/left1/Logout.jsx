import axios from 'axios';
import { useState } from 'react'
import { BiLogOut } from 'react-icons/bi'
import { useAuth } from '../../context/AuthProvider.jsx';
import toast from 'react-hot-toast';

export default function Logout() {
const [loading, setLoading] = useState(false);
const { setAuthUser } = useAuth();

  const handleLogout=async ()=>{
setLoading(true);
try{
 await axios.post("/api/users/logout", {}, {
    withCredentials: true
  });
localStorage.removeItem("userInfo");
setAuthUser(undefined);
toast.success("Logout successful");
}
  catch(err){
    toast.error("Error in logout");
  }
  finally {
    setLoading(false);
  }
  }
  return (
    <div className='w-[3%] bg-slate-950 text-white flex flex-col justify-end'>
     <div className='p-4 align-bottom'>
          <form action="">
            <div className='flex space-x-3'>
            
            <button type='button' onClick={handleLogout} disabled={loading}><BiLogOut className='text-5xl p-2 hover:bg-gray-600 rounded-lg'/></button>
            </div>
          </form>
        </div>
    
    
    </div>
  )
}
