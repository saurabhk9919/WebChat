import React from 'react'
import Left from './home/left/left.jsx'
import Right from './home/right/Right.jsx'
import Logout from './home/left1/Logout.jsx'

const App = () => {
  return (
    <>
  <div className='flex w-full h-screen'>
    <Logout></Logout>
    <Left></Left>
    <Right></Right>
    
 </div>
     </> 
  )
}

export default App