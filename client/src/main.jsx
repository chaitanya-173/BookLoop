import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { ListingsProvider } from "./context/ListingsContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <ThemeProvider>
        <ListingsProvider>
          <App />
        </ListingsProvider>
      </ThemeProvider>
    </AuthProvider>
  </StrictMode>,
);
