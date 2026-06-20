import React, { useEffect, useRef, useState } from 'react'
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
  const [isSummarizeOpen, setIsSummarizeOpen] = useState(false)
  const [limit, setLimit] = useState('last-5')
  const [summaryType, setSummaryType] = useState('brief')
  const summarizeButtonRef = useRef(null)
  const summarizePopoverRef = useRef(null)

  const limitOptions = [
    { label: 'Last 5', value: 'last-5' },
    { label: 'Last 10', value: 'last-10' },
    { label: 'Last 20', value: 'last-20' },
    { label: 'Last 50', value: 'last-50' },
    { label: 'Last 100', value: 'last-100' },
    { label: 'Entire Conversation', value: 'entire-conversation' },
  ]

  const summaryTypeOptions = [
    { label: 'Brief', value: 'brief' },
    { label: 'Detailed', value: 'detailed' },
    { label: 'Bullet Points', value: 'bullet-points' },
    { label: 'Key Decisions', value: 'key-decisions' },
    { label: 'Action Items', value: 'action-items' },
  ]

  const handleGenerate = () => {
    console.log({ limit, summaryType })
  }

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

  useEffect(() => {
    const handleOutsideClick = (event) => {
      const target = event.target

      if (
        summarizePopoverRef.current?.contains(target) ||
        summarizeButtonRef.current?.contains(target)
      ) {
        return
      }

      setIsSummarizeOpen(false)
    }

    if (isSummarizeOpen) {
      document.addEventListener('mousedown', handleOutsideClick)
      document.addEventListener('touchstart', handleOutsideClick)
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
      document.removeEventListener('touchstart', handleOutsideClick)
    }
  }, [isSummarizeOpen])

  return (
    <div className='flex min-w-0 flex-1 bg-slate-900 text-white'>
      {!selectedConversation ? (
        <NoChat handleLogout={handleLogout} />
      ) : (
        <div className='relative flex min-w-0 flex-1 flex-col overflow-hidden bg-slate-900'>
          <div className='flex items-center justify-between border-b border-white/10 px-5 py-4'>
            <div className='flex min-w-0 items-center gap-3'>
              <Chatuser></Chatuser>
              <div className='relative'>
                <button
                  ref={summarizeButtonRef}
                  type='button'
                  onClick={() => setIsSummarizeOpen((open) => !open)}
                  className='inline-flex items-center gap-2 rounded-xl border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-200 transition hover:bg-blue-500/20 hover:text-white'
                  title='Open summarize options'
                  aria-expanded={isSummarizeOpen}
                  aria-haspopup='menu'
                >
                  <span aria-hidden='true'>✨</span>
                  Summarize
                </button>

                {isSummarizeOpen && (
                  <div
                    ref={summarizePopoverRef}
                    className='absolute left-0 top-full z-30 mt-3 w-72 rounded-2xl border border-white/10 bg-slate-950/95 p-4 shadow-2xl shadow-black/40 backdrop-blur-xl'
                    role='menu'
                    aria-label='Summary options'
                  >
                    <div className='space-y-3'>
                      <div>
                        <p className='text-xs font-semibold uppercase tracking-[0.25em] text-slate-400'>
                          Thread Summary
                        </p>
                        <p className='mt-1 text-sm leading-5 text-slate-300'>
                          Choose a summary scope and type. Generation will be added next.
                        </p>
                      </div>

                      <div className='rounded-xl border border-white/10 bg-white/5 p-3'>
                        <p className='text-xs font-medium uppercase tracking-[0.2em] text-slate-400'>
                          Messages to summarize:
                        </p>
                        <div className='mt-3 grid grid-cols-2 gap-2'>
                          {limitOptions.map((item) => (
                            <button
                              key={item.value}
                              type='button'
                              onClick={() => setLimit(item.value)}
                              aria-pressed={limit === item.value}
                              className={`rounded-xl border px-3 py-2 text-left text-sm transition ${
                                limit === item.value
                                  ? 'border-blue-400/50 bg-blue-500/20 text-white shadow-[0_0_0_1px_rgba(59,130,246,0.2)]'
                                  : 'border-white/10 bg-slate-900/80 text-slate-200 hover:border-blue-500/30 hover:bg-blue-500/10 hover:text-white'
                              }`}
                            >
                              {item.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className='rounded-xl border border-white/10 bg-white/5 p-3'>
                        <p className='text-xs font-medium uppercase tracking-[0.2em] text-slate-400'>
                          Summary Type:
                        </p>
                        <div className='mt-3 grid gap-2'>
                          {summaryTypeOptions.map((item) => (
                            <button
                              key={item.value}
                              type='button'
                              onClick={() => setSummaryType(item.value)}
                              aria-pressed={summaryType === item.value}
                              className={`rounded-xl border px-3 py-2 text-left text-sm transition ${
                                summaryType === item.value
                                  ? 'border-blue-400/50 bg-blue-500/20 text-white shadow-[0_0_0_1px_rgba(59,130,246,0.2)]'
                                  : 'border-white/10 bg-slate-900/80 text-slate-200 hover:border-blue-500/30 hover:bg-blue-500/10 hover:text-white'
                              }`}
                            >
                              {item.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className='flex items-center justify-end gap-2 pt-1'>
                        <button
                          type='button'
                          onClick={() => setIsSummarizeOpen(false)}
                          className='rounded-xl border border-white/10 px-4 py-2 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white'
                        >
                          Cancel
                        </button>
                        <button
                          type='button'
                          onClick={handleGenerate}
                          className='rounded-xl border border-blue-500/20 bg-blue-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-400'
                        >
                          Generate
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

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
