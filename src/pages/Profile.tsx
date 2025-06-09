import React, { useState, useEffect } from 'react';
import { User, Book as BookIcon, Edit, Trash2, Plus, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Book } from '../types';
import { storageUtils } from '../utils/localStorage';
import BookForm from '../components/BookForm';
import BookCard from '../components/BookCard';

interface ProfileProps {
  onNavigate: (page: string) => void;
}

const Profile: React.FC<ProfileProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [userBooks, setUserBooks] = useState<Book[]>([]);
  const [showBookForm, setShowBookForm] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | undefined>();
  const [activeTab, setActiveTab] = useState<'books' | 'profile'>('books');

  useEffect(() => {
    if (user) {
      loadUserBooks();
    }
  }, [user]);

  const loadUserBooks = () => {
    if (user) {
      const books = storageUtils.getUserBooks(user.id);
      setUserBooks(books);
    }
  };

  const handleSaveBook = (book: Book) => {
    storageUtils.saveBook(book);
    loadUserBooks();
    setShowBookForm(false);
    setEditingBook(undefined);
  };

  const handleEditBook = (book: Book) => {
    setEditingBook(book);
    setShowBookForm(true);
  };

  const handleDeleteBook = (bookId: string) => {
    if (window.confirm('Are you sure you want to delete this book listing?')) {
      // In a real app, you'd have a proper delete method
      const books = storageUtils.getBooks().filter(b => b.id !== bookId);
      localStorage.setItem('bookloop_books', JSON.stringify(books));
      loadUserBooks();
    }
  };

  const handleBookClick = (book: Book) => {
    // Navigate to book detail view
    onNavigate(`book-detail-${book.id}`);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">Please login to view your profile</p>
          <button
            onClick={() => onNavigate('login')}
            className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors duration-200"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8 border border-gray-700">
          <div className="flex items-center space-x-4">
            <div className="bg-orange-600 p-4 rounded-full">
              <User className="h-8 w-8 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-white">{user.name}</h1>
              <p className="text-gray-400">{user.email}</p>
              <p className="text-gray-400">{user.location}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-orange-400">{userBooks.length}</div>
              <div className="text-gray-400 text-sm">Books Listed</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-8">
          <button
            onClick={() => setActiveTab('books')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
              activeTab === 'books'
                ? 'bg-orange-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            My Books
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
              activeTab === 'profile'
                ? 'bg-orange-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            Profile Settings
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'books' ? (
          <div>
            {/* Add Book Button */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-white">My Book Listings</h2>
              <button
                onClick={() => setShowBookForm(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors duration-200"
              >
                <Plus className="h-4 w-4" />
                <span>Add Book</span>
              </button>
            </div>

            {/* Books Grid */}
            {userBooks.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userBooks.map(book => (
                  <div key={book.id} className="relative group">
                    <BookCard book={book} onClick={handleBookClick} />
                    
                    {/* Action Buttons */}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditBook(book);
                        }}
                        className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors duration-200"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteBook(book.id);
                        }}
                        className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors duration-200"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <BookIcon className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-400 mb-2">No books listed yet</h3>
                <p className="text-gray-500 mb-6">Start selling by adding your first book!</p>
                <button
                  onClick={() => setShowBookForm(true)}
                  className="px-6 py-3 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors duration-200"
                >
                  Add Your First Book
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-6">Profile Information</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                <p className="text-white bg-gray-700 px-3 py-2 rounded-md">{user.name}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                <p className="text-white bg-gray-700 px-3 py-2 rounded-md">{user.email}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number</label>
                <p className="text-white bg-gray-700 px-3 py-2 rounded-md">{user.phone}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
                <p className="text-white bg-gray-700 px-3 py-2 rounded-md">{user.location}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Member Since</label>
                <p className="text-white bg-gray-700 px-3 py-2 rounded-md">
                  {new Date(user.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-700">
              <p className="text-gray-400 text-sm">
                Profile editing will be available in a future update. Contact support if you need to update your information.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Book Form Modal */}
      {showBookForm && (
        <BookForm
          book={editingBook}
          onClose={() => {
            setShowBookForm(false);
            setEditingBook(undefined);
          }}
          onSave={handleSaveBook}
        />
      )}
    </div>
  );
};

export default Profile;