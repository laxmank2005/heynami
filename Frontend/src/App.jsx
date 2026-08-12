import React from "react";
import "./index.css";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";

import Homepage from "./components/Homepage";
import Register from "./components/Register";
import Login from "./components/Login";
import LandingPage from "./components/LandingPage";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import io from 'socket.io-client'
import { useState } from "react";
import { setOnlineUsers } from "./redux/userSlice";
import { setSocket } from "./redux/socketSlice";
import { SOCKET_URL } from "./config/api";

// Wrapper that decides: landing page (unauthed) or chat (authed)
const RootRoute = () => {
  const { authUser } = useSelector((store) => store.user);
  return authUser ? <Homepage /> : <LandingPage />;
};

const router = createBrowserRouter([
  {
    path:"/",
    element:<RootRoute />
  },
  {
    path:"/landing",
    element:<LandingPage />
  },
   {
    path:"/register",
    element:<Register />
  },
   {
    path:"/login",
    element:<Login />
  },
  {
    path: "*",
    element: <Navigate to="/" />
  }
])

const App = () => {

  const {authUser} = useSelector(store => store.user);
  const {socket} = useSelector(store => store.socket);
  const dispatch =useDispatch();

  useEffect(() => {
    if (authUser) {
      const socketInstance = io(SOCKET_URL, {
        query: {
          userId: authUser._id
        }
      });
     dispatch (setSocket(socketInstance));
     socketInstance.on('getOnlineUsers',(onlineUsers)=>{
      dispatch(setOnlineUsers(onlineUsers))
     });    
     return ()=>socketInstance.close();            
    }
    else{
      if(socket){
        socket.close();
        dispatch(setSocket(null));
      }
    }
  }, [authUser]);
  return (
    <div className="min-h-[100dvh] w-full">
      <RouterProvider router={router} /> 
    </div>
  )
}

export default App