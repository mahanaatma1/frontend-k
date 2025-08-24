# KuchhBhi - Authentication System

A modern Next.js application with a complete authentication system including landing page, login, signup, and user dashboard.

## Features

- 🏠 **Landing Page** - Beautiful homepage with login and signup buttons
- 🔐 **Authentication** - Login and signup functionality
- 👤 **User Dashboard** - Protected dashboard with user information
- 🚪 **Logout** - Secure logout functionality
- 📱 **Responsive Design** - Works on all devices
- 🎨 **Modern UI** - Clean and professional design with Tailwind CSS

## Project Structure

```
frontend/src/app/
├── page.js                 # Landing page
├── auth/
│   ├── layout.js          # Auth pages layout
│   ├── login/page.js      # Login page
│   └── signup/page.js     # Signup page
├── user/
│   ├── layout.js          # User pages layout with logout
│   └── dashboard/page.js  # User dashboard
└── api/auth/
    ├── login/route.js     # Login API
    ├── signup/route.js    # Signup API
    ├── logout/route.js    # Logout API
    └── me/route.js        # Get current user API
```

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Demo Credentials

For testing the login functionality, use these demo credentials:
- **Email:** demo@example.com
- **Password:** password123

## Pages

### Landing Page (`/`)
- Modern design with hero section
- Login and signup buttons
- Feature highlights
- Call-to-action sections

### Login Page (`/auth/login`)
- Email and password form
- Form validation
- Error handling
- Success messages from signup

### Signup Page (`/auth/signup`)
- Name, email, and password form
- Password confirmation
- Form validation
- Redirects to login after successful signup

### User Dashboard (`/user/dashboard`)
- Protected route (requires authentication)
- User information display
- Account statistics
- Quick action buttons
- Logout functionality

## API Endpoints

- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user info

## Technologies Used

- **Next.js 14** - React framework
- **Tailwind CSS** - Styling
- **React Hooks** - State management
- **Next.js App Router** - File-based routing
- **Next.js API Routes** - Backend API

## Security Features

- Form validation
- Password confirmation
- Session management with cookies
- Protected routes
- Secure logout

## Customization

You can easily customize:
- Colors and styling in Tailwind classes
- Form validation rules
- API endpoints
- User dashboard content
- Landing page content

## Production Deployment

For production deployment:
1. Set up proper environment variables
2. Configure a real database
3. Implement proper JWT authentication
4. Set up HTTPS
5. Configure proper session management

## Contributing

Feel free to contribute to this project by:
- Adding new features
- Improving the UI/UX
- Fixing bugs
- Adding tests
- Improving documentation
