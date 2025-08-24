# Authentication System Setup

This guide will help you set up the complete authentication system with frontend and backend integration.

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud)
- npm or yarn

## Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd Backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file (.env):**
   ```bash
   # Database
   MONGODB_URI=mongodb://localhost:27017/kuchhbhi
   
   # JWT Secret
   JWT_SECRET=your-super-secret-jwt-key-here
   
   # Server Port
   PORT=3000
   ```

4. **Start the backend server:**
   ```bash
   npm start
   ```

   The backend will run on `http://localhost:3000`

## Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file (.env.local):**
   ```bash
   # Backend API URL
   NEXT_PUBLIC_API_URL=http://localhost:3000
   ```

4. **Start the frontend development server:**
   ```bash
   npm run dev
   ```

   The frontend will run on `http://localhost:3001`

## API Endpoints

The backend provides the following authentication endpoints:

- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user (protected)
- `POST /api/auth/logout` - User logout (protected)

## Features

### Frontend Features:
- ✅ Modern landing page with login/signup buttons
- ✅ User registration with comprehensive form
- ✅ User login with validation
- ✅ Protected user dashboard
- ✅ Logout functionality
- ✅ Responsive design
- ✅ Form validation and error handling
- ✅ Success messages and redirects

### Backend Features:
- ✅ User registration with password hashing
- ✅ JWT token authentication
- ✅ User login with credential validation
- ✅ Protected routes with middleware
- ✅ User profile management
- ✅ MongoDB database integration
- ✅ Input validation and error handling

## User Flow

1. **Landing Page** (`/`) - Users see login and signup options
2. **Signup** (`/auth/signup`) - New users create accounts
3. **Login** (`/auth/login`) - Existing users sign in
4. **Dashboard** (`/user/dashboard`) - Authenticated users see their profile
5. **Logout** - Users can sign out and return to landing page

## Database Schema

The User model includes:
- `firstName` (required)
- `lastName` (required)
- `email` (required, unique)
- `password` (required, hashed)
- `dateOfBirth` (optional)
- `phoneNumber` (optional)
- `gender` (optional)
- `address` (optional)
- `bio` (optional)
- `isActive` (default: true)
- `lastLoginAt` (auto-updated)
- `createdAt` (auto-generated)
- `updatedAt` (auto-updated)

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Protected routes with middleware
- Input validation and sanitization
- CORS configuration
- Environment variable management

## Testing the System

1. **Start both servers** (backend on port 3000, frontend on port 3001)
2. **Visit** `http://localhost:3001`
3. **Create a new account** using the signup form
4. **Login** with your credentials
5. **Explore the dashboard** and logout functionality

## Troubleshooting

### Common Issues:

1. **Backend not connecting to MongoDB:**
   - Check if MongoDB is running
   - Verify MONGODB_URI in .env file

2. **Frontend can't connect to backend:**
   - Ensure backend is running on port 3000
   - Check NEXT_PUBLIC_API_URL in .env.local

3. **JWT errors:**
   - Verify JWT_SECRET is set in backend .env
   - Check token storage in localStorage

4. **CORS errors:**
   - Backend has CORS enabled for development
   - Check if frontend URL is allowed

## Production Deployment

For production deployment:

1. **Backend:**
   - Set up MongoDB Atlas or production database
   - Use strong JWT_SECRET
   - Configure CORS for production domain
   - Set up environment variables

2. **Frontend:**
   - Update NEXT_PUBLIC_API_URL to production backend URL
   - Build and deploy to Vercel, Netlify, or your preferred platform

## File Structure

```
kuchhbhi/
├── Backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js
│   │   ├── controllers/
│   │   │   └── authController.js
│   │   ├── middleware/
│   │   │   └── auth.js
│   │   ├── models/
│   │   │   └── User.js
│   │   ├── routes/
│   │   │   └── auth.js
│   │   └── server.js
│   └── package.json
└── frontend/
         ├── src/
     │   ├── action/
     │   │   └── action.js
     │   └── app/
     │       ├── auth/
     │       │   ├── layout.js
     │       │   ├── login/
     │       │   │   └── page.js
     │       │   └── signup/
     │       │       └── page.js
     │       ├── user/
     │       │   ├── layout.js
     │       │   └── dashboard/
     │       │       └── page.js
     │       ├── layout.js
     │       └── page.js
    └── package.json
```

## Support

If you encounter any issues:
1. Check the console for error messages
2. Verify all environment variables are set
3. Ensure both servers are running
4. Check network connectivity between frontend and backend
