import React from 'react'
import { MdSearch } from "react-icons/md";
import OtherUsers from './OtherUsers'
import axios from 'axios';
import { toast } from "react-hot-toast";
import { useNavigate } from 'react-router-dom';
import { useSelector,useDispatch } from 'react-redux';
import { setAuthUser, setOtherUsers } from '../redux/userSlice';
import { useState } from 'react';
 

const Sidebar = () => {
  const [search ,setSearch]=useState("");
  const {otherUsers}=useSelector(store=>store.user)
  const dispatch =useDispatch();

  const navigate =useNavigate();
  const logoutHandler =async()=>{
    try{
      const res =await axios.get(`http://localhost:8080/api/v1/user/logout`)
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
const conversationUser = otherUsers?.find((user) => user.fullName.toLowerCase().includes(search.toLowerCase()))
    if (conversationUser){
      dispatch(setOtherUsers([conversationUser]));
    }
    else{toast.error("User not found !");
    }
  }


  return (
    <div className="border-r border-slate-100 p-4 flex flex-col">
        <form onSubmit={searchSubmitHandler} action="" className='flex items-center p-2'>
            <input
            value={search}
            onChange={(e)=>setSearch(e.target.value)}
            className='input input-border rounded-3xl outline-none' type="text" placeholder='Search...' />
            
            <button type='submit' className='bg-[#6087D0] text-white rounded-3xl p-2 ml-2 cursor-pointer hover:bg-[#3f5a9e] transition-all duration-300'>
                <MdSearch className='h-6 w-6 outline-none' />
            </button>
            
        </form>
        <div className="divider px-3 "></div>
        <OtherUsers/>

        <div>
          <button onClick={logoutHandler} className='btn  mt-4 bg-[#6087D0] text-white h-10 rounded-lg border-gray-200 hover:bg-[#3f5a9e] transition-all duration-300 cursor-pointer'>
            logout
          </button>
        </div>
    </div>
  )
}

export default Sidebar