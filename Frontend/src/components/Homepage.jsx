import React, { useEffect } from 'react'
import Sidebar from './Sidebar'
import MessageContainer from './MessageContainer'
import { useDispatch } from 'react-redux'
import { setAuthUser } from '../redux/userSlice'


const Homepage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const storedUser = localStorage.getItem("authUser");
    if (storedUser) {
      dispatch(setAuthUser(JSON.parse(storedUser)));
    }
  }, [dispatch]);

  return (
    <div className='flex  sm:h-[450px] md:h-[550px] backdrop-filter backdrop-blur-lg rounded-lg overflow-hidden bg-black-100 shadow-lg'>
      <Sidebar/>
      

      <MessageContainer/>
      
    </div>
  )
}

export default Homepage