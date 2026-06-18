import React from 'react'
import { useForm } from 'react-hook-form'
import axios from 'axios';
import { useAuth } from '../context/AuthProvider.jsx';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';


export default function Login() {
  const { setAuthUser } = useAuth();

   const {
      register,
      handleSubmit,
      formState: { errors },
    } = useForm();

const onSubmit = (data) => {
    const userInfo={
      
      email:data.email,
      password:data.password,
     
    };
    //Sending data to backend
    axios.post("/api/users/login",userInfo, {
      withCredentials: true
    })
    .then((response)=>{
        console.log("Login successful", response.data);
        if(response.status === 200){
          toast.success("Login successful! Welcome back.");
        }
        localStorage.setItem("userInfo", JSON.stringify(response.data.user));
        setAuthUser(response.data.user);
    }).catch((error)=>{
      if (error.response) {
        toast.error("There was an error during login! " + (error.response.data?.message || "Please try again."));
      } else {
        toast.error("There was an error during login! Please try again.");
      }
    });
  };


  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-slate-950/75 p-8 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-10">
        <h2 className="mb-3 text-center text-3xl font-bold text-slate-100">Login</h2>
        <p className="mb-8 text-center text-sm text-slate-400">Welcome back. Continue your conversations.</p>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-5">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              {...register('email', { required: true })}
              className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-slate-100 placeholder-slate-500 focus:border-blue-500 focus:outline-none"
            />
            {errors.email && <span className="text-red-400 text-sm">This field is required</span>}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Password
            </label>
            <input
              type="password" 
              placeholder="Enter your password"
              {...register('password', { required: true })}
              className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-slate-100 placeholder-slate-500 focus:border-blue-500 focus:outline-none"
            />
            {errors.password && <span className="text-red-400 text-sm">This field is required</span>}
          </div> 

          <button
            type="submit"
            className="w-full rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3 font-bold text-white transition duration-200 hover:brightness-110"
          >
            Login
          </button>
        </form>

        <p className="mt-4 text-center text-slate-400">
          Don't have an account? <Link to="/signup" className="text-blue-400 hover:text-blue-300 underline">Sign Up</Link>
        </p>
      </div>
    </div>
  )
}