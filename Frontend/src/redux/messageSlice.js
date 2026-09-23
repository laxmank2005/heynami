import { createSlice } from "@reduxjs/toolkit";

const messageSlice = createSlice({
    name: "message",
    initialState: {
        messages: null,
        replyingTo: null,
        editingMessage: null,
    },
    reducers: {
        setReplyingTo: (state, action) => {
            state.replyingTo = action.payload;
            state.editingMessage = null; // can't do both at once
        },
        setEditingMessage: (state, action) => {
            state.editingMessage = action.payload;
            state.replyingTo = null;
        },
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
        },
        // Update message content (for edit/delete)
        updateMessage: (state, action) => {
            const { messageId, message, isEdited, isDeleted } = action.payload;
            if (state.messages) {
                const msg = state.messages.find(m => m._id === messageId);
                if (msg) {
                    if (message !== undefined) msg.message = message;
                    if (isEdited !== undefined) msg.isEdited = isEdited;
                    if (isDeleted !== undefined) msg.isDeleted = isDeleted;
                }
            }
        },
        // Update message reactions
        updateMessageReactions: (state, action) => {
            const { messageId, reactions } = action.payload;
            if (state.messages) {
                const msg = state.messages.find(m => m._id === messageId);
                if (msg) msg.reactions = reactions;
            }
        }
    }
});

export const { setMessages, addMessage, updateMessageStatus, markAllMessagesRead, updateMessage, updateMessageReactions, setReplyingTo, setEditingMessage } = messageSlice.actions;
export default messageSlice.reducer;
