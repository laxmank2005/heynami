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
    <div className='h-screen w-screen flex flex-col sm:flex-row bg-white overflow-hidden'>
      <Sidebar/>
      <MessageContainer/>
    </div>
  )
}

export default Homepage