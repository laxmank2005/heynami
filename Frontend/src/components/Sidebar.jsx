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
    <div className={`w-full sm:w-80 md:w-96 bg-white border-r border-gray-200 flex-col h-full ${selectedUser ? 'hidden sm:flex' : 'flex'}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <img 
              src={authUser?.profilePhoto} 
              alt="profile" 
              className="w-10 h-10 rounded-full border-2 border-blue-500"
            />
            <div>
              <h3 className="text-gray-900 font-semibold text-sm">{authUser?.fullName}</h3>
            </div>
          </div>
          <button 
            onClick={logoutHandler}
            className='text-gray-600 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-all duration-200'
            title="Logout"
          >
            <BiLogOut className='h-5 w-5' />
          </button>
        </div>

        {/* Search Bar */}
        <form onSubmit={searchSubmitHandler} className='flex items-center gap-2'>
          <div className="flex-1 relative">
            <input
              value={search}
              onChange={(e)=>setSearch(e.target.value)}
              className='w-full pl-10 pr-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-900 placeholder-gray-500 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition text-sm' 
              type="text" 
              placeholder='Search conversations...' 
            />
            <MdSearch className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5' />
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