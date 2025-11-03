import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "..";

const initialState: string[] = [];

const likedPostSlice = createSlice({
  name: "likedPosts",
  initialState,
  reducers: {
    addProduct: (state, action: PayloadAction<string>) => {
      const exists = state.some((p) => p === action.payload);
      if (!exists) {
        state.push(action.payload);
      }
    },

    removeProduct: (state, action: PayloadAction<string | number>) => {
      return state.filter((p) => p !== action.payload);
    },

    toggleLike: (state, action: PayloadAction<string>) => {
      const exists = state.find((p) => p === action.payload);
      if (exists) {
        return state.filter((p) => p !== action.payload);
      } else {
        state.push(action.payload);
      }
    },

    clearAll: () => {
      return [];
    },
  },
});

export default likedPostSlice.reducer;

export const { addProduct, removeProduct, toggleLike, clearAll } =
  likedPostSlice.actions;

export function productIsLiked(state: string[], id: string | number) {
  return state.some((p) => p === id);
}
