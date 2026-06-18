import React from 'react'
import { useForm } from 'react-hook-form'
import axios from 'axios';
import { useAuth } from '../context/AuthProvider.jsx';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Signup() {
  const { setAuthUser } = useAuth();
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm();

  const validatePasswordMatch = (value) => {
    return value === getValues('password') || "Passwords do not match";
  }
  const onSubmit = async (data) => {
    const userInfo={
      name:data.name,
      email:data.email,
      password:data.password,
      confirmpassword:data.confirmPassword
    };
    //Sending data to backend
    await axios.post("/api/users/signup",userInfo, {
      withCredentials: true
    })
    .then((response)=>{
        console.log("Signup successful", response.data);
        if(response.status === 201){
          toast.success("Signup successful! Loading your chats...");
        }
        localStorage.setItem("userInfo", JSON.stringify(response.data.user));
        setAuthUser(response.data.user);

    }).catch((error)=>{
      if (error.response) {
        toast.error("There was an error during signup! " + (error.response.data?.message || "Please try again."));
      } else {
        toast.error("There was an error during signup! Please try again.");
      }
    });
  };

  return (
    <>
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-slate-950/75 p-8 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-10">
        <h2 className="mb-3 text-center text-3xl font-bold text-slate-100">Sign Up</h2>
        <p className="mb-8 text-center text-sm text-slate-400">Create your account and start chatting.</p>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-5">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Enter your name"
              {...register('name', { required: true })}
              className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-slate-100 placeholder-slate-500 focus:border-blue-500 focus:outline-none"
            />
            {errors.name && <span className="text-red-400 text-sm">This field is required</span>}
          </div>

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
            {errors.email && <span className="text-red-400 text-sm">This field is required</span>
            }
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              {...register('password', { required: true, minLength: 6 })}
              className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-slate-100 placeholder-slate-500 focus:border-blue-500 focus:outline-none"
            />
            {errors.password && (
              <span className="text-red-400 text-sm">
                This field is required and should be at least 6 characters
              </span>
            )}
          </div>

          
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="Confirm password"
              {...register('confirmPassword', { required: true, minLength: 6, validate: validatePasswordMatch })}
              className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-slate-100 placeholder-slate-500 focus:border-blue-500 focus:outline-none"
            />
            {errors.confirmPassword && (
              <span className="text-red-400 text-sm">
                {errors.confirmPassword.message}
              </span>
            )}
          </div>

          <button
            type="submit"
            className="w-full rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3 font-bold text-white transition duration-200 hover:brightness-110"
          >
            Sign Up
          </button>
        </form>

        <p className="mt-4 text-center text-slate-400">
          Already have an account? <Link to="/login" className="text-blue-400 hover:text-blue-300 underline">Login</Link>
        </p>
      </div>
    </div>
    </>
  )
}
    