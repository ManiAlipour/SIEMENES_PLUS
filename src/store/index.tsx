"use client";

import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { Provider, useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import likedPosts, { addProduct } from "./slices/likedPosts";
import user from "./slices/userSlice";
import searchHistory, { addSearch } from "./slices/searchHistorySlice";

const reducer = combineReducers({ likedPosts, user, searchHistory });
const store = configureStore({ reducer });

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

function InnerProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch<AppDispatch>();
  const likedPosts = useSelector((state: RootState) => state.likedPosts);
  const searchHistory = useSelector((state: RootState) => state.searchHistory);

  useEffect(() => {
    const storedLiked = JSON.parse(
      localStorage.getItem("likedPosts") || "[]"
    ) as string[];

    const storedSearchs = JSON.parse(
      localStorage.getItem("searchHistory") || "[]"
    ) as string[];

    if (storedLiked?.length) {
      storedLiked.forEach((p) => dispatch(addProduct(p)));
    }

    if (storedSearchs?.length) {
      storedSearchs.forEach((s) => dispatch(addSearch(s)));
    }
  }, [dispatch]);

  useEffect(() => {
    localStorage.setItem("likedPosts", JSON.stringify(likedPosts));
  }, [likedPosts]);

  useEffect(() => {
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
  }, [searchHistory]);

  return <>{children}</>;
}

export default function ReduxProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider store={store}>
      <InnerProvider>{children}</InnerProvider>
    </Provider>
  );
}
