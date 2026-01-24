import React from 'react'
import { useForm } from 'react-hook-form'
import axios from 'axios';
import { useAuth } from '../context/AuthProvider.jsx';

export default function Signup() {
  const { authUser, setAuthUser } = useAuth();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

    const password = watch('password', '');
    const confirmPassword = watch('confirmPassword', '');
  const validatePasswordMatch = (value) => {
    return value === password || "Passwords do not match";
  }
  const onSubmit = async (data) => {
    const userInfo={
      name:data.name,
      email:data.email,
      password:data.password,
      confirmpassword:data.confirmPassword
    };
    //Sending data to backend
    await axios.post("http://localhost:5002/users/signup",userInfo)
    .then((response)=>{
        console.log("Signup successful", response.data);
        if(response.status === 201){
          alert("Signup successful! Please login.");
        }
        localStorage.setItem("userInfo", JSON.stringify(response.data.user));
        setAuthUser(response.data);

    }).catch((error)=>{
      if (error.response) {
        alert("There was an error during signup! " + (error.response.data?.message || "Please try again."));
      } else {
        alert("There was an error during signup! Please try again.");
      }
    });
  };

  return (
    <>
    <div className="flex items-center justify-center min-h-screen bg-slate-900">
      <div className="w-full max-w-md bg-slate-800 rounded-lg shadow-lg p-8 border border-slate-700">
        <h2 className="text-3xl font-bold text-center mb-8 text-slate-100">Sign Up</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-5">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Enter your name"
              {...register('name', { required: true })}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.confirmPassword && (
              <span className="text-red-400 text-sm">
                {errors.confirmPassword.message}
              </span>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Sign Up
          </button>
        </form>

        <p className="text-center text-slate-400 mt-4">
          Already have an account? <a href="#" className="text-blue-400 hover:text-blue-300 underline">Login</a>
        </p>
      </div>
    </div>
    </>
  )
}
    