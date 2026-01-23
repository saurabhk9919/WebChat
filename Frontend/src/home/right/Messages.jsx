import React from 'react'
import Message from './Message.jsx'

function Messages() {
  return (
    <>
    <div className='flex-1 overflow-y-auto p-4 space-y-2' style={{scrollBehavior: "smooth"}}>
        <Message></Message>
        <Message></Message>
        <Message></Message>
        <Message></Message>
        <Message></Message>
        <Message></Message>
        <Message></Message>
        <Message></Message>
        <Message></Message>
    </div>
  </>
  )
}

export default Messages