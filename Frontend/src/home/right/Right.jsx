import React, { useEffect, useRef, useState } from 'react'
import Chatuser from './Chatuser.jsx'
import Messages from './Messages.jsx'
import Type from './Type.jsx'
import useConversation from '../../statemanage/useConversation.js'
import TaskSidebar from './TaskSidebar.jsx'
import useGetTasks from '../../context/useGetTasks.jsx'
import Loading from '../../component/Loading.jsx'
import AISummaryCard from '../../component/AISummaryCard.jsx'
import SemanticSearch from '../../component/SemanticSearch.jsx'
import { useAuth } from '../../context/AuthProvider.jsx'
import axios from 'axios'
import toast from 'react-hot-toast'
import { BiLogOut } from 'react-icons/bi'
import { useNavigate } from 'react-router-dom'

export default function Right() {
  const { selectedConversation, setSelectedConversation } = useConversation()
  useGetTasks()
  const { setAuthUser } = useAuth()
  const navigate = useNavigate()
  const [isSummarizeOpen, setIsSummarizeOpen] = useState(false)
  const [limit, setLimit] = useState('last-5')
  const [summaryType, setSummaryType] = useState('brief')
  const [summaryData, setSummaryData] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)
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

  const currentLimitLabel = limitOptions.find((item) => item.value === limit)?.label || 'Last 5 Messages'
  const currentSummaryTypeLabel = summaryTypeOptions.find((item) => item.value === summaryType)?.label || 'Brief'

  const formatGeneratedAt = (dateValue) => {
    if (!dateValue) {
      return 'Generated just now'
    }

    const generatedDate = new Date(dateValue)
    if (Number.isNaN(generatedDate.getTime())) {
      return 'Generated just now'
    }

    const diffMs = Date.now() - generatedDate.getTime()
    const diffSeconds = Math.max(1, Math.floor(diffMs / 1000))
    if (diffSeconds < 60) return 'Generated just now'

    const diffMinutes = Math.floor(diffSeconds / 60)
    if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes === 1 ? '' : 's'} ago`

    const diffHours = Math.floor(diffMinutes / 60)
    if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`

    const diffDays = Math.floor(diffHours / 24)
    return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`
  }

  const handleGenerate = async () => {
    if (!selectedConversation?._id || isGenerating) {
      return
    }

    setIsGenerating(true)
    try {
      const response = await axios.post(
        `/api/messages/summary/${selectedConversation._id}`,
        {
          limit,
          summaryType,
        },
        {
          withCredentials: true,
        }
      )

      setSummaryData({
        ...(response.data || {}),
        limit,
        summaryType,
        generatedAt: new Date().toISOString(),
      })
      setIsSummarizeOpen(false)
    } catch (error) {
      console.error('Error generating summary:', error)
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to generate summary'
      toast.error(errorMessage)
    } finally {
      setIsGenerating(false)
    }
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
    setSummaryData(null)
    setIsSummarizeOpen(false)
    setIsGenerating(false)
  }, [selectedConversation?._id])

  const handleCopySummary = async () => {
    const parts = []

    if (summaryData?.summary) {
      parts.push(summaryData.summary)
    }

    if (Array.isArray(summaryData?.keyPoints) && summaryData.keyPoints.length > 0) {
      parts.push('Key Points:', ...summaryData.keyPoints.map((item) => `- ${item}`))
    }

    if (Array.isArray(summaryData?.actionItems) && summaryData.actionItems.length > 0) {
      parts.push('Action Items:', ...summaryData.actionItems.map((item) => `- ${item}`))
    }

    if (Array.isArray(summaryData?.decisions) && summaryData.decisions.length > 0) {
      parts.push('Decisions:', ...summaryData.decisions.map((item) => `- ${item}`))
    }

    const text = parts.join('\n\n').trim()
    if (!text) return

    await navigator.clipboard.writeText(text)
    toast.success('Summary copied')
  }

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
    <div className='flex min-w-0 flex-1 bg-slate-900 text-white h-full overflow-hidden'>
      {!selectedConversation ? (
        <NoChat handleLogout={handleLogout} />
      ) : (
        <div className="flex flex-1 min-w-0 overflow-hidden h-full">
          <div className="relative flex min-w-0 flex-1 flex-col overflow-hidden bg-slate-900 border-r border-white/5 h-full">
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
                            disabled={isGenerating}
                            className='rounded-xl border border-blue-500/20 bg-blue-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-70'
                          >
                            {isGenerating ? 'AI is reading...' : 'Generate'}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <SemanticSearch />
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
              {summaryData && (
                <div className='border-b border-white/10 px-5 pt-4'>
                  <AISummaryCard
                    summary={summaryData.summary}
                    keyPoints={summaryData.keyPoints}
                    actionItems={summaryData.actionItems}
                    decisions={summaryData.decisions}
                    limitLabel={limitOptions.find((item) => item.value === summaryData.limit)?.label || currentLimitLabel}
                    summaryTypeLabel={summaryTypeOptions.find((item) => item.value === summaryData.summaryType)?.label || currentSummaryTypeLabel}
                    generatedAtLabel={formatGeneratedAt(summaryData.generatedAt)}
                    onCopy={handleCopySummary}
                    onRegenerate={handleGenerate}
                    isLoading={isGenerating}
                  />
                </div>
              )}
              {isGenerating && !summaryData && (
                <div className='border-b border-white/10 px-5 pt-4'>
                  <AISummaryCard
                    isLoading
                    limitLabel={currentLimitLabel}
                    summaryTypeLabel={currentSummaryTypeLabel}
                    generatedAtLabel='Generated just now'
                    onRegenerate={handleGenerate}
                  />
                </div>
              )}
              <Messages></Messages>
              <Type></Type>
            </div>
          </div>
          <TaskSidebar />
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
