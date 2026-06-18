import React from 'react'
import useConversation from '../../statemanage/useConversation.js';
import { useSocketContext } from '../../context/SocketContext.jsx';

function User({ user }) {
  const { selectedConversation, setSelectedConversation } = useConversation();
  const isSelected = selectedConversation ?._id=== user._id;
  const { onlineUsers } = useSocketContext();
  const isOnline = onlineUsers.includes(user._id);


  return (
    <button
      type='button'
      className={`flex w-full items-center gap-4 rounded-2xl px-4 py-3 text-left transition duration-200 hover:bg-slate-800 ${isSelected ? 'bg-slate-800 ring-1 ring-blue-500/30' : 'bg-transparent'}`}
      onClick={() => setSelectedConversation(user)}
    >
      <div className={`avatar ${isOnline ? 'avatar-online' : ''}`}>
        <div className="w-12 rounded-full ring-2 ring-white/10">
          <img alt={user.name} src="https://img.daisyui.com/images/profile/demo/gordon@192.webp" />
        </div>
      </div>
      <div className='min-w-0 flex-1'>
        <h1 className='truncate font-semibold text-slate-100'>
          {user.name}
        </h1>
        <span className='block truncate text-sm text-slate-400'>{user.email}</span>
      </div>
    </button>
  )
}

export default User