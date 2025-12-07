# 🔐 Authentication Feature - Quick Start

## What's Implemented

✅ **Sign Up** with two-step flow:
   - Step 1: Name, Email, Password
   - Step 2: Programming Language & Dev Environment (personalization)

✅ **Sign In** with email/password

✅ **User Profile Page** (`/profile`)
   - View and edit personalization settings
   - Display user info
   - Sign out

✅ **Conditional UI**:
   - **Not authenticated**: "Sign Up" and "Sign In" buttons in header/footer
   - **Authenticated**: Profile icon and "Sign Out" button in header/footer

✅ **BetterAuth Integration**:
   - Node.js/Express backend
   - PostgreSQL database
   - Session management
   - Custom user metadata fields

## Quick Setup (3 Steps)

### 1. Set Up Database

Get a free PostgreSQL database from [Neon](https://neon.tech):
1. Create account at https://neon.tech
2. Create a new project
3. Copy the connection string

### 2. Configure Environment

Edit `.env` file (already created for you):

```env
# Update this line with your Neon connection string:
DATABASE_URL=postgresql://user:password@host.region.neon.tech/dbname

# Generate a random secret (or use this for testing):
BETTER_AUTH_SECRET=change-this-to-a-random-secret-in-production
```

**That's it!** The other values are already configured.

### 3. Start the Application

```bash
# Install dependencies (if you haven't)
npm install

# Test database connection
npm run server:init-db

# Start both frontend and backend
npm run dev
```

The application will start:
- Backend: http://localhost:8000
- Frontend: http://localhost:3000

## Testing the Feature

1. **Go to** http://localhost:3000
2. **Click "Sign Up"** in the navbar
3. **Fill in**:
   - Name, Email, Password
   - Click "Continue"
4. **Select**:
   - Programming language (e.g., Python)
   - Dev environment (e.g., VS Code on Windows)
   - Click "Complete Sign Up"
5. **Verify**:
   - You're now signed in
   - See your profile icon in navbar
   - Click profile icon → Edit your settings
6. **Test Sign Out** → Back to unauthenticated state

## File Structure

### Backend (Node.js/Express)
```
server/
├── auth.ts              # BetterAuth configuration
├── index.ts             # Express server with endpoints
├── tsconfig.json        # TypeScript config
└── scripts/
    └── init-db.ts       # Database initialization
```

### Frontend (React/Docusaurus)
```
src/
├── lib/
│   └── auth-client.ts                 # BetterAuth React client
├── components/
│   ├── AuthModal.tsx                  # Sign In/Up modal
│   ├── AuthModal.module.css
│   ├── AuthButtons.tsx                # Auth buttons component
│   └── AuthButtons.module.css
├── pages/
│   ├── profile.tsx                    # Profile page
│   └── profile.module.css
└── theme/                             # Docusaurus theme overrides
    ├── Navbar/Content/
    │   ├── index.tsx                  # Navbar with auth buttons
    │   └── styles.module.css
    └── Footer/
        ├── index.tsx                  # Footer with auth links
        └── styles.module.css
```

## Key Features

### Two-Step Sign Up
1. **Account Creation**: Email, password, name
2. **Personalization**: Programming language & dev environment
   - Stored in user profile
   - Can be edited later in `/profile`

### Authentication State Management
- Uses BetterAuth's `useSession()` hook
- Automatically updates UI based on auth state
- Session persists across page reloads (7-day expiry)

### User Profile
- **View Mode**: Display current settings
- **Edit Mode**: Update personalization settings
- **Sign Out**: Clear session and reload

### Navbar & Footer Integration
- **Unauthenticated**: "Sign Up" (primary) + "Sign In" (secondary)
- **Authenticated**: Profile icon (with initials) + "Sign Out"
- Responsive design for mobile

## API Endpoints

### Auth (BetterAuth - `/api/auth/*`)
- Sign up, sign in, sign out, session management
- Automatically handled by BetterAuth

### User Profile
- `GET /api/user/profile` - Get user profile
- `PATCH /api/user/profile` - Update profile

### Others (Placeholder for RAG)
- `POST /v1/query` - RAG query (not implemented yet)
- `GET /v1/sections` - List sections (not implemented yet)
- `GET /v1/health` - Health check

## Personalization Data Structure

Custom fields added to BetterAuth user model:

```typescript
{
  programmingLanguage: string  // Python, JavaScript, C++, etc.
  developmentEnvironment: string  // VS Code on Windows, Mac, etc.
}
```

These fields can be used to:
- Show language-specific code examples
- Provide platform-specific installation instructions
- Personalize learning paths

## Production Checklist

Before deploying to production:

- [ ] Update `DATABASE_URL` to production database
- [ ] Generate strong `BETTER_AUTH_SECRET` (`openssl rand -base64 32`)
- [ ] Update `BETTER_AUTH_URL` to production backend URL
- [ ] Update `FRONTEND_URL` to production frontend URL
- [ ] Enable HTTPS
- [ ] (Optional) Enable email verification
- [ ] Add rate limiting to auth endpoints
- [ ] Review CORS settings

## Troubleshooting

**Problem**: "Database connection error"
- **Solution**: Check `DATABASE_URL` in `.env`

**Problem**: "Cannot find module 'better-auth'"
- **Solution**: Run `npm install`

**Problem**: "CORS error"
- **Solution**: Ensure `FRONTEND_URL` matches your frontend

**Problem**: Tables not found
- **Solution**: Start the server once - BetterAuth auto-creates tables

## Documentation

- Full setup guide: `docs/AUTHENTICATION_SETUP.md`
- BetterAuth docs: https://better-auth.com

## Next Steps

1. ✅ **Authentication is complete!**
2. Connect RAG chatbot to use user context
3. Personalize content based on user profile
4. Add OAuth providers (Google, GitHub) if needed
5. Implement email verification for production
