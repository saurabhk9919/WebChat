import React from 'react'
import { IoSend } from 'react-icons/io5'

function Type() {
  return (
    <>
   <div className='flex items-center gap-3 p-4 bg-slate-900 border-t border-slate-700'>
    
    <div className='flex-1'>
        <input 
          type="text" 
          placeholder="Type a message..." 
          className="w-full px-4 py-3 bg-slate-800 text-white rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none transition duration-200 placeholder-slate-400"
        />
    </div>
    <button className='p-3 text-2xl text-blue-500 hover:bg-blue-600 hover:text-white rounded-lg transition duration-200 hover:scale-110'>
        <IoSend/>
    </button>
   </div>
    </>
  )
}

export default Type