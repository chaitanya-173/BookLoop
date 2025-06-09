import { configureStore } from "@reduxjs/toolkit";
import snippetReducer from "./snippetSlice";
import themeReducer from "./themeSlice";

const store = configureStore({
  reducer: {
    snippet: snippetReducer,
    theme: themeReducer,
  },
});

export default store;
