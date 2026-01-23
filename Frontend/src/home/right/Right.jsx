import React from 'react'
import Chatuser from './Chatuser.jsx'
import Messages from './Messages.jsx'
import Type from './Type.jsx'

export default function Right() {
  return (
    <>
    <div className='w-[70%] h-screen flex flex-col gap-4 p-5 text-white bg-slate-800'>
    <Chatuser></Chatuser>
    <Messages></Messages>
    <Type></Type>
    </div>
    </>
  )
}
