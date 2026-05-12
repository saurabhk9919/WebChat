import React from 'react'
import Left from './home/left/Left.jsx'
import Right from './home/right/Right.jsx'
import Signup from './component/Signup.jsx'
import Login from './component/Login.jsx'
import { useAuth } from './context/AuthProvider.jsx';
import { Navigate, Route, Routes} from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

const App = () => {
  const {authUser} = useAuth();
  console.log("Auth User in App.jsx:", authUser);
  
  return (
    
    <>
    {/* <Loading></Loading> */}
    <Routes>
      <Route path="/" 
      element={
        authUser ? (
        <div className='flex w-full h-screen'>
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
    <Toaster />
    </>)
}

export default App