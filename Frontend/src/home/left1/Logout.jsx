import React from 'react'
import { BiLogOut } from 'react-icons/bi'

function Logout() {
  return (
    <div className='w-[3%] bg-slate-950 text-white flex flex-col justify-end'>
     <div className='p-4 align-bottom'>
          <form action="">
            <div className='flex space-x-3'>
            
            <button><BiLogOut className='text-5xl p-2 hover:bg-gray-600 rounded-lg'/></button>
            </div>
          </form>
        </div>
    
    
    </div>
  )
}

export default Logout