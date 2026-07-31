import React from 'react'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Signup from './components/Signup'

const router = createBrowserRouter([
  {
    path:"/",
    element:<Homepage />
  },
   {
    path:"/register",
    element:<Signup />
  },
   {
    path:"/login",
    element:<Login />
  }
  
])

const App = () => {
  return (
    <div>
      <RouterProvider router={router} /> 
    </div>
  )
}

export default App