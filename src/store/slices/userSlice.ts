import { createSlice } from "@reduxjs/toolkit";

const initialState = {} as UserRedux;

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      return action.payload;
    },

    clearUser: () => {
      return {} as UserRedux;
    },

    updateUser: (state, action) => {
      return { ...action.payload, ...state };
    },
  },
});

export default userSlice.reducer;

export const { setUser, clearUser, updateUser } = userSlice.actions;
