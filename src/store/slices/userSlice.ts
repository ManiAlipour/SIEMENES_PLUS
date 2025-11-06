import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {},
  reducers: {
    addUser: (state, action) => {
      return action.payload;
    },

    clearUser: () => {
      return {};
    },

    updateUser: (state, action) => {
      return { ...action.payload, ...state };
    },
  },
});

export default userSlice.reducer;

export const { addUser, clearUser, updateUser } = userSlice.actions;
