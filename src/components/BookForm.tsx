import React, { useState } from 'react';
import { Save, Upload, X, ArrowLeft } from 'lucide-react';
import { Book } from '../types';
import { useAuth } from '../context/AuthContext';
import { storageUtils } from '../utils/localStorage';

interface BookFormProps {
  onClose: () => void;
  onSave: (book: Book) => void;
  book?: Book;
}

const BookForm: React.FC<BookFormProps> = ({ onClose, onSave, book }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: book?.title || '',
    author: book?.author || '',
    genre: book?.genre || '',
    condition: book?.condition || 'good',
    price: book?.price || 0,
    description: book?.description || '',
    imageUrl: book?.imageUrl || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const genres = [
    'Fiction', 'Non-Fiction', 'Mystery', 'Romance', 'Science Fiction',
    'Fantasy', 'Biography', 'History', 'Self-Help', 'Textbook',
    'Children', 'Young Adult', 'Poetry', 'Philosophy', 'Religion'
  ];

  const conditions = [
    { value: 'new', label: 'New', description: 'Brand new, never used' },
    { value: 'like-new', label: 'Like New', description: 'Excellent condition, minimal wear' },
    { value: 'good', label: 'Good', description: 'Good condition, some wear' },
    { value: 'fair', label: 'Fair', description: 'Readable, noticeable wear' },
    { value: 'poor', label: 'Poor', description: 'Heavy wear, still readable' },
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.author.trim()) newErrors.author = 'Author is required';
    if (!formData.genre) newErrors.genre = 'Genre is required';
    if (!formData.condition) newErrors.condition = 'Condition is required';
    if (formData.price <= 0) newErrors.price = 'Price must be greater than 0';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (formData.description.trim().length < 20) newErrors.description = 'Description must be at least 20 characters';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !user) return;

    setIsSubmitting(true);

    try {
      const bookData: Book = {
        id: book?.id || storageUtils.generateId(),
        title: formData.title.trim(),
        author: formData.author.trim(),
        genre: formData.genre,
        condition: formData.condition as Book['condition'],
        price: formData.price,
        description: formData.description.trim(),
        imageUrl: formData.imageUrl.trim() || 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg',
        sellerId: user.id,
        sellerName: user.name,
        sellerEmail: user.email,
        sellerPhone: user.phone,
        sellerLocation: user.location,
        createdAt: book?.createdAt || new Date().toISOString(),
        status: book?.status || 'available',
      };

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onSave(bookData);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) || 0 : value,
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-gray-400 mb-4">Please login to sell books</p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors duration-200"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 font-inter">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={onClose}
              className="flex items-center space-x-2 text-orange-400 hover:text-orange-300 transition-colors duration-200"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Profile</span>
            </button>
            <h1 className="text-xl font-semibold text-white">
              {book ? 'Edit Book Listing' : 'Sell Your Book'}
            </h1>
            <div className="w-24"></div> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gray-800 rounded-xl shadow-2xl border border-gray-700">
          <div className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">
                {book ? 'Update Your Book' : 'List Your Book for Sale'}
              </h2>
              <p className="text-gray-400">
                Fill in the details below to {book ? 'update' : 'create'} your book listing
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Information */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">
                  Basic Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Book Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter the book title"
                    />
                    {errors.title && <p className="mt-2 text-sm text-red-400">{errors.title}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Author *
                    </label>
                    <input
                      type="text"
                      name="author"
                      value={formData.author}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter the author name"
                    />
                    {errors.author && <p className="mt-2 text-sm text-red-400">{errors.author}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Genre *
                    </label>
                    <select
                      name="genre"
                      value={formData.genre}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value="">Select Genre</option>
                      {genres.map(genre => (
                        <option key={genre} value={genre}>{genre}</option>
                      ))}
                    </select>
                    {errors.genre && <p className="mt-2 text-sm text-red-400">{errors.genre}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Condition *
                    </label>
                    <select
                      name="condition"
                      value={formData.condition}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                    >
                      {conditions.map(condition => (
                        <option key={condition.value} value={condition.value}>
                          {condition.label}
                        </option>
                      ))}
                    </select>
                    {errors.condition && <p className="mt-2 text-sm text-red-400">{errors.condition}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Price ($) *
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                      placeholder="0.00"
                    />
                    {errors.price && <p className="mt-2 text-sm text-red-400">{errors.price}</p>}
                  </div>
                </div>
              </div>

              {/* Additional Details */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">
                  Additional Details
                </h3>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Book Image URL
                  </label>
                  <input
                    type="url"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                    placeholder="https://example.com/book-image.jpg"
                  />
                  <p className="mt-2 text-xs text-gray-400">
                    Leave empty to use a default book image. For best results, use a high-quality image URL.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={5}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none transition-all duration-200"
                    placeholder="Describe the book's condition, any special features, why you're selling it, or any other relevant information that would help potential buyers..."
                  />
                  <div className="flex justify-between items-center mt-2">
                    {errors.description && <p className="text-sm text-red-400">{errors.description}</p>}
                    <p className="text-xs text-gray-400 ml-auto">
                      {formData.description.length}/500 characters
                    </p>
                  </div>
                </div>
              </div>

              {/* Condition Guide */}
              <div className="bg-gray-700 rounded-lg p-6">
                <h4 className="text-sm font-semibold text-white mb-3">Condition Guide</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {conditions.map(condition => (
                    <div key={condition.value} className="text-xs">
                      <span className="font-medium text-orange-400">{condition.label}:</span>
                      <span className="text-gray-300 ml-1">{condition.description}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-700">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-6 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-all duration-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg hover:from-orange-700 hover:to-orange-800 transition-all duration-200 flex items-center justify-center space-x-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-orange-500/25"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      <span>{book ? 'Update Book' : 'List Book for Sale'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookForm;