import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    authUser: localStorage.getItem("authUser") ? JSON.parse(localStorage.getItem("authUser")) : null,
    otherUsers: [],
    selectedUser: null,
    onlineUsers: [],
  },
  reducers: {
    setAuthUser: (state, action) => {
      state.authUser = action.payload;
    },
    setOtherUsers: (state, action) => {
      state.otherUsers = action.payload;
    },
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
    updateUserList: (state, action) => {
      const { userId, isUnread, lastMessage, lastMessageTime } = action.payload;
      const userIndex = state.otherUsers.findIndex((u) => u._id === userId);
      if (userIndex !== -1) {
        const [user] = state.otherUsers.splice(userIndex, 1);
        if (isUnread) {
          user.unreadCount = (user.unreadCount || 0) + 1;
          user.hasUnread = true;
        }
        if (lastMessage !== undefined) {
          user.lastMessage = lastMessage;
          user.lastMessageTime = lastMessageTime || new Date().toISOString();
        }
        state.otherUsers.unshift(user);
      }
    },
    clearUnread: (state, action) => {
      const user = state.otherUsers.find((u) => u._id === action.payload);
      if (user) {
        user.hasUnread = false;
        user.unreadCount = 0;
      }
    },
  },
});

export const { setAuthUser, setOtherUsers, setSelectedUser, setOnlineUsers, updateUserList, clearUnread } = userSlice.actions;

export default userSlice.reducer;