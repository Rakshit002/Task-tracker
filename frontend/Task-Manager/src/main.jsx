import React from "react";
import ReactDOM from "react-dom/client";
import { Toaster } from "react-hot-toast";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3000,
        style: {
          background: "#18181b",
          color: "#fafafa",
          borderRadius: "10px",
          fontSize: "14px",
        },
        success: {
          iconTheme: {
            primary: "#22c55e",
            secondary: "#fafafa",
          },
        },
        error: {
          iconTheme: {
            primary: "#ef4444",
            secondary: "#fafafa",
          },
        },
      }}
    />
  </React.StrictMode>
);
