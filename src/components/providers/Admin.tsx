import React from "react";

export default function AdminProvider({children}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
