import React from 'react'
import Left from './home/left/left.jsx'
import Right from './home/right/Right.jsx'
import Logout from './home/left1/Logout.jsx'
import Signup from './component/Signup.jsx'
import Login from './component/Login.jsx'
import { useAuth } from './context/AuthProvider.jsx';

const App = () => {
  const {authUser, setAuthUser} = useAuth();
  console.log("Auth User in App.jsx:", authUser);
  
  return (
    
    <>
  {/* <div className='flex w-full h-screen'>
    <Logout></Logout>
    <Left></Left>
    <Right></Right> 
 </div> */}

 {/* <Signup></Signup> */}
  <Login></Login>
     </> 
  )
}

export default App