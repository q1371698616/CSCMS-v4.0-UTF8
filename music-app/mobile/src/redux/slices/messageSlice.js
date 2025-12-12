import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as MessageAPI from '../../api/message';

// 异步操作
export const fetchUnreadCount = createAsyncThunk(
  'message/fetchUnreadCount',
  async (_, { rejectWithValue }) => {
    try {
      const response = await MessageAPI.getUnreadCount();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchMessageList = createAsyncThunk(
  'message/fetchMessageList',
  async ({ type, page }, { rejectWithValue }) => {
    try {
      const response = await MessageAPI.getMessageList(type, page);
      return { type, ...response.data };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const markAsRead = createAsyncThunk(
  'message/markAsRead',
  async ({ messageId, type }, { rejectWithValue }) => {
    try {
      await MessageAPI.markMessageAsRead(messageId, type);
      return { messageId, type };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const sendPrivateMessage = createAsyncThunk(
  'message/sendPrivateMessage',
  async ({ toUserId, content }, { rejectWithValue }) => {
    try {
      const response = await MessageAPI.sendMessage(toUserId, content);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const messageSlice = createSlice({
  name: 'message',
  initialState: {
    unreadCount: {
      total: 0,
      system: 0,
      official: 0,
      user: 0,
      comment: 0,
      like: 0,
      follow: 0,
    },
    messages: {
      system: [],
      official: [],
      user: [],
      comment: [],
      like: [],
      follow: [],
    },
    loading: false,
    error: null,
  },
  reducers: {
    clearMessages: (state, action) => {
      const type = action.payload;
      if (type) {
        state.messages[type] = [];
      } else {
        state.messages = {
          system: [],
          official: [],
          user: [],
          comment: [],
          like: [],
          follow: [],
        };
      }
    },
    updateUnreadCount: (state, action) => {
      state.unreadCount = { ...state.unreadCount, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Unread Count
      .addCase(fetchUnreadCount.fulfilled, (state, action) => {
        state.unreadCount = action.payload;
      })
      // Fetch Message List
      .addCase(fetchMessageList.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMessageList.fulfilled, (state, action) => {
        state.loading = false;
        const { type, list } = action.payload;
        state.messages[type] = list;
      })
      .addCase(fetchMessageList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Mark As Read
      .addCase(markAsRead.fulfilled, (state, action) => {
        const { type } = action.payload;
        if (type) {
          state.unreadCount[type] = 0;
          state.unreadCount.total -= state.unreadCount[type];
        } else {
          state.unreadCount = {
            total: 0,
            system: 0,
            official: 0,
            user: 0,
            comment: 0,
            like: 0,
            follow: 0,
          };
        }
      });
  },
});

export const { clearMessages, updateUnreadCount } = messageSlice.actions;
export default messageSlice.reducer;
