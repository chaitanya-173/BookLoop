# BookLoop Backend API

A comprehensive Node.js backend for the BookLoop book trading platform.

## Features

- **User Authentication**: JWT-based authentication with registration and login
- **Book Management**: CRUD operations for book listings
- **Search & Filtering**: Advanced search with filters for genre, condition, price range
- **User Profiles**: Public user profiles with book statistics
- **Security**: Rate limiting, input validation, and secure password hashing
- **Database**: MongoDB with Mongoose ODM

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update user profile

### Books
- `GET /api/books` - Get all books with filtering and pagination
- `GET /api/books/:id` - Get single book by ID
- `POST /api/books` - Create new book listing (auth required)
- `PUT /api/books/:id` - Update book listing (auth required, owner only)
- `DELETE /api/books/:id` - Delete book listing (auth required, owner only)
- `GET /api/books/user/:userId` - Get books by user ID

### Users
- `GET /api/users/profile/:userId` - Get public user profile
- `GET /api/users/search` - Search users by name or location
- `GET /api/users/stats` - Get platform statistics

## Setup Instructions

1. **Install Dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Environment Configuration**
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your MongoDB URI and other configuration:
   ```
   MONGODB_URI=mongodb://localhost:27017/bookloop
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_EXPIRE=7d
   PORT=5000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5173
   ```

3. **Start the Server**
   ```bash
   # Development mode with auto-restart
   npm run dev
   
   # Production mode
   npm start
   ```

4. **Test the API**
   Visit `http://localhost:5000/api/health` to verify the server is running.

## Database Schema

### User Model
- `name`: String (required, 2-50 chars)
- `email`: String (required, unique, valid email)
- `password`: String (required, min 6 chars, hashed)
- `phone`: String (required)
- `location`: String (required)
- `avatar`: String (optional)
- `isActive`: Boolean (default: true)
- `lastLogin`: Date
- `timestamps`: createdAt, updatedAt

### Book Model
- `title`: String (required, max 200 chars)
- `author`: String (required, max 100 chars)
- `genre`: String (required, enum values)
- `condition`: String (required, enum: new, like-new, good, fair, poor)
- `price`: Number (required, 0.01-10000)
- `description`: String (required, 20-1000 chars)
- `imageUrl`: String (optional, default provided)
- `seller`: ObjectId (ref: User, required)
- `status`: String (enum: available, sold, reserved, default: available)
- `views`: Number (default: 0)
- `featured`: Boolean (default: false)
- `timestamps`: createdAt, updatedAt

## Security Features

- **Password Hashing**: bcryptjs with salt rounds
- **JWT Authentication**: Secure token-based authentication
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Input Validation**: express-validator for all inputs
- **CORS Protection**: Configured for frontend domain
- **Helmet**: Security headers
- **Error Handling**: Comprehensive error handling middleware

## API Response Format

All API responses follow this consistent format:

```json
{
  "status": "success|error",
  "message": "Human readable message",
  "data": {
    // Response data
  },
  "errors": [
    // Validation errors (if any)
  ]
}
```

## Development

- Use `npm run dev` for development with auto-restart
- MongoDB connection is automatically established on startup
- All routes are prefixed with `/api`
- Comprehensive error logging to console

## Production Deployment

1. Set `NODE_ENV=production` in environment
2. Use a production MongoDB instance
3. Set strong JWT secret
4. Configure proper CORS origins
5. Use process manager like PM2
6. Set up proper logging and monitoring

## Contributing

1. Follow the existing code structure
2. Add proper validation for all inputs
3. Include error handling for all routes
4. Update documentation for new endpoints
5. Test all functionality before submitting