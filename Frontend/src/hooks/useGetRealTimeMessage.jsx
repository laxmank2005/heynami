import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux";
import { setMessages } from "../redux/messageSlice";


import { updateUserList } from "../redux/userSlice";

const useGetRealTimeMessage =()=>{
    const {socket} =useSelector(store=>store.socket);
    const {messages}=useSelector(store=>store.message);
    const {selectedUser} = useSelector(store=>store.user);
    const dispatch = useDispatch();

    useEffect(()=>{
        const handleNewMessage = (newMessage)=>{
            const isCurrentlySelected = selectedUser?._id === newMessage.senderId;
            
            if (isCurrentlySelected) {
                dispatch(setMessages([...messages,newMessage]))
            }
            
            dispatch(updateUserList({
                userId: newMessage.senderId,
                isUnread: !isCurrentlySelected
            }));
        };

        socket?.on("newMessage", handleNewMessage);
        return () => socket?.off("newMessage", handleNewMessage);
    },[socket, setMessages, messages, selectedUser, dispatch]);
}

export default useGetRealTimeMessage;