import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setOtherUsers } from "../redux/userSlice";
import { API_ENDPOINTS } from "../config/api";

const useGetOtherUsers = () => {
  const dispatch = useDispatch();
  const { authUser } = useSelector(store => store.user);

  const fetchConversationUsers = useCallback(async () => {
    if (!authUser) return;
    try {
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
  }, [dispatch, authUser]);

  // Fetch on mount (covers page refresh) and whenever auth changes
  useEffect(() => {
    fetchConversationUsers();
  }, [fetchConversationUsers]);

  // Expose refetch so other components can trigger a re-fetch (e.g. after first message sent)
  return { refetch: fetchConversationUsers };
};

export default useGetOtherUsers;