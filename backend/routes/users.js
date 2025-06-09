import express from 'express';
import { query } from 'express-validator';
import User from '../models/User.js';
import Book from '../models/Book.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/users/profile/:userId
// @desc    Get user profile by ID
// @access  Public
router.get('/profile/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user || !user.isActive) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found',
      });
    }

    // Get user's book statistics
    const bookStats = await Book.aggregate([
      { $match: { seller: user._id } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    const stats = {
      available: 0,
      sold: 0,
      reserved: 0,
    };

    bookStats.forEach(stat => {
      stats[stat._id] = stat.count;
    });

    const totalBooks = stats.available + stats.sold + stats.reserved;

    res.json({
      status: 'success',
      data: {
        user: {
          id: user._id,
          name: user.name,
          location: user.location,
          memberSince: user.createdAt,
          totalBooks,
          stats,
        },
      },
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid user ID',
      });
    }
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching user profile',
    });
  }
});

// @route   GET /api/users/search
// @desc    Search users by name or location
// @access  Public
router.get('/search', [
  query('q').trim().isLength({ min: 2 }).withMessage('Search query must be at least 2 characters'),
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
], async (req, res) => {
  try {
    const { q, page = 1, limit = 10 } = req.query;

    const users = await User.find({
      $and: [
        { isActive: true },
        {
          $or: [
            { name: { $regex: q, $options: 'i' } },
            { location: { $regex: q, $options: 'i' } },
          ],
        },
      ],
    })
      .select('name location createdAt')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ name: 1 });

    const total = await User.countDocuments({
      $and: [
        { isActive: true },
        {
          $or: [
            { name: { $regex: q, $options: 'i' } },
            { location: { $regex: q, $options: 'i' } },
          ],
        },
      ],
    });

    res.json({
      status: 'success',
      data: {
        users: users.map(user => ({
          id: user._id,
          name: user.name,
          location: user.location,
          memberSince: user.createdAt,
        })),
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalUsers: total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1,
        },
      },
    });
  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while searching users',
    });
  }
});

// @route   GET /api/users/stats
// @desc    Get platform statistics
// @access  Public
router.get('/stats', async (req, res) => {
  try {
    const [userCount, bookCount, availableBooks] = await Promise.all([
      User.countDocuments({ isActive: true }),
      Book.countDocuments(),
      Book.countDocuments({ status: 'available' }),
    ]);

    // Get genre distribution
    const genreStats = await Book.aggregate([
      { $match: { status: 'available' } },
      {
        $group: {
          _id: '$genre',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    res.json({
      status: 'success',
      data: {
        totalUsers: userCount,
        totalBooks: bookCount,
        availableBooks,
        soldBooks: bookCount - availableBooks,
        topGenres: genreStats.map(genre => ({
          name: genre._id,
          count: genre.count,
        })),
      },
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching statistics',
    });
  }
});

export default router;