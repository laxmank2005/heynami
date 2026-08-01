import React from 'react'
import { MdSearch } from "react-icons/md";
import OtherUsers from './OtherUsers'

const Sidebar = () => {
  return (
    <div className="border-r border-slate-100 p-4 flex flex-col">
        <form action="" className='flex items-center p-2'>
            <input className='input input-border rounded-3xl outline-none' type="text" placeholder='Search...' />
            
            <button type='submit' className='bg-[#6087D0] text-white rounded-3xl p-2 ml-2 cursor-pointer hover:bg-[#3f5a9e] transition-all duration-300'>
                <MdSearch className='h-6 w-6 outline-none' />
            </button>
            
        </form>
        <div className="divider px-3 "></div>
        <OtherUsers/>

        <div>
          <button className='btn  mt-4 bg-[#6087D0] text-white h-10 rounded-lg border-gray-200 hover:bg-[#3f5a9e] transition-all duration-300 cursor-pointer'>
            logout
          </button>
        </div>
    </div>
  )
}

export default Sidebar