import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { 
  BsChatDotsFill, 
  BsArrowRight, 
  BsLock, 
  BsArrowLeft, 
  BsEnvelope, 
  BsTelephone, 
  BsShieldCheck,
  BsShieldLock,
  BsArrowCounterclockwise 
} from "react-icons/bs";
import { HiOutlineUser } from "react-icons/hi2";
import { API_ENDPOINTS } from "../config/api";
import ThemeToggle from "./ThemeToggle";

const Register = () => {
  const [user, setUser] = React.useState({
    fullName: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
    gender: "",
  });
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [focused, setFocused] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  // OTP Verification states
  const [isOtpScreen, setIsOtpScreen] = React.useState(false);
  const [registeredEmail, setRegisteredEmail] = React.useState("");
  const [otpInput, setOtpInput] = React.useState("");
  const [devOtp, setDevOtp] = React.useState("");
  const [isResending, setIsResending] = React.useState(false);
  const [resendCooldown, setResendCooldown] = React.useState(0);

  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    if (location.state?.email && location.state?.isVerifyOnly) {
      setRegisteredEmail(location.state.email);
      setIsOtpScreen(true);
    }
  }, [location]);

  React.useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

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
        setRegisteredEmail(user.email);
        if (res.data.otp) {
          setDevOtp(res.data.otp);
          toast.success(`Verification code sent! (Dev OTP: ${res.data.otp})`, { duration: 6000 });
        } else {
          toast.success(res.data.message || "OTP sent to your email!");
        }
        setIsOtpScreen(true);
        setResendCooldown(30);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otpInput || otpInput.trim().length === 0) {
      toast.error("Please enter the 6-digit OTP code");
      return;
    }

    setIsLoading(true);
    try {
      const res = await axios.post(
        API_ENDPOINTS.USER.VERIFY_OTP,
        {
          email: registeredEmail,
          otp: otpInput.trim(),
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        },
      );
      if (res.data.success) {
        toast.success(res.data.message || "Email verified! Redirecting to login...");
        setTimeout(() => {
          navigate("/login");
        }, 1200);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "OTP verification failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0 || isResending) return;
    setIsResending(true);
    try {
      const res = await axios.post(
        API_ENDPOINTS.USER.RESEND_OTP,
        { email: registeredEmail },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        },
      );
      if (res.data.success) {
        if (res.data.otp) {
          setDevOtp(res.data.otp);
          toast.success(`New code sent! (Dev OTP: ${res.data.otp})`, { duration: 6000 });
        } else {
          toast.success(res.data.message || "New OTP sent to email!");
        }
        setResendCooldown(30);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to resend OTP");
    } finally {
      setIsResending(false);
    }
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

      {/* ── Center Content ── */}
      <div className="flex-1 flex items-center justify-center relative overflow-hidden pt-20 sm:pt-0">
        {/* Subtle background blobs */}
        <div className="absolute top-0 left-0 w-[400px] h-[400px] rounded-full bg-violet-100/50 dark:bg-violet-900/20 blur-[100px] -z-0" />
        <div className="absolute bottom-0 right-0 w-[300px] h-[300px] rounded-full bg-violet-100/40 dark:bg-violet-900/20 blur-[80px] -z-0" />

        <div className="w-full max-w-md relative z-10 px-6 sm:px-0">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center gap-2.5 mb-6">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-violet-600 flex items-center justify-center shadow-md">
                <BsChatDotsFill className="text-white text-base" />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white tracking-tight transition-colors">
                Ping<span className="text-violet-600">.</span>
              </span>
            </Link>
          </div>

          {/* ══════════════════════════════════════════════════════════ */}
          {/* VIEW 1: OTP VERIFICATION VIEW                             */}
          {/* ══════════════════════════════════════════════════════════ */}
          {isOtpScreen ? (
            <div>
              {/* Header */}
              <div className="mb-6 mt-10 sm:mt-0 text-center">
                <div className="w-14 h-14 rounded-2xl bg-violet-50 dark:bg-violet-950/60 border border-violet-100 dark:border-violet-900/60 text-violet-600 dark:text-violet-400 flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <BsShieldCheck className="text-2xl" />
                </div>
                <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2 transition-colors">
                  Verify your email
                </h1>
                <p className="text-gray-500 dark:text-stone-400 text-sm max-w-sm mx-auto transition-colors">
                  We've sent a 6-digit verification code to
                </p>
                <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 dark:bg-stone-800 text-gray-800 dark:text-stone-200 text-xs font-medium rounded-full">
                  <BsEnvelope className="text-xs" />
                  <span>{registeredEmail}</span>
                </div>
              </div>

              {/* Form Card */}
              <div className="bg-white dark:bg-[#111] rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-gray-100 dark:border-stone-800 p-7 transition-colors">
                {/* Dev Mode Banner (helps local testing without configured SMTP) */}
                {devOtp && (
                  <div className="mb-5 p-3.5 bg-amber-50 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/50 rounded-xl text-xs flex items-center justify-between text-amber-800 dark:text-amber-300">
                    <div className="flex items-center gap-2">
                      <span className="font-bold">Dev OTP:</span>
                      <span className="font-mono text-sm tracking-widest font-semibold px-2 py-0.5 bg-amber-100/70 dark:bg-amber-900/50 rounded">
                        {devOtp}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setOtpInput(devOtp)}
                      className="text-xs bg-amber-200/60 dark:bg-amber-800/50 hover:bg-amber-300/80 text-amber-900 dark:text-amber-200 px-2.5 py-1 rounded-lg font-semibold transition-colors"
                    >
                      Auto-fill
                    </button>
                  </div>
                )}

                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-stone-300 mb-2 text-center transition-colors">
                      Enter 6-Digit Code
                    </label>
                    <div className={`relative flex items-center justify-center rounded-xl border-2 transition-all duration-200 ${
                      focused === 'otp' 
                        ? 'border-violet-500 dark:border-violet-500 shadow-sm shadow-violet-100 dark:shadow-violet-900/20 bg-white dark:bg-stone-900' 
                        : 'border-gray-200 dark:border-stone-700 hover:border-gray-300 dark:hover:border-stone-600 bg-gray-50 dark:bg-stone-900/50'
                    }`}>
                      <input
                        value={otpInput}
                        onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        onFocus={() => setFocused('otp')}
                        onBlur={() => setFocused('')}
                        className="w-full text-center tracking-[0.4em] font-mono font-bold text-2xl py-3 px-4 bg-transparent outline-none text-gray-900 dark:text-white placeholder:text-gray-300 dark:placeholder:text-stone-600"
                        type="text"
                        placeholder="••••••"
                        maxLength={6}
                        autoFocus
                        required
                      />
                    </div>
                  </div>

                  {/* Verify Button */}
                  <button
                    type="submit"
                    disabled={isLoading || otpInput.length < 6}
                    className="group w-full flex items-center justify-center gap-2 bg-violet-600 text-white py-3.5 rounded-xl font-semibold text-sm hover:bg-violet-700 transition-all duration-200 shadow-md shadow-violet-600/20 mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        Verify & Complete
                        <BsArrowRight className="group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>

                  {/* Resend & Actions */}
                  <div className="pt-2 flex items-center justify-between text-xs text-gray-500 dark:text-stone-400">
                    <button
                      type="button"
                      onClick={() => setIsOtpScreen(false)}
                      className="hover:text-gray-900 dark:hover:text-stone-200 transition-colors"
                    >
                      ← Back / Edit info
                    </button>
                    <button
                      type="button"
                      disabled={resendCooldown > 0 || isResending}
                      onClick={handleResendOtp}
                      className="font-medium text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 transition-colors"
                    >
                      <BsArrowCounterclockwise className={isResending ? "animate-spin" : ""} />
                      {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend OTP"}
                    </button>
                  </div>

                  {/* Divider */}
                  <div className="flex items-center gap-4 pt-2">
                    <div className="flex-1 h-px bg-gray-200 dark:bg-stone-800 transition-colors" />
                    <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">or</span>
                    <div className="flex-1 h-px bg-gray-200 dark:bg-stone-800 transition-colors" />
                  </div>

                  {/* Sign In Link */}
                  <p className="text-center text-sm text-gray-500 dark:text-stone-400 transition-colors">
                    Already verified?{' '}
                    <Link 
                      to="/login" 
                      className="text-violet-600 dark:text-violet-400 font-semibold hover:text-violet-700 dark:hover:text-violet-300 transition-colors"
                    >
                      Sign in
                    </Link>
                  </p>
                </form>
              </div>
            </div>
          ) : (
            /* ══════════════════════════════════════════════════════════ */
            /* VIEW 2: REGISTRATION FORM                                  */
            /* ══════════════════════════════════════════════════════════ */
            <div>
              {/* Header */}
              <div className="mb-6 mt-10 sm:mt-0 text-center sm:text-left">
                <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2 transition-colors">
                  Create your account
                </h1>
                <p className="text-gray-500 dark:text-stone-400 text-sm transition-colors">
                  Fill in the details below to get started in seconds.
                </p>
              </div>

              {/* Form Card */}
              <div className="bg-white dark:bg-[#111] rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-gray-100 dark:border-stone-800 p-7 transition-colors">
                <form onSubmit={onSubmithHandler} className="space-y-4">
                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-stone-300 mb-1.5 transition-colors">
                      Full Name
                    </label>
                    <div className={`relative flex items-center rounded-xl border-2 transition-all duration-200 ${
                      focused === 'fullName' 
                        ? 'border-violet-500 dark:border-violet-500 shadow-sm shadow-violet-100 dark:shadow-violet-900/20 bg-white dark:bg-stone-900' 
                        : 'border-gray-200 dark:border-stone-700 hover:border-gray-300 dark:hover:border-stone-600 bg-gray-50 dark:bg-stone-900/50'
                    }`}>
                      <div className="pl-3.5 pr-1.5">
                        <HiOutlineUser className={`text-lg transition-colors duration-200 ${
                          focused === 'fullName' ? 'text-violet-500' : 'text-gray-400 dark:text-stone-500'
                        }`} />
                      </div>
                      <input
                        value={user.fullName}
                        onChange={(e) => setUser({ ...user, fullName: e.target.value })}
                        onFocus={() => setFocused('fullName')}
                        onBlur={() => setFocused('')}
                        className="flex-1 px-2 py-2.5 bg-transparent outline-none text-gray-900 dark:text-white text-sm placeholder:text-gray-400 dark:placeholder:text-stone-500"
                        type="text"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                  </div>

                  {/* Two-column: Email + Mobile */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Email */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-stone-300 mb-1.5 transition-colors">
                        Email Address
                      </label>
                      <div className={`relative flex items-center rounded-xl border-2 transition-all duration-200 ${
                        focused === 'email' 
                          ? 'border-violet-500 dark:border-violet-500 shadow-sm shadow-violet-100 dark:shadow-violet-900/20 bg-white dark:bg-stone-900' 
                          : 'border-gray-200 dark:border-stone-700 hover:border-gray-300 dark:hover:border-stone-600 bg-gray-50 dark:bg-stone-900/50'
                      }`}>
                        <div className="pl-3.5 pr-1.5">
                          <BsEnvelope className={`text-lg transition-colors duration-200 ${
                            focused === 'email' ? 'text-violet-500' : 'text-gray-400 dark:text-stone-500'
                          }`} />
                        </div>
                        <input
                          value={user.email}
                          onChange={(e) => setUser({ ...user, email: e.target.value })}
                          onFocus={() => setFocused('email')}
                          onBlur={() => setFocused('')}
                          className="flex-1 px-2 py-2.5 bg-transparent outline-none text-gray-900 dark:text-white text-sm placeholder:text-gray-400 dark:placeholder:text-stone-500 min-w-0"
                          type="email"
                          placeholder="Enter your email"
                          required
                        />
                      </div>
                    </div>

                    {/* Mobile */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-stone-300 mb-1.5 transition-colors">
                        Mobile Number
                      </label>
                      <div className={`relative flex items-center rounded-xl border-2 transition-all duration-200 ${
                        focused === 'mobile' 
                          ? 'border-violet-500 dark:border-violet-500 shadow-sm shadow-violet-100 dark:shadow-violet-900/20 bg-white dark:bg-stone-900' 
                          : 'border-gray-200 dark:border-stone-700 hover:border-gray-300 dark:hover:border-stone-600 bg-gray-50 dark:bg-stone-900/50'
                      }`}>
                        <div className="pl-3.5 pr-1.5">
                          <BsTelephone className={`text-lg transition-colors duration-200 ${
                            focused === 'mobile' ? 'text-violet-500' : 'text-gray-400 dark:text-stone-500'
                          }`} />
                        </div>
                        <input
                          value={user.mobile}
                          onChange={(e) => setUser({ ...user, mobile: e.target.value })}
                          onFocus={() => setFocused('mobile')}
                          onBlur={() => setFocused('')}
                          className="flex-1 px-2 py-2.5 bg-transparent outline-none text-gray-900 dark:text-white text-sm placeholder:text-gray-400 dark:placeholder:text-stone-500 min-w-0"
                          type="tel"
                          placeholder="Enter mobile number"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Two-column: Password + Confirm */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Password */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-stone-300 mb-1.5 transition-colors">
                        Password
                      </label>
                      <div className={`relative flex items-center rounded-xl border-2 transition-all duration-200 ${
                        focused === 'password' 
                          ? 'border-violet-500 dark:border-violet-500 shadow-sm shadow-violet-100 dark:shadow-violet-900/20 bg-white dark:bg-stone-900' 
                          : 'border-gray-200 dark:border-stone-700 hover:border-gray-300 dark:hover:border-stone-600 bg-gray-50 dark:bg-stone-900/50'
                      }`}>
                        <div className="pl-3.5 pr-1.5">
                          <BsLock className={`text-base transition-colors duration-200 ${
                            focused === 'password' ? 'text-violet-500' : 'text-gray-400 dark:text-stone-500'
                          }`} />
                        </div>
                        <input
                          value={user.password}
                          onChange={(e) => setUser({ ...user, password: e.target.value })}
                          onFocus={() => setFocused('password')}
                          onBlur={() => setFocused('')}
                          className="flex-1 px-2 py-2.5 bg-transparent outline-none text-gray-900 dark:text-white text-sm placeholder:text-gray-400 dark:placeholder:text-stone-500 min-w-0"
                          type={showPassword ? "text" : "password"}
                          placeholder="Create password"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="pr-3 pl-1 text-gray-400 hover:text-gray-600 dark:hover:text-stone-300 transition-colors"
                        >
                          {showPassword ? <IoEyeOff size={16} /> : <IoEye size={16} />}
                        </button>
                      </div>
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-stone-300 mb-1.5 transition-colors">
                        Confirm
                      </label>
                      <div className={`relative flex items-center rounded-xl border-2 transition-all duration-200 ${
                        focused === 'confirmPassword' 
                          ? 'border-violet-500 dark:border-violet-500 shadow-sm shadow-violet-100 dark:shadow-violet-900/20 bg-white dark:bg-stone-900' 
                          : 'border-gray-200 dark:border-stone-700 hover:border-gray-300 dark:hover:border-stone-600 bg-gray-50 dark:bg-stone-900/50'
                      }`}>
                        <div className="pl-3.5 pr-1.5">
                          <BsLock className={`text-base transition-colors duration-200 ${
                            focused === 'confirmPassword' ? 'text-violet-500' : 'text-gray-400 dark:text-stone-500'
                          }`} />
                        </div>
                        <input
                          value={user.confirmPassword}
                          onChange={(e) => setUser({ ...user, confirmPassword: e.target.value })}
                          onFocus={() => setFocused('confirmPassword')}
                          onBlur={() => setFocused('')}
                          className="flex-1 px-2 py-2.5 bg-transparent outline-none text-gray-900 dark:text-white text-sm placeholder:text-gray-400 dark:placeholder:text-stone-500 min-w-0"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Repeat password"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="pr-3 pl-1 text-gray-400 hover:text-gray-600 dark:hover:text-stone-300 transition-colors"
                        >
                          {showConfirmPassword ? <IoEyeOff size={16} /> : <IoEye size={16} />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Gender Selection — pill style */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-stone-300 mb-2.5 transition-colors">
                      Gender
                    </label>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => handleCheckbox("male")}
                        className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all duration-200 ${
                          user.gender === "male"
                            ? "border-violet-500 dark:border-violet-500 bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400 shadow-sm shadow-violet-100 dark:shadow-violet-900/20"
                            : "border-gray-200 dark:border-stone-700 text-gray-500 dark:text-stone-400 hover:border-gray-300 dark:hover:border-stone-600 hover:bg-gray-50 dark:hover:bg-stone-800/50 bg-white dark:bg-stone-900/50"
                        }`}
                      >
                        Male
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCheckbox("female")}
                        className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all duration-200 ${
                          user.gender === "female"
                            ? "border-violet-500 dark:border-violet-500 bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400 shadow-sm shadow-violet-100 dark:shadow-violet-900/20"
                            : "border-gray-200 dark:border-stone-700 text-gray-500 dark:text-stone-400 hover:border-gray-300 dark:hover:border-stone-600 hover:bg-gray-50 dark:hover:bg-stone-800/50 bg-white dark:bg-stone-900/50"
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
                    className="group w-full flex items-center justify-center gap-2 bg-violet-600 text-white py-3.5 rounded-xl font-semibold text-sm hover:bg-violet-700 transition-all duration-200 shadow-md shadow-violet-600/20 mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
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
                  <div className="flex items-center gap-4 py-1">
                    <div className="flex-1 h-px bg-gray-200 dark:bg-stone-800 transition-colors" />
                    <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">or</span>
                    <div className="flex-1 h-px bg-gray-200 dark:bg-stone-800 transition-colors" />
                  </div>

                  {/* Login Link */}
                  <p className="text-center text-sm text-gray-500 dark:text-stone-400 transition-colors">
                    Already have an account?{' '}
                    <Link 
                      to="/login" 
                      className="text-violet-600 dark:text-violet-400 font-semibold hover:text-violet-700 dark:hover:text-violet-300 transition-colors"
                    >
                      Sign in
                    </Link>
                  </p>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Register;
