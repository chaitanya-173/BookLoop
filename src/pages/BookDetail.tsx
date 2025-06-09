import React from 'react';
import { ArrowLeft, MapPin, Phone, Mail, Calendar, Tag, Star, MessageCircle } from 'lucide-react';
import { Book } from '../types';

interface BookDetailProps {
  book: Book;
  onBack: () => void;
}

const BookDetail: React.FC<BookDetailProps> = ({ book, onBack }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'new':
        return 'bg-green-100 text-green-800';
      case 'like-new':
        return 'bg-blue-100 text-blue-800';
      case 'good':
        return 'bg-yellow-100 text-yellow-800';
      case 'fair':
        return 'bg-orange-100 text-orange-800';
      case 'poor':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleContact = (method: 'phone' | 'email') => {
    if (method === 'phone') {
      window.open(`tel:${book.sellerPhone}`);
    } else {
      window.open(`mailto:${book.sellerEmail}?subject=Interested in "${book.title}"`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-orange-400 hover:text-orange-300 mb-6 transition-colors duration-200"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Books</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Book Image */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <img
                src={book.imageUrl || 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg'}
                alt={book.title}
                className="w-full rounded-lg shadow-xl"
              />
              
              {/* Quick Actions */}
              <div className="mt-6 space-y-3">
                <button
                  onClick={() => handleContact('phone')}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors duration-200"
                >
                  <Phone className="h-5 w-5" />
                  <span>Call Seller</span>
                </button>
                
                <button
                  onClick={() => handleContact('email')}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 border border-orange-600 text-orange-400 rounded-lg hover:bg-orange-600 hover:text-white transition-colors duration-200"
                >
                  <Mail className="h-5 w-5" />
                  <span>Send Email</span>
                </button>
              </div>
            </div>
          </div>

          {/* Book Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title and Price */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <h1 className="text-3xl font-bold text-white">{book.title}</h1>
                <div className="text-right">
                  <div className="text-3xl font-bold text-orange-400">${book.price}</div>
                  <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-2 ${getConditionColor(book.condition)}`}>
                    {book.condition.charAt(0).toUpperCase() + book.condition.slice(1).replace('-', ' ')}
                  </div>
                </div>
              </div>
              
              <p className="text-xl text-gray-300 mb-2">by {book.author}</p>
              
              <div className="flex items-center space-x-4 text-gray-400">
                <div className="flex items-center space-x-1">
                  <Tag className="h-4 w-4" />
                  <span>{book.genre}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>Listed {formatDate(book.createdAt)}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h2 className="text-xl font-semibold text-white mb-4">Description</h2>
              <p className="text-gray-300 leading-relaxed">{book.description}</p>
            </div>

            {/* Seller Information */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h2 className="text-xl font-semibold text-white mb-4">Seller Information</h2>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-orange-600 p-2 rounded-full">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-medium">{book.sellerName}</p>
                    <p className="text-gray-400 text-sm">Seller</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3 text-gray-300">
                    <MapPin className="h-5 w-5 text-gray-400" />
                    <span>{book.sellerLocation}</span>
                  </div>
                  
                  <div className="flex items-center space-x-3 text-gray-300">
                    <Phone className="h-5 w-5 text-gray-400" />
                    <span>{book.sellerPhone}</span>
                  </div>
                  
                  <div className="flex items-center space-x-3 text-gray-300 md:col-span-2">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <span className="break-all">{book.sellerEmail}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Book Details Card */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h2 className="text-xl font-semibold text-white mb-4">Book Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-400 text-sm">Title</label>
                  <p className="text-white">{book.title}</p>
                </div>
                
                <div>
                  <label className="text-gray-400 text-sm">Author</label>
                  <p className="text-white">{book.author}</p>
                </div>
                
                <div>
                  <label className="text-gray-400 text-sm">Genre</label>
                  <p className="text-white">{book.genre}</p>
                </div>
                
                <div>
                  <label className="text-gray-400 text-sm">Condition</label>
                  <p className="text-white capitalize">{book.condition.replace('-', ' ')}</p>
                </div>
                
                <div>
                  <label className="text-gray-400 text-sm">Price</label>
                  <p className="text-white font-semibold">${book.price}</p>
                </div>
                
                <div>
                  <label className="text-gray-400 text-sm">Listed</label>
                  <p className="text-white">{formatDate(book.createdAt)}</p>
                </div>
              </div>
            </div>

            {/* Safety Tips */}
            <div className="bg-yellow-900 bg-opacity-30 border border-yellow-600 rounded-lg p-6">
              <h3 className="text-yellow-400 font-semibold mb-3">Safety Tips</h3>
              <ul className="text-yellow-200 text-sm space-y-1">
                <li>• Meet in a public place for transactions</li>
                <li>• Inspect the book thoroughly before purchasing</li>
                <li>• Verify seller identity and contact information</li>
                <li>• Trust your instincts - if something feels wrong, walk away</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;