import React from 'react'
import Search from './Search.jsx'
import Users from './Users.jsx'


export default function Left() {
  return (
    <div className='flex w-[34%] min-w-[290px] max-w-[420px] flex-col overflow-hidden border-r border-white/10 bg-slate-950/95 text-white'>
      <div className='border-b border-white/10 px-5 py-5'>
        <h1 className='text-2xl font-semibold tracking-tight'>Chats</h1>
        <p className='mt-1 text-sm text-slate-400'>Search people and jump into a conversation.</p>
      </div>
      <Search></Search>
      <Users></Users>
    </div>
   
  )
}
