import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Book title is required'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters'],
  },
  author: {
    type: String,
    required: [true, 'Author is required'],
    trim: true,
    maxlength: [100, 'Author name cannot be more than 100 characters'],
  },
  genre: {
    type: String,
    required: [true, 'Genre is required'],
    enum: [
      'Fiction', 'Non-Fiction', 'Mystery', 'Romance', 'Science Fiction',
      'Fantasy', 'Biography', 'History', 'Self-Help', 'Textbook',
      'Children', 'Young Adult', 'Poetry', 'Philosophy', 'Religion'
    ],
  },
  condition: {
    type: String,
    required: [true, 'Book condition is required'],
    enum: ['new', 'like-new', 'good', 'fair', 'poor'],
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0.01, 'Price must be greater than 0'],
    max: [10000, 'Price cannot exceed $10,000'],
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    minlength: [20, 'Description must be at least 20 characters'],
    maxlength: [1000, 'Description cannot be more than 1000 characters'],
  },
  imageUrl: {
    type: String,
    default: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg',
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['available', 'sold', 'reserved'],
    default: 'available',
  },
  views: {
    type: Number,
    default: 0,
  },
  featured: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

// Indexes for better query performance
bookSchema.index({ seller: 1 });
bookSchema.index({ genre: 1 });
bookSchema.index({ condition: 1 });
bookSchema.index({ price: 1 });
bookSchema.index({ status: 1 });
bookSchema.index({ createdAt: -1 });
bookSchema.index({ title: 'text', author: 'text', description: 'text' });

// Virtual for seller information
bookSchema.virtual('sellerInfo', {
  ref: 'User',
  localField: 'seller',
  foreignField: '_id',
  justOne: true,
});

// Ensure virtual fields are serialized
bookSchema.set('toJSON', { virtuals: true });
bookSchema.set('toObject', { virtuals: true });

// Instance method to increment views
bookSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

// Static method to find available books
bookSchema.statics.findAvailable = function() {
  return this.find({ status: 'available' });
};

// Static method to search books
bookSchema.statics.searchBooks = function(query) {
  return this.find({
    $text: { $search: query },
    status: 'available'
  }).sort({ score: { $meta: 'textScore' } });
};

const Book = mongoose.model('Book', bookSchema);

export default Book;