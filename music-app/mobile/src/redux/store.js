import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import musicReducer from './slices/musicSlice';
import messageReducer from './slices/messageSlice';
import playerReducer from './slices/playerSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    music: musicReducer,
    message: messageReducer,
    player: playerReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
