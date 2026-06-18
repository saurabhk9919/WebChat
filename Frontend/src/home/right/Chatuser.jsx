import React from 'react'
import useConversation from '../../statemanage/useConversation.js'
import { useSocketContext } from '../../context/SocketContext.jsx';

function Chatuser() {
  const { selectedConversation } = useConversation()
  console.log("Selected Conversation:", selectedConversation);
  const { onlineUsers } = useSocketContext();
  const selectedUserId = selectedConversation?._id?.toString?.() || selectedConversation?._id || "";
  const isOnline = selectedUserId ? onlineUsers.map((userId) => userId?.toString?.() || userId).includes(selectedUserId) : false;
  const getOnlineUserStatus = (userId) => {
    const normalizedUserId = userId?.toString?.() || userId;
    return onlineUsers.map((id) => id?.toString?.() || id).includes(normalizedUserId) ? "Online" : "Offline"; //socket io mei id hai toh onlinr otjerwsie offline
  }

  if (!selectedConversation) {
    return (
      <div className='flex h-16 items-center justify-center rounded-2xl border border-white/10 bg-slate-950/60 px-5 py-4'>
        <span className='text-slate-400'>Select a user to start chatting</span>
      </div>
    )
  }

  return (
    <>
    <div className='flex h-16 items-center gap-4 rounded-2xl bg-transparent px-0 py-0 duration-300 cursor-pointer'>

        <div>
             <div className={`avatar ${isOnline ? 'avatar-online' : ''}`}>
  <div className="w-12 rounded-full ring-2 ring-white/10">
    <img src={selectedConversation.profilePic || "https://img.daisyui.com/images/profile/demo/gordon@192.webp"} />
  </div>
</div>
        </div>
        <div className='flex flex-col justify-center'>
            <h1 className='font-semibold text-lg leading-tight'>{selectedConversation.fullname || selectedConversation.name}</h1>
            <span className='text-sm text-slate-300'>{getOnlineUserStatus(selectedConversation._id)}</span>
        </div>
    </div>
   </>
  )
}

export default Chatuser