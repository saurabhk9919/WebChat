import React, { useState } from 'react'
import Search from './Search.jsx'
import Users from './Users.jsx'
import { useAuth } from '../../context/AuthProvider.jsx'
import { BiLogOut } from 'react-icons/bi'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

export default function Left() {
  const { authUser, setAuthUser } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const handleLogout = async () => {
    setLoading(true)
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
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='flex w-[34%] min-w-[290px] max-w-[420px] flex-col h-full overflow-hidden border-r border-white/10 bg-slate-950/95 text-white'>
      {/* Header (Fixed) */}
      <div className='flex-shrink-0 border-b border-white/10 px-5 py-5'>
        <h1 className='text-2xl font-semibold tracking-tight'>Chats</h1>
        <p className='mt-1 text-sm text-slate-400'>Search people and jump into a conversation.</p>
      </div>

      {/* Search Input (Fixed) */}
      <div className='flex-shrink-0'>
        <Search />
      </div>

      {/* User list (Scrollable) */}
      <div className='flex-1 min-h-0 overflow-y-auto'>
        <Users />
      </div>

      {/* Logged-in User Info & Logout (Fixed) */}
      <div className='flex-shrink-0 border-t border-white/10 bg-slate-950/40 p-4 flex items-center justify-between'>
        <div className='flex items-center gap-3 min-w-0'>
          <div className='w-10 h-10 rounded-full bg-blue-600/20 border border-blue-500/20 flex items-center justify-center font-bold text-blue-300 shadow-md flex-shrink-0'>
            {authUser?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className='min-w-0'>
            <p className='text-sm font-semibold text-slate-200 truncate'>{authUser?.name || 'User'}</p>
            <p className='text-xs text-slate-400 truncate'>{authUser?.email || ''}</p>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          disabled={loading}
          className='p-2 rounded-xl border border-white/10 text-red-400 hover:bg-red-500/10 hover:text-red-300 transition disabled:opacity-50 flex-shrink-0'
          title='Logout'
        >
          <BiLogOut className='text-xl' />
        </button>
      </div>
    </div>
  )
}
