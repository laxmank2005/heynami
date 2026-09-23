import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setOtherUsers } from "../redux/userSlice";
import { API_ENDPOINTS } from "../config/api";

const useGetOtherUsers = () => {
  const dispatch = useDispatch();
  const { messages } = useSelector(store => store.message);

  useEffect(() => {
    const fetchConversationUsers = async () => {
      try {
        const authUser = JSON.parse(localStorage.getItem("authUser"));
        const res = await fetch(API_ENDPOINTS.USER.GET_OTHER_USERS, {
          credentials: "include",
          headers: {
            "Authorization": `Bearer ${authUser?.token}`
          }
        });

        const data = await res.json();

        if (data.success) {
          dispatch(setOtherUsers(data.users));
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchConversationUsers();
  }, [dispatch, messages]);
  // Re-fetches when messages change (so new conversation partners appear in sidebar after first message)
};

export default useGetOtherUsers;