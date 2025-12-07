# Authentication Setup Guide

This guide will help you set up the BetterAuth authentication system for the Physical AI & Humanoid Robotics Textbook.

## Overview

The application now includes a complete authentication system with:

- **Sign Up** with custom user profile data collection
- **Sign In** functionality
- **User Profile** page with editable personalization settings
- **Sign Out** capability
- Conditional UI rendering based on authentication state

## Architecture

### Backend (Node.js/Express + BetterAuth)
- **Location**: `server/` directory
- **Auth Configuration**: `server/auth.ts`
- **Main Server**: `server/index.ts`
- **Database**: PostgreSQL (Neon recommended)

### Frontend (React/Docusaurus)
- **Auth Client**: `src/lib/auth-client.ts`
- **Components**: `src/components/`
  - `AuthModal.tsx` - Sign In/Sign Up modal
  - `AuthButtons.tsx` - Header/Footer auth buttons
- **Pages**: `src/pages/profile.tsx`
- **Theme Overrides**:
  - `src/theme/Navbar/Content/` - Navbar with auth buttons
  - `src/theme/Footer/` - Footer with auth links

## Setup Instructions

### 1. Database Setup

You need a PostgreSQL database. We recommend using [Neon](https://neon.tech) for free PostgreSQL hosting.

#### Option A: Neon (Recommended)
1. Go to [neon.tech](https://neon.tech) and create a free account
2. Create a new project
3. Copy the connection string (looks like: `postgresql://user:password@host.region.neon.tech/dbname`)

#### Option B: Local PostgreSQL
```bash
# Install PostgreSQL locally
# Create a database
createdb physical_ai_textbook
```

### 2. Environment Configuration

Update the `.env` file in the project root:

```env
# Required: Your Neon/PostgreSQL connection string
DATABASE_URL=postgresql://user:password@host.region.neon.tech/dbname

# Required: Generate a random secret for BetterAuth
# You can generate one with: openssl rand -base64 32
BETTER_AUTH_SECRET=your-random-secret-here

# Required: Backend URL (change in production)
BETTER_AUTH_URL=http://localhost:8000

# Required: Frontend URL (change in production)
FRONTEND_URL=http://localhost:3000
```

**Important**: Replace `DATABASE_URL` with your actual database connection string!

### 3. Initialize Database

Run the database initialization script to verify your connection:

```bash
npm run server:init-db
```

Or manually:
```bash
npx tsx server/scripts/init-db.ts
```

This script will:
- Test the database connection
- Confirm BetterAuth can connect
- Inform you that tables will be created automatically

**Note**: BetterAuth will automatically create the required tables (`user`, `session`, `account`, `verification`) when the server starts and the first authentication request is made.

### 4. Start the Development Environment

You have two options:

#### Option A: Start Both Frontend and Backend Together
```bash
npm run dev
```

This will start:
- Backend server on `http://localhost:8000`
- Frontend on `http://localhost:3000`

#### Option B: Start Separately
```bash
# Terminal 1: Start backend
npm run server

# Terminal 2: Start frontend
npm start
```

### 5. Verify Setup

1. **Open the app**: Navigate to `http://localhost:3000`
2. **Check the navbar**: You should see "Sign In" and "Sign Up" buttons
3. **Check the footer**: You should see "Account Login" and "Sign Up Now" links
4. **Test Sign Up**:
   - Click "Sign Up"
   - Fill in name, email, and password
   - Click "Continue"
   - Fill in personalization questions
   - Click "Complete Sign Up"
5. **Verify authenticated state**:
   - Navbar should now show your profile icon and "Sign Out"
   - Footer should also show profile icon and "Sign Out"
6. **Test Profile Page**:
   - Click your profile icon
   - View and edit your personalization settings
7. **Test Sign Out**:
   - Click "Sign Out"
   - Verify you're back to unauthenticated state

## Custom User Profile Fields

The authentication system collects two custom fields during sign-up:

1. **Programming Language / Technical Background**
   - Options: Python, JavaScript, C++, Java, Rust, Go, Graphic Design, Project Management, Other

2. **Development Environment / Hardware**
   - Options: VS Code (Windows/Mac/Linux), Mac with Xcode, Linux Terminal, JetBrains IDEs, Vim/Neovim, Other

These fields are stored in the user profile and can be used to personalize content across the site.

## API Endpoints

### Authentication Endpoints (BetterAuth)
All under `/api/auth/*`:
- `POST /api/auth/sign-up/email` - Sign up with email/password
- `POST /api/auth/sign-in/email` - Sign in with email/password
- `POST /api/auth/sign-out` - Sign out
- `GET /api/auth/session` - Get current session

### User Profile Endpoints
- `GET /api/user/profile` - Get user profile (authenticated)
- `PATCH /api/user/profile` - Update user profile (authenticated)

### Other Endpoints
- `GET /` - API info
- `GET /v1/health` - Health check
- `POST /v1/query` - RAG query (placeholder)
- `GET /v1/sections` - List sections (placeholder)

## Troubleshooting

### Database Connection Errors
```
Error: connect ECONNREFUSED
```
**Solution**: Check your `DATABASE_URL` in `.env` is correct.

### BetterAuth Secret Error
```
Error: BETTER_AUTH_SECRET is required
```
**Solution**: Set `BETTER_AUTH_SECRET` in `.env` to a random string.

### CORS Errors
```
Access-Control-Allow-Origin error
```
**Solution**: Ensure `FRONTEND_URL` in `.env` matches your frontend URL.

### Tables Not Created
If you get authentication errors about missing tables:
1. Make sure the server has started at least once
2. Try creating a test account - BetterAuth creates tables on first use
3. Check database logs for permission errors

## Production Deployment

### Environment Variables
Update these for production:

```env
# Production database
DATABASE_URL=your-production-postgres-url

# Strong random secret (generate with: openssl rand -base64 32)
BETTER_AUTH_SECRET=your-production-secret

# Your production URLs
BETTER_AUTH_URL=https://api.yourdomain.com
FRONTEND_URL=https://yourdomain.com

# Optional: Enable email verification
# BETTER_AUTH_EMAIL_VERIFICATION=true
# Add email provider credentials
```

### Email Verification (Optional)
For production, you may want to enable email verification:

1. Set `requireEmailVerification: true` in `server/auth.ts`
2. Configure an email provider (SendGrid, Resend, etc.)
3. Add email provider credentials to `.env`

## Security Considerations

1. **Always use HTTPS in production**
2. **Use a strong, random `BETTER_AUTH_SECRET`**
3. **Enable email verification for production**
4. **Implement rate limiting** on authentication endpoints
5. **Use environment variables** - never commit secrets to git

## Next Steps

- Implement RAG query functionality with user context
- Add personalized content based on user profile
- Set up email verification for production
- Add OAuth providers (Google, GitHub, etc.)
- Implement role-based access control (if needed)

## Support

For issues or questions:
- Check the [BetterAuth documentation](https://better-auth.com)
- Review the codebase comments
- Open a GitHub issue
