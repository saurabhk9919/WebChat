import React from 'react'
import Left from './home/left/Left.jsx'
import Right from './home/right/Right.jsx'
import Signup from './component/Signup.jsx'
import Login from './component/Login.jsx'
import { useAuth } from './context/AuthProvider.jsx';
import { Navigate, Route, Routes} from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

const App = () => {
  const {authUser} = useAuth();

  return (
    <>
    <Routes>
      <Route path="/" 
      element={
        authUser ? (
        <div className='min-h-screen p-3 sm:p-4 lg:p-6'>
          <div className='mx-auto flex min-h-[calc(100vh-1.5rem)] w-full max-w-7xl overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/80 shadow-2xl shadow-black/30 backdrop-blur-xl sm:min-h-[calc(100vh-2rem)] lg:min-h-[calc(100vh-3rem)]'>
            <Left></Left>
            <Right></Right>
          </div>
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