import React from 'react'
import useConversation from '../../statemanage/useConversation.js';
import { useSocketContext } from '../../context/SocketContext.jsx';

function User({ user }) {
  const { selectedConversation, setSelectedConversation } = useConversation();
  const isSelected = selectedConversation ?._id=== user._id;
  const { onlineUsers } = useSocketContext();
  const isOnline = onlineUsers.includes(user._id);


  return (
    <div className={`hover:bg-slate-600 duration-300 
    ${isSelected ? 'bg-slate-700' : ''}`} onClick={() => setSelectedConversation(user)}>
        <div className='flex space-x-4 px-8 py-7 hover:bg-slate-700 duration-300 cursor-pointer'>
        <div className={`avatar ${isOnline ? 'avatar-online' : ''}`}>
  <div className="w-16 rounded-full">
    <img src="https://img.daisyui.com/images/profile/demo/gordon@192.webp" />
  </div>
</div>
<div>
    <h1 className='font-bold text-lg'>
        {user.name}
    </h1>
    <span>{user.email}</span>
</div>
</div>
    </div>
  )
}

export default User