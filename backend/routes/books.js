import express from 'express';
import { body, validationResult, query } from 'express-validator';
import Book from '../models/Book.js';
import User from '../models/User.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/books
// @desc    Get all available books with filtering and pagination
// @access  Public
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('genre').optional().trim(),
  query('condition').optional().isIn(['new', 'like-new', 'good', 'fair', 'poor']),
  query('minPrice').optional().isFloat({ min: 0 }),
  query('maxPrice').optional().isFloat({ min: 0 }),
  query('search').optional().trim(),
  query('sortBy').optional().isIn(['createdAt', 'price', 'title', 'views']),
  query('sortOrder').optional().isIn(['asc', 'desc']),
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    const {
      page = 1,
      limit = 12,
      genre,
      condition,
      minPrice,
      maxPrice,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = { status: 'available' };

    if (genre) filter.genre = genre;
    if (condition) filter.condition = condition;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    let query;

    if (search) {
      // Text search
      query = Book.find({
        ...filter,
        $text: { $search: search }
      }).sort({ score: { $meta: 'textScore' }, ...sort });
    } else {
      query = Book.find(filter).sort(sort);
    }

    // Execute query with pagination
    const books = await query
      .populate('seller', 'name email phone location')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    // Get total count for pagination
    const total = await Book.countDocuments(search ? {
      ...filter,
      $text: { $search: search }
    } : filter);

    // Transform books to include seller info
    const transformedBooks = books.map(book => ({
      id: book._id,
      title: book.title,
      author: book.author,
      genre: book.genre,
      condition: book.condition,
      price: book.price,
      description: book.description,
      imageUrl: book.imageUrl,
      sellerId: book.seller._id,
      sellerName: book.seller.name,
      sellerEmail: book.seller.email,
      sellerPhone: book.seller.phone,
      sellerLocation: book.seller.location,
      createdAt: book.createdAt,
      status: book.status,
      views: book.views,
    }));

    res.json({
      status: 'success',
      data: {
        books: transformedBooks,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalBooks: total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1,
        },
      },
    });
  } catch (error) {
    console.error('Get books error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching books',
    });
  }
});

// @route   GET /api/books/:id
// @desc    Get single book by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)
      .populate('seller', 'name email phone location createdAt');

    if (!book) {
      return res.status(404).json({
        status: 'error',
        message: 'Book not found',
      });
    }

    // Increment views
    await book.incrementViews();

    // Transform book data
    const transformedBook = {
      id: book._id,
      title: book.title,
      author: book.author,
      genre: book.genre,
      condition: book.condition,
      price: book.price,
      description: book.description,
      imageUrl: book.imageUrl,
      sellerId: book.seller._id,
      sellerName: book.seller.name,
      sellerEmail: book.seller.email,
      sellerPhone: book.seller.phone,
      sellerLocation: book.seller.location,
      createdAt: book.createdAt,
      status: book.status,
      views: book.views,
    };

    res.json({
      status: 'success',
      data: {
        book: transformedBook,
      },
    });
  } catch (error) {
    console.error('Get book error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid book ID',
      });
    }
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching book',
    });
  }
});

// @route   POST /api/books
// @desc    Create a new book listing
// @access  Private
router.post('/', auth, [
  body('title')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be between 1 and 200 characters'),
  body('author')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Author must be between 1 and 100 characters'),
  body('genre')
    .isIn([
      'Fiction', 'Non-Fiction', 'Mystery', 'Romance', 'Science Fiction',
      'Fantasy', 'Biography', 'History', 'Self-Help', 'Textbook',
      'Children', 'Young Adult', 'Poetry', 'Philosophy', 'Religion'
    ])
    .withMessage('Invalid genre'),
  body('condition')
    .isIn(['new', 'like-new', 'good', 'fair', 'poor'])
    .withMessage('Invalid condition'),
  body('price')
    .isFloat({ min: 0.01, max: 10000 })
    .withMessage('Price must be between $0.01 and $10,000'),
  body('description')
    .trim()
    .isLength({ min: 20, max: 1000 })
    .withMessage('Description must be between 20 and 1000 characters'),
  body('imageUrl')
    .optional()
    .isURL()
    .withMessage('Image URL must be valid'),
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    const { title, author, genre, condition, price, description, imageUrl } = req.body;

    // Create new book
    const book = new Book({
      title,
      author,
      genre,
      condition,
      price,
      description,
      imageUrl: imageUrl || 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg',
      seller: req.user.userId,
    });

    await book.save();

    // Populate seller info
    await book.populate('seller', 'name email phone location');

    // Transform book data
    const transformedBook = {
      id: book._id,
      title: book.title,
      author: book.author,
      genre: book.genre,
      condition: book.condition,
      price: book.price,
      description: book.description,
      imageUrl: book.imageUrl,
      sellerId: book.seller._id,
      sellerName: book.seller.name,
      sellerEmail: book.seller.email,
      sellerPhone: book.seller.phone,
      sellerLocation: book.seller.location,
      createdAt: book.createdAt,
      status: book.status,
      views: book.views,
    };

    res.status(201).json({
      status: 'success',
      message: 'Book listed successfully',
      data: {
        book: transformedBook,
      },
    });
  } catch (error) {
    console.error('Create book error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while creating book listing',
    });
  }
});

// @route   PUT /api/books/:id
// @desc    Update book listing
// @access  Private (only book owner)
router.put('/:id', auth, [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be between 1 and 200 characters'),
  body('author')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Author must be between 1 and 100 characters'),
  body('genre')
    .optional()
    .isIn([
      'Fiction', 'Non-Fiction', 'Mystery', 'Romance', 'Science Fiction',
      'Fantasy', 'Biography', 'History', 'Self-Help', 'Textbook',
      'Children', 'Young Adult', 'Poetry', 'Philosophy', 'Religion'
    ])
    .withMessage('Invalid genre'),
  body('condition')
    .optional()
    .isIn(['new', 'like-new', 'good', 'fair', 'poor'])
    .withMessage('Invalid condition'),
  body('price')
    .optional()
    .isFloat({ min: 0.01, max: 10000 })
    .withMessage('Price must be between $0.01 and $10,000'),
  body('description')
    .optional()
    .trim()
    .isLength({ min: 20, max: 1000 })
    .withMessage('Description must be between 20 and 1000 characters'),
  body('imageUrl')
    .optional()
    .isURL()
    .withMessage('Image URL must be valid'),
  body('status')
    .optional()
    .isIn(['available', 'sold', 'reserved'])
    .withMessage('Invalid status'),
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        status: 'error',
        message: 'Book not found',
      });
    }

    // Check if user owns the book
    if (book.seller.toString() !== req.user.userId) {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to update this book',
      });
    }

    // Update book fields
    const updateFields = ['title', 'author', 'genre', 'condition', 'price', 'description', 'imageUrl', 'status'];
    updateFields.forEach(field => {
      if (req.body[field] !== undefined) {
        book[field] = req.body[field];
      }
    });

    await book.save();

    // Populate seller info
    await book.populate('seller', 'name email phone location');

    // Transform book data
    const transformedBook = {
      id: book._id,
      title: book.title,
      author: book.author,
      genre: book.genre,
      condition: book.condition,
      price: book.price,
      description: book.description,
      imageUrl: book.imageUrl,
      sellerId: book.seller._id,
      sellerName: book.seller.name,
      sellerEmail: book.seller.email,
      sellerPhone: book.seller.phone,
      sellerLocation: book.seller.location,
      createdAt: book.createdAt,
      status: book.status,
      views: book.views,
    };

    res.json({
      status: 'success',
      message: 'Book updated successfully',
      data: {
        book: transformedBook,
      },
    });
  } catch (error) {
    console.error('Update book error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid book ID',
      });
    }
    res.status(500).json({
      status: 'error',
      message: 'Server error while updating book',
    });
  }
});

// @route   DELETE /api/books/:id
// @desc    Delete book listing
// @access  Private (only book owner)
router.delete('/:id', auth, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        status: 'error',
        message: 'Book not found',
      });
    }

    // Check if user owns the book
    if (book.seller.toString() !== req.user.userId) {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to delete this book',
      });
    }

    await Book.findByIdAndDelete(req.params.id);

    res.json({
      status: 'success',
      message: 'Book deleted successfully',
    });
  } catch (error) {
    console.error('Delete book error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid book ID',
      });
    }
    res.status(500).json({
      status: 'error',
      message: 'Server error while deleting book',
    });
  }
});

// @route   GET /api/books/user/:userId
// @desc    Get books by user ID
// @access  Public
router.get('/user/:userId', async (req, res) => {
  try {
    const books = await Book.find({ seller: req.params.userId })
      .populate('seller', 'name email phone location')
      .sort({ createdAt: -1 });

    // Transform books data
    const transformedBooks = books.map(book => ({
      id: book._id,
      title: book.title,
      author: book.author,
      genre: book.genre,
      condition: book.condition,
      price: book.price,
      description: book.description,
      imageUrl: book.imageUrl,
      sellerId: book.seller._id,
      sellerName: book.seller.name,
      sellerEmail: book.seller.email,
      sellerPhone: book.seller.phone,
      sellerLocation: book.seller.location,
      createdAt: book.createdAt,
      status: book.status,
      views: book.views,
    }));

    res.json({
      status: 'success',
      data: {
        books: transformedBooks,
      },
    });
  } catch (error) {
    console.error('Get user books error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid user ID',
      });
    }
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching user books',
    });
  }
});

export default router;