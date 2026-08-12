import React, { useEffect } from 'react'
import Sidebar from './Sidebar'
import MessageContainer from './MessageContainer'
import { useDispatch } from 'react-redux'
import { setAuthUser } from '../redux/userSlice'
import useGetRealTimeMessage from '../hooks/useGetRealTimeMessage';

const Homepage = () => {
  const dispatch = useDispatch();
  useGetRealTimeMessage();

  useEffect(() => {
    const storedUser = localStorage.getItem("authUser");
    if (storedUser) {
      dispatch(setAuthUser(JSON.parse(storedUser)));
    }
  }, [dispatch]);

  return (
    <div className='h-[100dvh] w-full flex flex-col sm:flex-row bg-white dark:bg-[#0a0a0a] transition-colors duration-300 overflow-hidden'>
      <Sidebar/>
      <MessageContainer/>
    </div>
  )
}

export default Homepage