import { configureStore } from "@reduxjs/toolkit";
import roomReducer from "../features/room.slice.js";

export const store = configureStore({
  reducer: {
    room: roomReducer,
  },
});
