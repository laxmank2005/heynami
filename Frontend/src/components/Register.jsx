import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { API_ENDPOINTS } from "../config/api";

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

  const navigate = useNavigate();

  const handleCheckbox = (gender) => {
    setUser({ ...user, gender });
  };

  const onSubmithHandler = async (e) => {
    e.preventDefault();
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500 rounded-full mb-4">
            <HiUserCircle className="text-white text-4xl" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
          <p className="text-gray-600">Join us today</p>
        </div>

        {/* Register Form Card */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8 max-h-[85vh] overflow-y-auto custom-scrollbar">
          <form onSubmit={onSubmithHandler} className="space-y-4">
            {/* Full Name Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                value={user.fullName}
                onChange={(e) => setUser({ ...user, fullName: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                type="text"
                placeholder="Enter your full name"
                required
              />
            </div>

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
                placeholder="Choose a username"
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
                  placeholder="Create a password"
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

            {/* Confirm Password Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  value={user.confirmPassword}
                  onChange={(e) =>
                    setUser({ ...user, confirmPassword: e.target.value })
                  }
                  className="w-full px-4 py-2.5 pr-11 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition"
                >
                  {showConfirmPassword ? <IoEyeOff size={20} /> : <IoEye size={20} />}
                </button>
              </div>
            </div>

            {/* Gender Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Gender
              </label>
              <div className="flex gap-6">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    checked={user.gender === "male"}
                    onChange={() => handleCheckbox("male")}
                    className="w-4 h-4 text-blue-500 focus:ring-blue-500 cursor-pointer"
                  />
                  <span className="ml-2 text-gray-700">Male</span>
                </label>

                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    checked={user.gender === "female"}
                    onChange={() => handleCheckbox("female")}
                    className="w-4 h-4 text-blue-500 focus:ring-blue-500 cursor-pointer"
                  />
                  <span className="ml-2 text-gray-700">Female</span>
                </label>
              </div>
            </div>

            {/* Sign Up Button */}
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 transition duration-200 mt-6"
            >
              Create Account
            </button>

            {/* Login Link */}
            <p className="text-center text-sm text-gray-600 mt-4">
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="text-blue-500 font-medium hover:text-blue-600 transition"
              >
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};
export default Register;
