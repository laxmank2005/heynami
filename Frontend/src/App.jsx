import React from "react";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Homepage from "./components/Homepage";
import Register from "./components/Register";
import Login from "./components/Login";

const router = createBrowserRouter([
  {
    path:"/",
    element:<Homepage />
  },
   {
    path:"/register",
    element:<Register />
  },
   {
    path:"/login",
    element:<Login />
  }
  
])

const App = () => {
  return (
    <div className="p-4 h-screen flex items-center justify-center   ">
      <RouterProvider router={router} /> 
    </div>
  )
}

export default App