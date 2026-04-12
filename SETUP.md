# Medium-like Blog App - Setup & Deployment Guide

## Overview
This is a full-stack blog application similar to Medium, built with:
- **Backend**: NestJS + MongoDB + Passport.js
- **Frontend**: Angular 13 + Angular Material
- **Features**: 
  - User authentication (email/password, Google, Facebook OAuth)
  - Article management (draft, published, archive)
  - Rich text editor with images and formatting
  - User roles (superadmin, normal user)
  - Responsive design

## Prerequisites
- Node.js 14+ & npm
- MongoDB (local or cloud - we'll use MongoDB Atlas)
- Google OAuth credentials
- Facebook OAuth credentials

## Backend Setup

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment Variables

#### Development (.env.development)
```env
# Server
PORT=3000
DB_USER=admin
DB_PWD=azerty123
DB_URI=ds363038.mlab.com:63038
DB_NAME=nestjsapp
JWT_SECRET=user2020
EXPIRES_IN=3600
WEB_APP_URI=localhost:3000

# OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback

FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret
FACEBOOK_CALLBACK_URL=http://localhost:3000/auth/facebook/callback

FRONTEND_URL=http://localhost:4200
```

**How to get OAuth Credentials:**

**Google OAuth:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials (Web application)
5. Add `http://localhost:3000/auth/google/callback` to authorized redirect URIs
6. Copy Client ID and Client Secret

**Facebook OAuth:**
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app
3. Add Facebook Login product
4. In Facebook Login settings, add `http://localhost:3000/auth/facebook/callback` to Valid OAuth Redirect URIs
5. Copy App ID and App Secret

### 3. Set MongoDB Connection

**Option A: Local MongoDB**
```bash
# Install MongoDB Community Edition
# Then start the service
mongod
```

**Option B: MongoDB Atlas (Cloud)**
1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/dbname`
4. Update DB_URI in .env files

### 4. Start Backend
```bash
# Development with hot reload
npm run start:dev

# Production
npm run build
npm run start:prod
```

Backend will be available at `http://localhost:3000`

## Frontend Setup

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Configure Environment

Update [src/environments/environment.ts](frontend/src/environments/environment.ts):
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api/'
};
```

For production ([src/environments/environment.prod.ts](frontend/src/environments/environment.prod.ts)):
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://your-backend-domain.com/api/'
};
```

### 3. Start Frontend
```bash
# Development server
npm start

# Production build
npm run build

# Build for production
ng build --prod
```

Frontend will be available at `http://localhost:4200`

## API Endpoints

### Authentication
- `POST /auth/signUp` - Register with email/password
- `POST /auth/signIn` - Login with email/password
- `GET /auth/google` - Google OAuth login
- `GET /auth/google/callback` - Google OAuth callback
- `GET /auth/facebook` - Facebook OAuth login
- `GET /auth/facebook/callback` - Facebook OAuth callback
- `GET /auth/verify/:token` - Verify email

### Articles
- `POST /articles` - Create article
- `GET /articles/published` - Get all published articles
- `GET /articles/user/me` - Get user's articles
- `GET /articles/search/:query` - Search articles
- `GET /articles/:id` - Get article by ID
- `PUT /articles/:id` - Update article
- `PUT /articles/:id/archive` - Archive article
- `PUT /articles/:id/unarchive` - Unarchive article
- `DELETE /articles/:id` - Delete article permanently

## User Features

### User (Normal User)
- ✅ Create account with email/password
- ✅ Social login with Google/Facebook
- ✅ Create and edit articles
- ✅ Save articles as draft
- ✅ Publish articles
- ✅ Archive articles (hidden from public)
- ✅ Delete articles
- ✅ View and manage own articles
- ✅ View published articles
- ✅ Rich text editor with formatting

### Superadmin
- ✅ All user permissions
- ✅ Manage user roles (future)
- ✅ View all articles (future)
- ✅ System administration (future)

## Article States
- **Draft**: Article saved but not visible to public
- **Published**: Article visible to all users
- **Archived**: Article hidden from public but not deleted

## Frontend Pages

### Public Pages
- `/` - Home (published articles feed)
- `/article/:id` - View article
- `/auth` - Login/Register
- `/auth/callback` - OAuth callback handler

### Authenticated User Pages
- `/user-dashboard` - User dashboard
- `/user-dashboard/articles` - My articles list
- `/user-dashboard/articles/new` - Create new article
- `/user-dashboard/articles/:id/edit` - Edit article
- `/profile` - User profile

### Admin Pages
- `/admin-dashboard` - Admin dashboard (future enhancements)

## Database Schema

### User
```javascript
{
  _id: ObjectId,
  firstname: String,
  lastname: String,
  email: String (unique),
  password: String (hashed),
  role: 'user' | 'superadmin',
  profileImage: String,
  bio: String,
  googleId: String,
  facebookId: String,
  emailVerified: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Article
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  content: String,
  chapters: [{
    id: String,
    title: String,
    content: String,
    order: Number
  }],
  status: 'draft' | 'published',
  archived: Boolean,
  userId: ObjectId (ref: User),
  author: ObjectId (ref: User),
  authorName: String,
  coverImage: String,
  tags: [String],
  likes: Number,
  views: Number,
  datePublished: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## Deployment

### Backend Deployment (Heroku)
```bash
# Create Heroku app
heroku create your-blog-api

# Set environment variables
heroku config:set PORT=3000
heroku config:set DB_URI=your_mongodb_uri
heroku config:set JWT_SECRET=your_jwt_secret
# ... set other env vars

# Deploy
git push heroku master
```

### Frontend Deployment (Netlify/Vercel)
```bash
# Build production
ng build --prod

# Deploy dist/articles to Netlify or Vercel
```

## Development Workflow

### Adding New Features

**1. Backend**
- Create new service in appropriate module
- Add controller endpoints
- Add DTOs for validation
- Update models/schemas

**2. Frontend**
- Create components/services
- Update models/interfaces
- Add routing
- Style with Angular Material

### Code Structure
- **Backend**: `src/` contains modules (auth, articles, etc.)
- **Frontend**: `src/app/` contains modules, shared services, models

## Troubleshooting

### MongoDB Connection Issues
- Check connection string format
- Ensure MongoDB service is running
- Check firewall/network access

### OAuth Issues
- Verify callback URLs match exactly
- Check credentials in .env
- Ensure frontend URL is correctly configured

### Angular Material
- Run `npm install @angular/material @angular/cdk`
- Import MatModule in your modules

## Next Steps / Future Enhancements
- [ ] Comments on articles
- [ ] Like/unlike articles
- [ ] Follow authors
- [ ] Search and filtering
- [ ] Email notifications
- [ ] User profiles with follower counts
- [ ] Article recommendations
- [ ] Admin dashboard features
- [ ] Rate limiting and security
- [ ] Add image upload service
- [ ] Article versioning/history

## Support
For issues and questions, refer to:
- NestJS Docs: https://docs.nestjs.com
- Angular Docs: https://angular.io
- MongoDB Docs: https://docs.mongodb.com
- Passport.js: https://www.passportjs.org

---
**Happy blogging!** 📝
