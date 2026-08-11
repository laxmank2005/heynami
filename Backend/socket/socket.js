import {Server} from 'socket.io';
import http from 'http';
import express from "express"


const app=express();

const server =http.createServer(app);

const frontendUrl = process.env.FRONTEND_URL ? (process.env.FRONTEND_URL.endsWith('/') ? process.env.FRONTEND_URL.slice(0, -1) : process.env.FRONTEND_URL) : 'http://localhost:5173';

const io =new Server(server,{
    cors:{
        origin: frontendUrl,
        methods:['GET','POST'],
        credentials: true
    },
});

export const getReceiverSocketId =(receiverId)=>{
    return userSocketMap[receiverId];
}
const userSocketMap={};



io.on('connection',(socket)=>{
    console.log('user connected',socket.id);

    const userId=socket.handshake.query.userId
    if(userId && userId !== "undefined"){
        userSocketMap[userId]=socket.id;
    }

    io.emit('getOnlineUsers',Object.keys(userSocketMap));

    socket.on('disconnect',()=>{
        console.log('user disconnected',socket.id);
        if (userId && userSocketMap[userId] === socket.id) {
            delete userSocketMap[userId];
        }
        io.emit('getOnlineUsers',Object.keys(userSocketMap));
    })
})
  
export {app,io,server}



