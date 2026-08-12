import React from 'react'
import { MdSearch } from "react-icons/md";
import { BiLogOut } from "react-icons/bi";
import OtherUsers from './OtherUsers'
import axios from 'axios';
import { toast } from "react-hot-toast";
import { useNavigate } from 'react-router-dom';
import { useSelector,useDispatch } from 'react-redux';
import { setAuthUser, setOtherUsers } from '../redux/userSlice';
import { useState } from 'react';
import { API_ENDPOINTS } from '../config/api';
import ThemeToggle from './ThemeToggle';
 

const Sidebar = () => {
  const [search ,setSearch]=useState("");
  const {otherUsers, authUser, selectedUser}=useSelector(store=>store.user)
  const dispatch =useDispatch();

  const navigate =useNavigate();
  const logoutHandler =async()=>{
    try{
      const res =await axios.get(API_ENDPOINTS.USER.LOGOUT)
      localStorage.removeItem("authUser");
      navigate("/login");
      toast.success(res.data.message);
      dispatch(setAuthUser(null));
    }
    catch(error){
      console.log(error)
    }
  }
  const searchSubmitHandler =(e)=>{
    e.preventDefault();
    if (!search) {
      toast.error("Please enter a username to search");
      return;
    }
  }


  return (
    <div className={`w-full sm:w-80 md:w-96 bg-white dark:bg-[#111111] border-r border-gray-200 dark:border-stone-800 flex-col h-full transition-colors duration-300 ${selectedUser ? 'hidden sm:flex' : 'flex'}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-stone-800 bg-gray-50 dark:bg-[#0a0a0a] transition-colors duration-300">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <img 
              src={authUser?.profilePhoto} 
              alt="profile" 
              className="w-10 h-10 rounded-full border-2 border-blue-500 dark:border-indigo-500"
            />
            <div>
              <h3 className="text-gray-900 dark:text-white font-semibold text-sm transition-colors">{authUser?.fullName}</h3>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <ThemeToggle className="!p-2 border-none !bg-transparent hover:!bg-gray-200 dark:hover:!bg-stone-800 shadow-none !text-gray-600 dark:!text-stone-300" />
            <button 
              onClick={logoutHandler}
              className='text-gray-600 dark:text-stone-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-lg transition-all duration-200'
              title="Logout"
            >
              <BiLogOut className='h-5 w-5' />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <form onSubmit={searchSubmitHandler} className='flex items-center gap-2'>
          <div className="flex-1 relative">
            <input
              value={search}
              onChange={(e)=>setSearch(e.target.value)}
              className='w-full pl-10 pr-4 py-2 rounded-lg bg-white dark:bg-[#1a1a1a] border border-gray-300 dark:border-stone-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-stone-500 outline-none focus:border-blue-500 dark:focus:border-indigo-500 focus:ring-1 focus:ring-blue-500 dark:focus:ring-indigo-500 transition text-sm' 
              type="text" 
              placeholder='Search conversations...' 
            />
            <MdSearch className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-stone-500 h-5 w-5' />
          </div>
        </form>
      </div>

      {/* Users List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <OtherUsers search={search} />
      </div>
    </div>
  )
}

export default Sidebar