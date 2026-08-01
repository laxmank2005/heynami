import React from 'react'
import Sidebar from './Sidebar'
import MessageContainer from './MessageContainer'


const Homepage = () => {
  return (
    <div className='flex  sm:h-[450px] md:h-[550px] backdrop-filter backdrop-blur-lg rounded-lg overflow-hidden bg-black-100 shadow-lg'>
      <Sidebar/>
      

      <MessageContainer/>
      
    </div>
  )
}

export default Homepage