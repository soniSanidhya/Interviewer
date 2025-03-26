import { configureStore } from "@reduxjs/toolkit";
import roomReducer from "../features/room.slice.js";
import userReducer from "../features/userSlice.js"

export const store = configureStore({
  reducer: {
    room: roomReducer,
    user: userReducer
  },
});
