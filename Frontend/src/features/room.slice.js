import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  data: "hii",
  isError: false,
};

export const roomSlice = createSlice({
  name: "room",
  initialState,
  // extraReducers: ()=>{}
  reducers: {
    fn: async (state, action) => {},
  },
});

export const { fn } = roomSlice.actions;
export default roomSlice.reducer;
