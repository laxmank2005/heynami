import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setAuthUser } from "../redux/userSlice";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { BsChatDotsFill, BsArrowRight, BsPerson, BsLock, BsArrowLeft, BsEnvelope } from "react-icons/bs";
import { API_ENDPOINTS } from "../config/api";
import ThemeToggle from "./ThemeToggle";

const Login = () => {
  const [user, setUser] = React.useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = React.useState(false);
  const [focused, setFocused] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmithHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);
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
        email: res.data.email,
        mobile: res.data.mobile,
        profilePhoto: res.data.profilePhoto,
        token: res.data.token,
      };

      dispatch(setAuthUser(userData));
      localStorage.setItem("authUser", JSON.stringify(userData));

      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/");
      }
    } catch (error) {
      if (error.response?.data?.notVerified) {
        toast.error("Please verify your email before logging in.");
        navigate("/register", {
          state: {
            email: user.email,
            isVerifyOnly: true,
          },
        });
      } else {
        toast.error(error.response?.data?.message || "Login failed");
      }
    } finally {
      setIsLoading(false);
    }
    setUser({
      email: "",
      password: "",
    });
  };

  return (
    <div className="min-h-screen flex font-[Inter,system-ui,sans-serif] bg-gray-50 dark:bg-[#0d0d0d] transition-colors duration-300">

      {/* ── Top Navigation (Back to Home & Theme Toggle) ── */}
      <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-50">
        <Link 
          to="/" 
          className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-900 dark:text-stone-400 dark:hover:text-white transition-colors bg-white/50 dark:bg-[#111]/50 backdrop-blur-md px-4 py-2.5 rounded-xl border border-gray-200/50 dark:border-stone-800"
        >
          <BsArrowLeft className="text-lg" />
          Back to home
        </Link>
        <ThemeToggle />
      </div>

      {/* ── Right: Login Form ── */}
      <div className="flex-1 flex items-center justify-center relative overflow-hidden pt-20 sm:pt-0">
        {/* Subtle background blob */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-violet-100/50 dark:bg-violet-900/20 blur-[100px] -z-0" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full bg-violet-100/40 dark:bg-violet-900/20 blur-[80px] -z-0" />

        <div className="w-full max-w-md relative z-10 px-6 sm:px-0">
          {/* Mobile logo — only shows on smaller screens */}
          <div className="lg:hidden flex items-center justify-center gap-2.5 mb-8">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-violet-600 flex items-center justify-center shadow-md">
                <BsChatDotsFill className="text-white text-base" />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white tracking-tight transition-colors">
                Ping<span className="text-violet-600">.</span>
              </span>
            </Link>
          </div>

          {/* Header */}
          <div className="mb-8 mt-10 sm:mt-0 text-center sm:text-left">
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2 transition-colors">
              Welcome back
            </h1>
            <p className="text-gray-500 dark:text-stone-400 text-sm transition-colors">
              Sign in to your account to continue your conversations.
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white dark:bg-[#111] rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-gray-100 dark:border-stone-800 p-8 transition-colors">
            <form onSubmit={onSubmithHandler} className="space-y-5">
              {/* Email Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-stone-300 mb-2 transition-colors">
                  Email Address
                </label>
                <div className={`relative flex items-center rounded-xl border-2 transition-all duration-200 ${
                  focused === 'email' 
                    ? 'border-violet-500 dark:border-violet-500 shadow-sm shadow-violet-100 dark:shadow-violet-900/20 bg-white dark:bg-stone-900' 
                    : 'border-gray-200 dark:border-stone-700 hover:border-gray-300 dark:hover:border-stone-600 bg-gray-50 dark:bg-stone-900/50'
                }`}>
                  <div className="pl-4 pr-2">
                    <BsEnvelope className={`text-lg transition-colors duration-200 ${
                      focused === 'email' ? 'text-violet-500' : 'text-gray-400 dark:text-stone-500'
                    }`} />
                  </div>
                  <input
                    value={user.email}
                    onChange={(e) => setUser({ ...user, email: e.target.value })}
                    onFocus={() => setFocused('email')}
                    onBlur={() => setFocused('')}
                    className="flex-1 px-2 py-3 bg-transparent outline-none text-gray-900 dark:text-white text-sm placeholder:text-gray-400 dark:placeholder:text-stone-500"
                    type="email"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-stone-300 mb-2 transition-colors">
                  Password
                </label>
                <div className={`relative flex items-center rounded-xl border-2 transition-all duration-200 ${
                  focused === 'password' 
                    ? 'border-violet-500 dark:border-violet-500 shadow-sm shadow-violet-100 dark:shadow-violet-900/20 bg-white dark:bg-stone-900' 
                    : 'border-gray-200 dark:border-stone-700 hover:border-gray-300 dark:hover:border-stone-600 bg-gray-50 dark:bg-stone-900/50'
                }`}>
                  <div className="pl-4 pr-2">
                    <BsLock className={`text-lg transition-colors duration-200 ${
                      focused === 'password' ? 'text-violet-500' : 'text-gray-400 dark:text-stone-500'
                    }`} />
                  </div>
                  <input
                    value={user.password}
                    onChange={(e) => setUser({ ...user, password: e.target.value })}
                    onFocus={() => setFocused('password')}
                    onBlur={() => setFocused('')}
                    className="flex-1 px-2 py-3 bg-transparent outline-none text-gray-900 dark:text-white text-sm placeholder:text-gray-400 dark:placeholder:text-stone-500"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="pr-4 pl-2 text-gray-400 hover:text-gray-600 dark:hover:text-stone-300 transition-colors"
                  >
                    {showPassword ? <IoEyeOff size={18} /> : <IoEye size={18} />}
                  </button>
                </div>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="group w-full flex items-center justify-center gap-2 bg-violet-600 text-white py-3.5 rounded-xl font-semibold text-sm hover:bg-violet-700 transition-all duration-200 shadow-md shadow-violet-600/20 mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Sign In
                    <BsArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              {/* Divider */}
              <div className="flex items-center gap-4 py-1">
                <div className="flex-1 h-px bg-gray-200 dark:bg-stone-800 transition-colors" />
                <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">or</span>
                <div className="flex-1 h-px bg-gray-200 dark:bg-stone-800 transition-colors" />
              </div>

              {/* Sign Up Link */}
              <p className="text-center text-sm text-gray-500 dark:text-stone-400 transition-colors">
                Don't have an account?{' '}
                <Link 
                  to="/register" 
                  className="text-violet-600 dark:text-violet-400 font-semibold hover:text-violet-700 dark:hover:text-violet-300 transition-colors"
                >
                  Create one
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
