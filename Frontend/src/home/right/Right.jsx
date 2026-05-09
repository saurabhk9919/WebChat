import React, { useEffect } from 'react'
import Chatuser from './Chatuser.jsx'
import Messages from './Messages.jsx'
import Type from './Type.jsx'
import useConversation from '../../statemanage/useConversation.js'
import Loading from '../../component/Loading.jsx'
import { useAuth } from '../../context/AuthProvider.jsx'
import axios from 'axios'
import toast from 'react-hot-toast'
import { BiLogOut } from 'react-icons/bi'
import { useNavigate } from 'react-router-dom'

export default function Right() {
  const { selectedConversation, setSelectedConversation } = useConversation()
  const { setAuthUser } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await axios.post("/api/users/logout", {}, {
        withCredentials: true
      })
      localStorage.removeItem("userInfo")
      setAuthUser(undefined)
      toast.success("Logout successful")
      navigate('/login')
    } catch (err) {
      toast.error("Error in logout")
    }
  }

  useEffect(() => {
    return () => setSelectedConversation(null)
  }, [setSelectedConversation])

  return (
    <div>
      {!selectedConversation ? (
        <NoChat handleLogout={handleLogout} />
      ) : (
        <div className='w-[70%] h-screen flex flex-col gap-4 p-5 text-white bg-slate-800 relative'>
          <button 
            onClick={handleLogout}
            className='absolute top-4 right-4 p-2 hover:bg-slate-700 rounded-lg transition duration-200'
            title='Logout'
          >
            <BiLogOut className='text-2xl text-red-500 hover:text-red-400' />
          </button>
          <Chatuser></Chatuser>
          <Messages></Messages>
          <Type></Type>
        </div>
      )}
    </div>
  )
}

const NoChat=({handleLogout})=>{
  const { authUser } = useAuth()
  return (<>
  <div className='width-full w-[70%] h-screen flex items-center justify-center flex-col gap-4 text-gray-500 bg-slate-800 p-5 relative'>
    <button 
      onClick={handleLogout}
      className='absolute top-4 right-4 p-2 hover:bg-slate-700 rounded-lg transition duration-200'
      title='Logout'
    >
      <BiLogOut className='text-2xl text-red-500 hover:text-red-400' />
    </button>
    <h1 className='text-center font-semibold text-xl'>Welcome {authUser?.name || 'User'}!<br /><br />
    Please select a chat to start messaging.</h1>
    <Loading></Loading>
  </div>
  </>
  )
}
