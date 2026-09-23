import React, { useState } from 'react';
import OtherUsers from './OtherUsers';
import axios from 'axios';
import { toast } from "react-hot-toast";
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setAuthUser } from '../redux/userSlice';
import { API_ENDPOINTS } from '../config/api';
import ThemeToggle from './ThemeToggle';

const Sidebar = () => {
  const [search, setSearch] = useState("");
  const { otherUsers, authUser, selectedUser } = useSelector(store => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = async () => {
    try {
      const res = await axios.get(API_ENDPOINTS.USER.LOGOUT);
      localStorage.removeItem("authUser");
      navigate("/login");
      toast.success(res.data.message);
      dispatch(setAuthUser(null));
    } catch (error) {
      console.log(error);
    }
  };

  const totalUsers = otherUsers?.length || 0;

  return (
    <div
      className={`flex-col h-full bg-white dark:bg-[#111] border-r border-gray-100 dark:border-stone-800 transition-colors duration-300 w-full sm:w-[320px] sm:min-w-[320px] shrink-0
        ${selectedUser ? 'hidden sm:flex' : 'flex'}
      `}
    >
      {/* ── Top bar ── */}
      <div className="px-5 pt-6 pb-3 flex items-center justify-between">
        <div>
          <p className="text-[11px] font-semibold text-gray-400 dark:text-stone-500 uppercase tracking-widest mb-0.5">
            All Chats ▾
          </p>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-none"
            style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
            Messages{' '}
            <span className="text-violet-500">({totalUsers})</span>
          </h1>
        </div>

        <div className="flex items-center gap-1">
          <ThemeToggle className="!p-2 border-none !bg-transparent hover:!bg-gray-100 dark:hover:!bg-stone-800 shadow-none" />
          <button
            onClick={logoutHandler}
            title="Logout"
            className="p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </button>
        </div>
      </div>

      {/* ── Search ── */}
      <div className="px-5 pb-4">
        <div className="relative">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            type="text"
            placeholder="Search"
            className="w-full pl-4 pr-10 py-2.5 text-sm rounded-xl bg-gray-50 dark:bg-stone-900 border border-gray-200 dark:border-stone-700 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-stone-500 outline-none focus:border-violet-400 dark:focus:border-violet-500 focus:ring-2 focus:ring-violet-100 dark:focus:ring-violet-900/30 transition-all"
            style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </div>
        </div>
      </div>

      {/* ── User List ── */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <OtherUsers search={search} />
      </div>

      {/* ── Bottom profile strip ── */}
      <div className="px-4 py-3 border-t border-gray-100 dark:border-stone-800 flex items-center gap-3 bg-white dark:bg-[#111]">
        <img
          src={authUser?.profilePhoto}
          alt="me"
          className="w-9 h-9 rounded-full object-cover ring-2 ring-violet-200 dark:ring-violet-800"
        />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 dark:text-white truncate" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
            {authUser?.fullName}
          </p>
          <p className="text-xs text-gray-400 dark:text-stone-500 truncate">{authUser?.email}</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;