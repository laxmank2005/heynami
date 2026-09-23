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

// Only accessible when NOT logged in (login, register)
const PublicOnlyRoute = ({ children }) => {
  const { authUser } = useSelector((store) => store.user);
  return authUser ? <Navigate to="/" replace /> : children;
};

// Only accessible when logged in (homepage)
const PrivateRoute = ({ children }) => {
  const { authUser } = useSelector((store) => store.user);
  return authUser ? children : <Navigate to="/landing" replace />;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <PrivateRoute><Homepage /></PrivateRoute>
  },
  {
    path: "/landing",
    element: <PublicOnlyRoute><LandingPage /></PublicOnlyRoute>
  },
  {
    path: "/register",
    element: <PublicOnlyRoute><Register /></PublicOnlyRoute>
  },
  {
    path: "/login",
    element: <PublicOnlyRoute><Login /></PublicOnlyRoute>
  },
  {
    path: "*",
    element: <Navigate to="/" replace />
  }
])

const App = () => {

  const {authUser} = useSelector(store => store.user);
  const {socket} = useSelector(store => store.socket);
  const dispatch =useDispatch();

  useEffect(() => {
    if (authUser) {
      const socketInstance = io(SOCKET_URL, {
        auth: {
          token: authUser.token
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