import React from 'react'

function Message({ message }) {
  if (!message) {
    return null;
  }

  try {
    const authUser = JSON.parse(localStorage.getItem("userInfo"));
    if (!authUser || !authUser._id) {
      console.error('No auth user found');
      return null;
    }

    const itsme = message.senderId === authUser._id;
    const chatName = itsme ? "chat-end" : "chat-start";
    const chatColor = itsme ? "bg-green-500 text-white" : "chat-bubble-neutral";
    
    const createdAt = message.createdAt ? new Date(message.createdAt) : new Date();
    const formattedTime = createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); 
    const bubbleClass = itsme
      ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-br-md'
      : 'bg-slate-800 text-slate-100 rounded-bl-md border border-white/10';
    
    return (
      <div className={`chat ${chatName} max-w-[85%]`}>
        <div className={`chat-bubble whitespace-pre-wrap break-words px-4 py-3 ${bubbleClass}`}>
          <span className='block'>{message.message || 'Message'}</span>
          </div>
        <div className='mt-1 text-xs text-slate-500'>{formattedTime}</div>
        </div>
    )
  } catch (error) {
    console.error('Error rendering message:', error);
    return null;
  }
}

export default Message