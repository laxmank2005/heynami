import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { BsChatDotsFill, BsArrowRight, BsPerson, BsLock, BsPersonBadge, BsArrowLeft } from "react-icons/bs";
import { HiOutlineUser } from "react-icons/hi2";
import { API_ENDPOINTS } from "../config/api";
import ThemeToggle from "./ThemeToggle";

const Register = () => {
  const [user, setUser] = React.useState({
    fullName: "",
    username: "",
    password: "",
    confirmPassword: "",
    gender: "",
  });
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [focused, setFocused] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const navigate = useNavigate();

  const handleCheckbox = (gender) => {
    setUser({ ...user, gender });
  };

  const onSubmithHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axios.post(
        API_ENDPOINTS.USER.REGISTER,
        user,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        },
      );
      if (res.data.success) {
        navigate("/login");
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
      console.log(error);
    } finally {
      setIsLoading(false);
    }

    setUser({
      fullName: "",
      username: "",
      password: "",
      confirmPassword: "",
      gender: "",
    });
  };

  return (
    <div className="min-h-screen flex font-[Inter,system-ui,sans-serif] bg-stone-50 dark:bg-[#0a0a0a] transition-colors duration-300">

      {/* ── Top Navigation (Back to Home & Theme Toggle) ── */}
      <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-50">
        <Link 
          to="/" 
          className="flex items-center gap-2 text-sm font-semibold text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-white transition-colors bg-white/50 dark:bg-[#1a1a1a]/50 backdrop-blur-md px-4 py-2.5 rounded-xl border border-stone-200/50 dark:border-stone-800"
        >
          <BsArrowLeft className="text-lg" />
          Back to home
        </Link>
        <ThemeToggle />
      </div>

      {/* ── Right: Register Form ── */}
      <div className="flex-1 flex items-center justify-center relative overflow-hidden pt-20 sm:pt-0">
        {/* Subtle background blobs */}
        <div className="absolute top-0 left-0 w-[400px] h-[400px] rounded-full bg-violet-100/50 dark:bg-violet-900/20 blur-[100px] -z-0" />
        <div className="absolute bottom-0 right-0 w-[300px] h-[300px] rounded-full bg-indigo-100/40 dark:bg-indigo-900/20 blur-[80px] -z-0" />

        <div className="w-full max-w-md relative z-10 px-6 sm:px-0">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center gap-2.5 mb-6">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-md">
                <BsChatDotsFill className="text-white text-base" />
              </div>
              <span className="text-xl font-bold text-stone-900 dark:text-white tracking-tight transition-colors">
                Ping<span className="text-indigo-600">.</span>
              </span>
            </Link>
          </div>

          {/* Header */}
          <div className="mb-6 mt-10 sm:mt-0">
            <h1 className="text-3xl font-extrabold text-stone-900 dark:text-white tracking-tight mb-2 transition-colors">
              Create your account
            </h1>
            <p className="text-stone-500 dark:text-stone-400 text-sm transition-colors">
              Fill in the details below to get started in seconds.
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white dark:bg-[#111111] rounded-2xl shadow-xl shadow-stone-200/50 dark:shadow-black/50 border border-stone-200/80 dark:border-stone-800 p-7 transition-colors">
            <form onSubmit={onSubmithHandler} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-1.5 transition-colors">
                  Full Name
                </label>
                <div className={`relative flex items-center rounded-xl border-2 transition-all duration-200 ${
                  focused === 'fullName' 
                    ? 'border-indigo-500 dark:border-indigo-500 shadow-sm shadow-indigo-100 dark:shadow-indigo-900/20' 
                    : 'border-stone-200 dark:border-stone-700 hover:border-stone-300 dark:hover:border-stone-600'
                }`}>
                  <div className="pl-3.5 pr-1.5">
                    <HiOutlineUser className={`text-lg transition-colors duration-200 ${
                      focused === 'fullName' ? 'text-indigo-500' : 'text-stone-400 dark:text-stone-500'
                    }`} />
                  </div>
                  <input
                    value={user.fullName}
                    onChange={(e) => setUser({ ...user, fullName: e.target.value })}
                    onFocus={() => setFocused('fullName')}
                    onBlur={() => setFocused('')}
                    className="flex-1 px-2 py-2.5 bg-transparent outline-none text-stone-900 dark:text-white text-sm placeholder:text-stone-400 dark:placeholder:text-stone-500"
                    type="text"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              </div>

              {/* Username */}
              <div>
                <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-1.5 transition-colors">
                  Username
                </label>
                <div className={`relative flex items-center rounded-xl border-2 transition-all duration-200 ${
                  focused === 'username' 
                    ? 'border-indigo-500 dark:border-indigo-500 shadow-sm shadow-indigo-100 dark:shadow-indigo-900/20' 
                    : 'border-stone-200 dark:border-stone-700 hover:border-stone-300 dark:hover:border-stone-600'
                }`}>
                  <div className="pl-3.5 pr-1.5">
                    <BsPerson className={`text-lg transition-colors duration-200 ${
                      focused === 'username' ? 'text-indigo-500' : 'text-stone-400 dark:text-stone-500'
                    }`} />
                  </div>
                  <input
                    value={user.username}
                    onChange={(e) => setUser({ ...user, username: e.target.value })}
                    onFocus={() => setFocused('username')}
                    onBlur={() => setFocused('')}
                    className="flex-1 px-2 py-2.5 bg-transparent outline-none text-stone-900 dark:text-white text-sm placeholder:text-stone-400 dark:placeholder:text-stone-500"
                    type="text"
                    placeholder="Choose a username"
                    required
                  />
                </div>
              </div>

              {/* Two-column: Password + Confirm */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Password */}
                <div>
                  <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-1.5 transition-colors">
                    Password
                  </label>
                  <div className={`relative flex items-center rounded-xl border-2 transition-all duration-200 ${
                    focused === 'password' 
                      ? 'border-indigo-500 dark:border-indigo-500 shadow-sm shadow-indigo-100 dark:shadow-indigo-900/20' 
                      : 'border-stone-200 dark:border-stone-700 hover:border-stone-300 dark:hover:border-stone-600'
                  }`}>
                    <div className="pl-3.5 pr-1.5">
                      <BsLock className={`text-base transition-colors duration-200 ${
                        focused === 'password' ? 'text-indigo-500' : 'text-stone-400 dark:text-stone-500'
                      }`} />
                    </div>
                    <input
                      value={user.password}
                      onChange={(e) => setUser({ ...user, password: e.target.value })}
                      onFocus={() => setFocused('password')}
                      onBlur={() => setFocused('')}
                      className="flex-1 px-2 py-2.5 bg-transparent outline-none text-stone-900 dark:text-white text-sm placeholder:text-stone-400 dark:placeholder:text-stone-500 min-w-0"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="pr-3 pl-1 text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 transition-colors"
                    >
                      {showPassword ? <IoEyeOff size={16} /> : <IoEye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-1.5 transition-colors">
                    Confirm
                  </label>
                  <div className={`relative flex items-center rounded-xl border-2 transition-all duration-200 ${
                    focused === 'confirmPassword' 
                      ? 'border-indigo-500 dark:border-indigo-500 shadow-sm shadow-indigo-100 dark:shadow-indigo-900/20' 
                      : 'border-stone-200 dark:border-stone-700 hover:border-stone-300 dark:hover:border-stone-600'
                  }`}>
                    <div className="pl-3.5 pr-1.5">
                      <BsLock className={`text-base transition-colors duration-200 ${
                        focused === 'confirmPassword' ? 'text-indigo-500' : 'text-stone-400 dark:text-stone-500'
                      }`} />
                    </div>
                    <input
                      value={user.confirmPassword}
                      onChange={(e) => setUser({ ...user, confirmPassword: e.target.value })}
                      onFocus={() => setFocused('confirmPassword')}
                      onBlur={() => setFocused('')}
                      className="flex-1 px-2 py-2.5 bg-transparent outline-none text-stone-900 dark:text-white text-sm placeholder:text-stone-400 dark:placeholder:text-stone-500 min-w-0"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Repeat password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="pr-3 pl-1 text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 transition-colors"
                    >
                      {showConfirmPassword ? <IoEyeOff size={16} /> : <IoEye size={16} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Gender Selection — pill style */}
              <div>
                <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-2.5 transition-colors">
                  Gender
                </label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => handleCheckbox("male")}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all duration-200 ${
                      user.gender === "male"
                        ? "border-indigo-500 dark:border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 shadow-sm shadow-indigo-100 dark:shadow-indigo-900/20"
                        : "border-stone-200 dark:border-stone-700 text-stone-500 dark:text-stone-400 hover:border-stone-300 dark:hover:border-stone-600 hover:bg-stone-50 dark:hover:bg-stone-800/50"
                    }`}
                  >
                    Male
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCheckbox("female")}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all duration-200 ${
                      user.gender === "female"
                        ? "border-indigo-500 dark:border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 shadow-sm shadow-indigo-100 dark:shadow-indigo-900/20"
                        : "border-stone-200 dark:border-stone-700 text-stone-500 dark:text-stone-400 hover:border-stone-300 dark:hover:border-stone-600 hover:bg-stone-50 dark:hover:bg-stone-800/50"
                    }`}
                  >
                    Female
                  </button>
                </div>
              </div>

              {/* Sign Up Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="group w-full flex items-center justify-center gap-2 bg-stone-900 dark:bg-white text-white dark:text-stone-900 py-3.5 rounded-xl font-semibold text-sm hover:bg-stone-800 dark:hover:bg-stone-200 transition-all duration-200 shadow-lg shadow-stone-300/40 dark:shadow-white/10 hover:shadow-stone-400/50 dark:hover:shadow-white/20 mt-1 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Create Account
                    <BsArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              {/* Divider */}
              <div className="flex items-center gap-4">
                <div className="flex-1 h-px bg-stone-200 dark:bg-stone-800 transition-colors" />
                <span className="text-xs text-stone-400 font-medium">or</span>
                <div className="flex-1 h-px bg-stone-200 dark:bg-stone-800 transition-colors" />
              </div>

              {/* Login Link */}
              <p className="text-center text-sm text-stone-500 dark:text-stone-400 transition-colors">
                Already have an account?{' '}
                <Link 
                  to="/login" 
                  className="text-indigo-600 dark:text-indigo-400 font-semibold hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Register;
