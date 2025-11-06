import { createSlice } from "@reduxjs/toolkit";

const initialState: string[] = [];

const searchHistorySlice = createSlice({
  name: "searchHistory",
  initialState,
  reducers: {
    addSearch: (state, action) => {
      state.push(action.payload);
    },

    deleteSearch: (state, action) => {
      return state.filter((s) => s !== action.payload);
    },

    clearSearch: () => {
      return [];
    },
  },
});

export default searchHistorySlice.reducer;

export const { addSearch, clearSearch, deleteSearch } =
  searchHistorySlice.actions;
