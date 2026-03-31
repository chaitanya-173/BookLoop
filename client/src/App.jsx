import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Home from "./pages/Home";

import ProtectedRoute from "./components/ProtectedRoute";

// Placeholder pages (baad me replace karenge)
import MyBooks from "./pages/MyBooks";
import Sell from "./pages/Sell";
import Categories from "./pages/Categories";
import EditProfile from "./pages/EditProfile";
import Favourites from "./pages/Favourites";
import ListingDetails from "./pages/ListingDetails";

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/categories" element={<Categories />} />

        {/* Protected Routes */}
        <Route
          path="/my-books"
          element={
            <ProtectedRoute>
              <MyBooks />
            </ProtectedRoute>
          }
        />

        <Route
          path="/listing/:id"
          element={
            <ProtectedRoute>
              <ListingDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/sell"
          element={
            <ProtectedRoute>
              <Sell />
            </ProtectedRoute>
          }
        />

        <Route
          path="/edit-profile"
          element={
            <ProtectedRoute>
              <EditProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/favourites"
          element={
            <ProtectedRoute>
              <Favourites />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
