import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setOtherUsers } from "../redux/userSlice";
import { API_ENDPOINTS } from "../config/api";

const useGetOtherUsers = () => {
  const dispatch = useDispatch();


  useEffect(() => {
    const fetchOtherUsers = async () => {
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

    fetchOtherUsers();
  }, [dispatch]);
};

export default useGetOtherUsers;