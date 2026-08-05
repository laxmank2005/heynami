import React from "react";
import useState from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setAuthUser } from "../redux/userSlice";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { API_ENDPOINTS } from "../config/api";

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
        API_ENDPOINTS.USER.LOGIN,
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to continue</p>
        </div>

        {/* Login Form Card */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8">
          <form onSubmit={onSubmithHandler} className="space-y-5">
            {/* Username Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                value={user.username}
                onChange={(e) => setUser({ ...user, username: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                type="text"
                placeholder="Enter your username"
                required
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  value={user.password}
                  onChange={(e) => setUser({ ...user, password: e.target.value })}
                  className="w-full px-4 py-2.5 pr-11 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition"
                >
                  {showPassword ? <IoEyeOff size={20} /> : <IoEye size={20} />}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 transition duration-200"
            >
              Sign In
            </button>

            {/* Sign Up Link */}
            <p className="text-center text-sm text-gray-600 mt-4">
              Don't have an account?{' '}
              <Link 
                to="/register" 
                className="text-blue-500 font-medium hover:text-blue-600 transition"
              >
                Create one
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
