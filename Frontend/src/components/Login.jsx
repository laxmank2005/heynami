import React from "react";
import useState from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setAuthUser } from "../redux/userSlice";
import { IoEye, IoEyeOff } from "react-icons/io5";

const Login = () => {
  const [user, setUser] = React.useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = React.useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmithHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `http://localhost:8080/api/v1/user/login`,
        user,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        },
      );

      const userData = {
        _id: res.data._id,
        fullName: res.data.fullName,
        username: res.data.username,
        profilePhoto: res.data.profilePhoto
      };

      dispatch(setAuthUser(userData));
      localStorage.setItem("authUser", JSON.stringify(userData));

      if (res.data.success) {
        //////////////
        toast.success(res.data.message);
        navigate("/");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    }
    setUser({
      username: "",
      password: "",
    });
  };

  return (
    <div className=" min-w-96 mx-auto ">
      <div className="w-full  p-6 rounded-lg shadow-md">
        <h1 className="text-3xl text-[#6087D0] font-bold text-center">Login</h1>
        <form onSubmit={onSubmithHandler} action="">
          <div>
            <label className="label p-2">
              <span className="text-base label-text">Username</span>
            </label>

            <input
              value={user.username}
              onChange={(e) => setUser({ ...user, username: e.target.value })}
              className="input w-full input-bordered h-10"
              type="text"
              placeholder="Username"
            />
          </div>

          <div>
            <label className="label p-2">
              <span className="text-base label-text">Password</span>
            </label>

            <div className="relative">
              <input
                value={user.password}
                onChange={(e) => setUser({ ...user, password: e.target.value })}
                className="input w-full input-bordered h-10 pr-10"
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <IoEyeOff size={20} /> : <IoEye size={20} />}
              </button>
            </div>
          </div>

          <p className="text-center mt-4 my-2 ">
            Don't have an account?
            <Link to="/register" className="text-sm  hover:underline">
              <span className="text-[#6087D0]">Signup</span>
            </Link>
          </p>

          <div className="">
            <button
              type="submit"
              className="btn btn-block mt-4 bg-[#6087D0] text-white h-10 rounded-md border-gray-200 hover:bg-[#3f5a9e] transition-all duration-300 cursor-pointer"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
