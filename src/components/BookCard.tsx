import React from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { Book } from '../types';

interface BookCardProps {
  book: Book;
  onClick: (book: Book) => void;
}

const BookCard: React.FC<BookCardProps> = ({ book, onClick }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
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

  return (
    <div
      onClick={() => onClick(book)}
      className="bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-700 hover:border-orange-500 group overflow-hidden"
    >
      {/* Book Image */}
      <div className="relative overflow-hidden">
        <img
          src={book.imageUrl || 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg'}
          alt={book.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getConditionColor(book.condition)}`}>
            {book.condition.charAt(0).toUpperCase() + book.condition.slice(1)}
          </span>
        </div>
        <div className="absolute top-3 left-3">
          <span className="bg-orange-600 text-white px-3 py-1 rounded-full text-sm font-bold">
            ${book.price}
          </span>
        </div>
      </div>

      {/* Book Details */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-white mb-1 line-clamp-1 group-hover:text-orange-400 transition-colors duration-200">
          {book.title}
        </h3>
        <p className="text-gray-400 text-sm mb-2">by {book.author}</p>
        <p className="text-gray-300 text-sm mb-3 line-clamp-2">{book.description}</p>
        
        {/* Genre */}
        <div className="mb-3">
          <span className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs">
            {book.genre}
          </span>
        </div>

        {/* Seller Info */}
        <div className="border-t border-gray-700 pt-3">
          <div className="flex items-center text-gray-400 text-xs mb-1">
            <MapPin className="h-3 w-3 mr-1" />
            <span>{book.sellerLocation}</span>
          </div>
          <div className="flex items-center text-gray-400 text-xs mb-1">
            <Phone className="h-3 w-3 mr-1" />
            <span>{book.sellerPhone}</span>
          </div>
          <div className="flex items-center text-gray-400 text-xs mb-2">
            <Mail className="h-3 w-3 mr-1" />
            <span className="truncate">{book.sellerEmail}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center text-gray-500 text-xs">
              <Clock className="h-3 w-3 mr-1" />
              <span>{formatDate(book.createdAt)}</span>
            </div>
            <span className="text-orange-400 text-sm font-medium">
              View Details →
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookCard;