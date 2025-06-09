import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Home from './pages/Home';
import BookDetail from './pages/BookDetail';
import Profile from './pages/Profile';
import AuthForm from './components/AuthForm';
import BookForm from './components/BookForm';
import { Book } from './types';
import { storageUtils } from './utils/localStorage';

type Page = 'home' | 'login' | 'register' | 'add-book' | 'profile' | string;

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  const handleNavigate = (page: Page) => {
    setCurrentPage(page);
    setSelectedBook(null);
  };

  const handleBookClick = (book: Book) => {
    setSelectedBook(book);
    setCurrentPage(`book-detail-${book.id}`);
  };

  const handleAuthSuccess = () => {
    setCurrentPage('home');
  };

  const handleBookSave = (book: Book) => {
    storageUtils.saveBook(book);
    setCurrentPage('profile');
  };

  const renderPage = () => {
    if (currentPage.startsWith('book-detail-') && selectedBook) {
      return (
        <BookDetail 
          book={selectedBook} 
          onBack={() => handleNavigate('home')} 
        />
      );
    }

    switch (currentPage) {
      case 'home':
        return <Home onBookClick={handleBookClick} />;
      
      case 'login':
        return (
          <AuthForm
            mode="login"
            onSuccess={handleAuthSuccess}
            onToggleMode={() => setCurrentPage('register')}
          />
        );
      
      case 'register':
        return (
          <AuthForm
            mode="register"
            onSuccess={handleAuthSuccess}
            onToggleMode={() => setCurrentPage('login')}
          />
        );
      
      case 'add-book':
        return (
          <BookForm
            onClose={() => handleNavigate('profile')}
            onSave={handleBookSave}
          />
        );
      
      case 'profile':
        return <Profile onNavigate={handleNavigate} />;
      
      default:
        return <Home onBookClick={handleBookClick} />;
    }
  };

  const shouldShowHeader = !['login', 'register', 'add-book'].includes(currentPage);

  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-900 font-inter">
        {shouldShowHeader && (
          <Header 
            onNavigate={handleNavigate} 
            currentPage={currentPage}
          />
        )}
        {renderPage()}
      </div>
    </AuthProvider>
  );
}

export default App;