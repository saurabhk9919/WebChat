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
    
    return (
      <div className='space-y-2'>
        <div className={`chat ${chatName}`}>
          <div className={`chat-bubble text-white ${chatColor}`}>
            {message.message || 'Message'}
          </div>
          <div className='text-xs text-slate-400'>{formattedTime}</div>
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error rendering message:', error);
    return null;
  }
}

export default Message