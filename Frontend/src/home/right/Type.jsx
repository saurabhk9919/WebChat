import { useState } from 'react'
import { IoSend } from 'react-icons/io5'
import useConversation from '../../statemanage/useConversation.js'
import useSendMessage from '../../context/useSendMessage.js'
import toast from 'react-hot-toast'

function Type() {
  const { selectedConversation } = useConversation()
  const { loading, sendMessages } = useSendMessage()
  const [message, setMessage] = useState('')

  const handleSendMessage = async (e) => {
    e.preventDefault()
    
    if (!message.trim()) {
      toast.error('Please type a message')
      return
    }

    if (!selectedConversation?._id) {
      toast.error('Please select a user to chat with')
      return
    }

    try {
      const messageToSend = message
      setMessage('') // Clear input immediately for better UX
      const sent = await sendMessages(messageToSend)
      if (!sent) {
        toast.error('Failed to send message')
        setMessage(messageToSend) // Restore message if failed
      }
    } catch (error) {
      console.error('Error sending message:', error)
      toast.error('Error sending message')
      setMessage(message) // Keep message if error
    }
  }

  return (
    <>
   <div className='flex items-center gap-3 border-t border-white/10 bg-slate-950/80 px-5 py-4 backdrop-blur'>
    
    <div className='flex-1'>
        <input 
          type="text" 
          placeholder="Type a message..." 
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !loading && handleSendMessage(e)}
          disabled={loading}
          className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white transition duration-200 placeholder-slate-500 focus:border-blue-500 focus:outline-none disabled:opacity-50"
        />
    </div>
    <button 
      onClick={handleSendMessage}
      disabled={loading || !message.trim()}
      className='rounded-2xl border border-blue-500/20 p-3 text-2xl text-blue-400 transition duration-200 hover:bg-blue-600 hover:text-white hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50'>
        <IoSend/>
    </button>
   </div>
    </>
  )
}

export default Type