import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  snippets: localStorage.getItem("snippets")
    ? JSON.parse(localStorage.getItem("snippets"))
    : [],
};

const snippetSlice = createSlice({
  name: "snippet",
  initialState,
  reducers: {
    addToSnippets: (state, action) => {
      const snippet = action.payload;
      const index = state.snippets.findIndex(
        (item) => item._id === snippet._id
      );

      if (index >= 0) {
        // If the snippet is already in the Snippets, do not modify the quantity
        return;
      } else {
        // If the snippet is not in the Snippets, add it to the Snippets
        state.snippets.push(snippet);
      }

      localStorage.setItem("snippets", JSON.stringify(state.snippets));
    },
    updateSnippets: (state, action) => {
      const snippet = action.payload;
      const index = state.snippets.findIndex(
        (item) => item._id === snippet._id
      );

      if (index >= 0) {
        // If the snippet is found in the Snippets, update it
        state.snippets[index] = snippet;
      }

      localStorage.setItem("snippets", JSON.stringify(state.snippets));
    },
    removeFromSnippets: (state, action) => {
      const snippetId = action.payload;

      const index = state.snippets.findIndex((item) => item._id === snippetId);

      if (index >= 0) {
        // If the snippet is found in the Snippets, remove it
        state.snippets.splice(index, 1);
      }

      localStorage.setItem("snippets", JSON.stringify(state.snippets));
    },
    resetSnippet: (state) => {
      state.snippets = [];
      localStorage.removeItem("snippets");
    },
  },
});

export const { addToSnippets, removeFromSnippets, updateSnippets } =
  snippetSlice.actions;

export default snippetSlice.reducer;
