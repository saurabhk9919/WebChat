import React from 'react'
import useConversation from '../../statemanage/useConversation.js'
import { useSocketContext } from '../../context/SocketContext.jsx';

function Chatuser() {
  const { selectedConversation } = useConversation()
  console.log("Selected Conversation:", selectedConversation);
  const { onlineUsers } = useSocketContext();
  const isOnline = selectedConversation ? onlineUsers.includes(selectedConversation._id) : false;
  const getOnlineUserStatus = (userId) => {
    return onlineUsers.includes(userId)? "Online" : "Offline"; //socket io mei id hai toh onlinr otjerwsie offline
  }

  if (!selectedConversation) {
    return (
      <div className='w-full h-[10vh] flex items-center justify-center bg-slate-900 px-5 py-4 rounded-lg'>
        <span className='text-slate-400'>Select a user to start chatting</span>
      </div>
    )
  }

  return (
    <>
    <div className='w-full h-[10vh] flex items-center gap-4 bg-slate-900 px-5 py-4 rounded-lg hover:bg-slate-700 duration-300 cursor-pointer'>

        <div>
             <div className={`avatar ${isOnline ? 'avatar-online' : ''}`}>
  <div className="w-16 rounded-full">
    <img src={selectedConversation.profilePic || "https://img.daisyui.com/images/profile/demo/gordon@192.webp"} />
  </div>
</div>
        </div>
        <div className='flex flex-col justify-center'>
            <h1 className='font-bold text-lg leading-tight'>{selectedConversation.fullname || selectedConversation.name}</h1>
            <span className='text-sm text-slate-300'>{getOnlineUserStatus(selectedConversation._id)}</span>
        </div>
    </div>
   </>
  )
}

export default Chatuser