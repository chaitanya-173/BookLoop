import api from "../api/axios";

export const lookupBookByIsbn = async (isbn) => {
  return await api.get(`/api/books/lookup?isbn=${encodeURIComponent(isbn)}`);
};