import { createSlice } from "@reduxjs/toolkit";

const messageSlice = createSlice({
    name: "message",
    initialState: {
        messages: null,
    },
    reducers: {
        setMessages: (state, action) => {
            state.messages = action.payload;
        },
        addMessage: (state, action) => {
            if (state.messages) {
                state.messages.push(action.payload);
            } else {
                state.messages = [action.payload];
            }
        },
        // Update a single message's status (e.g., sent -> delivered -> read)
        updateMessageStatus: (state, action) => {
            const { messageId, status } = action.payload;
            if (state.messages) {
                const msg = state.messages.find(m => m._id === messageId);
                if (msg) msg.status = status;
            }
        },
        // Mark ALL messages in current conversation as read
        markAllMessagesRead: (state, action) => {
            const { fromUserId } = action.payload;
            if (state.messages) {
                state.messages.forEach(msg => {
                    if (msg.senderId === fromUserId && msg.status !== "read") {
                        msg.status = "read";
                    }
                });
            }
        }
    }
});

export const { setMessages, addMessage, updateMessageStatus, markAllMessagesRead } = messageSlice.actions;
export default messageSlice.reducer;
