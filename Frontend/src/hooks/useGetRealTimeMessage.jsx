import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux";
import { addMessage } from "../redux/messageSlice";


import { updateUserList } from "../redux/userSlice";

const useGetRealTimeMessage =()=>{
    const {socket} =useSelector(store=>store.socket);
    const {selectedUser} = useSelector(store=>store.user);
    const dispatch = useDispatch();

    useEffect(()=>{
        const handleNewMessage = (newMessage)=>{
            const isCurrentlySelected = selectedUser?._id === newMessage.senderId;
            
            if (isCurrentlySelected) {
                dispatch(addMessage(newMessage))
            }
            
            dispatch(updateUserList({
                userId: newMessage.senderId,
                isUnread: !isCurrentlySelected
            }));
        };

        socket?.on("newMessage", handleNewMessage);
        return () => socket?.off("newMessage", handleNewMessage);
    },[socket, selectedUser, dispatch]);
}

export default useGetRealTimeMessage;