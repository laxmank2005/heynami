import React from 'react'
import { Link } from 'react-router-dom'

const Login = () => {
  return (
    <div className=" min-w-96 mx-auto ">
        <div className='w-full  p-6 rounded-lg shadow-md'>
            <h1 className='text-3xl text-[#6087D0] font-bold text-center'>Login</h1>
            <form action="">

              <div>
                <label class="label p-2">
                  <span className='text-base label-text'>Username</span>
                </label>
                
                <input className='input w-full input-bordered h-10' type="text" placeholder='Username' />
              </div>

              <div>
                <label class="label p-2">
                  <span className='text-base label-text'>Password</span>
                </label>
                
                <input className='input w-full input-bordered h-10' type="password" placeholder='Enter password' />
              </div>

              

              <p className='text-center mt-4 my-2 '>Don't have an account?
                <Link to="/register" className='text-sm  hover:underline'>
              <span className='text-[#6087D0]'>Signup</span>
              </Link>
              </p>
              


              <div className=''>
                 <button className='btn btn-block mt-4 bg-[#6087D0] text-white h-10 rounded-md border-gray-200 hover:bg-[#3f5a9e] transition-all duration-300 cursor-pointer'>
                Login
              </button>
              </div>
             

            </form>
        </div>
        </div>
  )
}

export default Login