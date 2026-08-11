import React from "react";
import useState from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setAuthUser } from "../redux/userSlice";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { BsChatDotsFill, BsArrowRight, BsPerson, BsLock } from "react-icons/bs";
import { API_ENDPOINTS } from "../config/api";

const Login = () => {
  const [user, setUser] = React.useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = React.useState(false);
  const [focused, setFocused] = React.useState("");

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
    <div className="min-h-screen flex font-[Inter,system-ui,sans-serif]">

      {/* ── Right: Login Form ── */}
      <div className="flex-1 flex items-center justify-center bg-stone-50 px-6 py-12 relative overflow-hidden">
        {/* Subtle background blob */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-indigo-100/50 blur-[100px] -z-0" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full bg-violet-100/40 blur-[80px] -z-0" />

        <div className="w-full max-w-md relative z-10">
          {/* Mobile logo — only shows on smaller screens */}
          <div className="lg:hidden flex items-center justify-center gap-2.5 mb-8">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-md">
                <BsChatDotsFill className="text-white text-base" />
              </div>
              <span className="text-xl font-bold text-stone-900 tracking-tight">
                Ping<span className="text-indigo-600">.</span>
              </span>
            </Link>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-stone-900 tracking-tight mb-2">
              Welcome back
            </h1>
            <p className="text-stone-500 text-sm">
              Sign in to your account to continue your conversations.
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl shadow-xl shadow-stone-200/50 border border-stone-200/80 p-8">
            <form onSubmit={onSubmithHandler} className="space-y-5">
              {/* Username Input */}
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-2">
                  Username
                </label>
                <div className={`relative flex items-center rounded-xl border-2 transition-all duration-200 ${
                  focused === 'username' 
                    ? 'border-indigo-500 shadow-sm shadow-indigo-100' 
                    : 'border-stone-200 hover:border-stone-300'
                }`}>
                  <div className="pl-4 pr-2">
                    <BsPerson className={`text-lg transition-colors duration-200 ${
                      focused === 'username' ? 'text-indigo-500' : 'text-stone-400'
                    }`} />
                  </div>
                  <input
                    value={user.username}
                    onChange={(e) => setUser({ ...user, username: e.target.value })}
                    onFocus={() => setFocused('username')}
                    onBlur={() => setFocused('')}
                    className="flex-1 px-2 py-3 bg-transparent outline-none text-stone-900 text-sm placeholder:text-stone-400"
                    type="text"
                    placeholder="Enter your username"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-2">
                  Password
                </label>
                <div className={`relative flex items-center rounded-xl border-2 transition-all duration-200 ${
                  focused === 'password' 
                    ? 'border-indigo-500 shadow-sm shadow-indigo-100' 
                    : 'border-stone-200 hover:border-stone-300'
                }`}>
                  <div className="pl-4 pr-2">
                    <BsLock className={`text-lg transition-colors duration-200 ${
                      focused === 'password' ? 'text-indigo-500' : 'text-stone-400'
                    }`} />
                  </div>
                  <input
                    value={user.password}
                    onChange={(e) => setUser({ ...user, password: e.target.value })}
                    onFocus={() => setFocused('password')}
                    onBlur={() => setFocused('')}
                    className="flex-1 px-2 py-3 bg-transparent outline-none text-stone-900 text-sm placeholder:text-stone-400"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="pr-4 pl-2 text-stone-400 hover:text-stone-600 transition-colors"
                  >
                    {showPassword ? <IoEyeOff size={18} /> : <IoEye size={18} />}
                  </button>
                </div>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                className="group w-full flex items-center justify-center gap-2 bg-stone-900 text-white py-3.5 rounded-xl font-semibold text-sm hover:bg-stone-800 transition-all duration-200 shadow-lg shadow-stone-300/40 hover:shadow-stone-400/50 mt-2"
              >
                Sign In
                <BsArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Divider */}
              <div className="flex items-center gap-4 py-1">
                <div className="flex-1 h-px bg-stone-200" />
                <span className="text-xs text-stone-400 font-medium">or</span>
                <div className="flex-1 h-px bg-stone-200" />
              </div>

              {/* Sign Up Link */}
              <p className="text-center text-sm text-stone-500">
                Don't have an account?{' '}
                <Link 
                  to="/register" 
                  className="text-indigo-600 font-semibold hover:text-indigo-700 transition"
                >
                  Create one
                </Link>
              </p>
            </form>
          </div>

          {/* Back to home */}
          <div className="text-center mt-6">
            <Link to="/" className="text-xs text-stone-400 hover:text-stone-600 transition">
              ← Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
