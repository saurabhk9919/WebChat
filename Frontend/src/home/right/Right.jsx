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
    <div className='flex min-w-0 flex-1 bg-slate-900 text-white'>
      {!selectedConversation ? (
        <NoChat handleLogout={handleLogout} />
      ) : (
        <div className='relative flex min-w-0 flex-1 flex-col overflow-hidden bg-slate-900'>
          <div className='flex items-center justify-between border-b border-white/10 px-5 py-4'>
            <Chatuser></Chatuser>
            <button 
              onClick={handleLogout}
              className='rounded-xl border border-white/10 p-2 text-red-400 transition hover:bg-white/5 hover:text-red-300'
              title='Logout'
            >
              <BiLogOut className='text-2xl' />
            </button>
          </div>
          <div className='flex min-h-0 flex-1 flex-col bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.08),_transparent_35%)]'>
            <Messages></Messages>
            <Type></Type>
          </div>
        </div>
      )}
    </div>
  )
}

const NoChat=({handleLogout})=>{
  const { authUser } = useAuth()
  return (
  <div className='flex min-h-0 flex-1 items-center justify-center p-6 text-gray-400'>
    <div className='relative flex w-full max-w-xl flex-col items-center gap-5 rounded-[2rem] border border-white/10 bg-slate-950/70 px-8 py-10 text-center shadow-xl shadow-black/20'>
      <button 
        onClick={handleLogout}
        className='absolute right-4 top-4 rounded-xl border border-white/10 p-2 text-red-400 transition hover:bg-white/5 hover:text-red-300'
        title='Logout'
      >
        <BiLogOut className='text-2xl' />
      </button>
      <div className='space-y-3'>
        <p className='text-sm uppercase tracking-[0.35em] text-blue-300/70'>WebChat</p>
        <h1 className='text-2xl font-semibold text-slate-100'>Welcome {authUser?.name || 'User'}</h1>
        <p className='max-w-md text-sm leading-6 text-slate-400'>Select a chat from the left panel to start messaging. Your conversation will appear here with live updates and smooth scrolling.</p>
      </div>
      <Loading></Loading>
    </div>
  </div>
  )
}
