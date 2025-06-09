import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Provider } from "react-redux";
import store from "./redux/store.js";
import { Toaster } from "react-hot-toast";

// Add dark mode class to html element based on localStorage
const isDarkMode = localStorage.getItem("isDarkMode") === "true";
if (isDarkMode) {
  document.documentElement.classList.add("dark");
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <div className="min-h-screen w-screen overflow-hidden">
        <App />
        <Toaster position="top-right" />
      </div>
    </Provider>
  </StrictMode>
);
