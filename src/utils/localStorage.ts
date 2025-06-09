import { User, Book } from '../types';

const USERS_KEY = 'bookloop_users';
const BOOKS_KEY = 'bookloop_books';
const CURRENT_USER_KEY = 'bookloop_current_user';

export const storageUtils = {
  // User management
  getUsers: (): User[] => {
    const users = localStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : [];
  },

  saveUser: (user: User): void => {
    const users = storageUtils.getUsers();
    const existingIndex = users.findIndex(u => u.id === user.id);
    if (existingIndex >= 0) {
      users[existingIndex] = user;
    } else {
      users.push(user);
    }
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  },

  findUserByEmail: (email: string): User | null => {
    const users = storageUtils.getUsers();
    return users.find(u => u.email === email) || null;
  },

  // Current user session
  getCurrentUser: (): User | null => {
    const user = localStorage.getItem(CURRENT_USER_KEY);
    return user ? JSON.parse(user) : null;
  },

  setCurrentUser: (user: User | null): void => {
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  },

  // Book management
  getBooks: (): Book[] => {
    const books = localStorage.getItem(BOOKS_KEY);
    return books ? JSON.parse(books) : [];
  },

  saveBook: (book: Book): void => {
    const books = storageUtils.getBooks();
    const existingIndex = books.findIndex(b => b.id === book.id);
    if (existingIndex >= 0) {
      books[existingIndex] = book;
    } else {
      books.push(book);
    }
    localStorage.setItem(BOOKS_KEY, JSON.stringify(books));
  },

  getBookById: (id: string): Book | null => {
    const books = storageUtils.getBooks();
    return books.find(b => b.id === id) || null;
  },

  getUserBooks: (userId: string): Book[] => {
    const books = storageUtils.getBooks();
    return books.filter(b => b.sellerId === userId);
  },

  generateId: (): string => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
};