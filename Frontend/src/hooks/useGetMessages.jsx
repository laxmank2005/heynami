import { useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setMessages } from "../redux/messageSlice";
import { API_ENDPOINTS } from "../config/api";

const useGetMessages = async () => {
  const { selectedUser } = useSelector((store) => store.user);
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const authUser = JSON.parse(localStorage.getItem("authUser"));
        axios.defaults.withCredentials = true;
        const res = await axios.get(
          API_ENDPOINTS.MESSAGE.GET(selectedUser?._id), {
            headers: {
              "Authorization": `Bearer ${authUser?.token}`
            }
          }
        );
        dispatch(setMessages(res.data));
      } catch (error) {
        // Error fetching messages
      }
    };
    fetchMessages();
  },[selectedUser, dispatch]);
};

export default useGetMessages;
