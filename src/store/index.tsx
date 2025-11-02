"use client";

import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { Provider, useSelector, useDispatch } from "react-redux";
import likedPosts, { addProduct } from "./slices/likedPosts";
import { useEffect } from "react";

const reducer = combineReducers({ likedPosts });
const store = configureStore({ reducer });

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// کپشر state از درون استور بعد از Mount
function InnerProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch<AppDispatch>();
  const likedPosts = useSelector((state: RootState) => state.likedPosts);

  // لود اولیه
  useEffect(() => {
    const storedLiked = JSON.parse(
      localStorage.getItem("likedPosts") || "[]"
    ) as string[];

    if (storedLiked?.length) {
      storedLiked.forEach((p) => dispatch(addProduct(p)));
    }
  }, [dispatch]);

  // ذخیره هر تغییری در likedPosts
  useEffect(() => {
    localStorage.setItem("likedPosts", JSON.stringify(likedPosts));
  }, [likedPosts]);

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
