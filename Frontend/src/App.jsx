import React from 'react'
import Left from './home/left/left.jsx'
import Right from './home/right/Right.jsx'
import Logout from './home/left1/Logout.jsx'
import Signup from './component/Signup.jsx'
import Login from './component/Login.jsx'
import { useAuth } from './context/AuthProvider.jsx';
import { Navigate, Route, Routes} from 'react-router-dom';

const App = () => {
  const {authUser, setAuthUser} = useAuth();
  console.log("Auth User in App.jsx:", authUser);
  
  return (
    
    <>
    <Routes>
      <Route path="/" 
      element={
        authUser ? (
        <div className='flex w-full h-screen'>
    <Logout></Logout>
    <Left></Left>
    <Right></Right> 
 </div>
 ): (
 <Navigate to="/login"/>
        )
      } />
      <Route path="/login" 
       element={authUser
         ? <Navigate to={"/"}/> : <Login/>}/>

      <Route path="/signup"
       element={authUser 
       ? <Navigate to={"/"}/> : <Signup/>}/>
      
    </Routes>
     </> 
  )
}

export default App