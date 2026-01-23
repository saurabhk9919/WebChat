import React from 'react'
import Search from './Search.jsx'
import Users from './Users.jsx'


export default function Left() {
  return (
    <div className='w-[30%] h-screen flex flex-col text-white bg-black overflow-hidden'>
      <h1 className='text-3xl font-bold p-4'>Chats</h1>
      <Search></Search>
      <hr />
      <Users></Users>
    </div>
   
  )
}
