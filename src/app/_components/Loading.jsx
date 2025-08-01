import React from "react";
// Loading component that is displayed while data is being fetched from the server
// It shows a spinner to indicate that the application is busy loading data
export default function Loading() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-purple-700"></div>
    </div>
  );
}
