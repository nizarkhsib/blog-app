# Quick Start Guide

## TL;DR - Get Started in 5 Minutes

### Prerequisites
- Node.js 14+
- MongoDB (local or MongoDB Atlas)

### 1. Install & Start Backend
```bash
cd backend
npm install
npm run start:dev
```

Backend runs at: **http://localhost:3000**

### 2. Install & Start Frontend
```bash
cd frontend
npm install
npm start
```

Frontend runs at: **http://localhost:4200**

### 3. Access the App
- **Home**: http://localhost:4200
- **Login**: http://localhost:4200/auth
- **Dashboard**: http://localhost:4200/user-dashboard (requires login)

---

## Features Demo

### Create Account
1. Go to http://localhost:4200/auth
2. Click "Register here"
3. Enter email, password, name
4. Click Register
5. You're logged in!

### Write an Article
1. Click "User Dashboard" (or navigate to /user-dashboard/articles)
2. Click "New Article"
3. Fill in title, description, content
4. Add tags (comma or Enter to separate)
5. Choose "Save as Draft" or "Publish"
6. Article created!

### View Articles
1. Go to home page (http://localhost:4200)
2. See all published articles
3. Click any article to view full content

### Manage Your Articles
1. Go to User Dashboard → My Articles
2. See all your drafts and published articles
3. Actions: Edit, View, Archive, Delete

### Social Login (Optional)
1. Get Google OAuth credentials from [Google Cloud Console](https://console.cloud.google.com/)
2. Add to `backend/.env.development`
3. Click "Google" on login page

---

## API Testing with cURL

### Register User
```bash
curl -X POST http://localhost:3000/auth/signUp \
  -H "Content-Type: application/json" \
  -d '{
    "firstname": "John",
    "lastname": "Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/auth/signIn \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Create Article
```bash
curl -X POST http://localhost:3000/articles \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My First Article",
    "description": "This is my first article",
    "content": "<p>Article content goes here...</p>",
    "status": "draft",
    "tags": ["nodejs", "mongodb"]
  }'
```

### Get Published Articles
```bash
curl http://localhost:3000/articles/published?skip=0&limit=10
```

### Get User Articles
```bash
curl http://localhost:3000/articles/user/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Publish Article
```bash
curl -X PUT http://localhost:3000/articles/ARTICLE_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "published"
  }'
```

### Archive Article
```bash
curl -X PUT http://localhost:3000/articles/ARTICLE_ID/archive \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Delete Article
```bash
curl -X DELETE http://localhost:3000/articles/ARTICLE_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## Troubleshooting

### Backend won't start
- Check MongoDB is running: `mongod`
- Check port 3000 is available
- Check .env file exists and has proper values
- Run: `npm install` again

### Frontend won't start
- Check port 4200 is available
- Run: `npm install` again
- Clear node_modules: `rm -rf node_modules && npm install`

### Can't login
- Verify user exists in database
- Check backend is running and responds
- Check browser console for errors

### OAuth not working
- Verify Google/Facebook credentials
- Check callback URLs match exactly
- Ensure .env has correct credentials

### Images not uploading
- Check uploads folder exists: `backend/uploads/`
- Check file permissions
- Check file size isn't too large

---

## Next Features to Build

Priority order for enhancements:

1. **Comments** - Users can comment on articles
2. **Likes** - Like article functionality
3. **Follow Authors** - Follow feature for users
4. **Email Notifications** - Notify on new follower articles
5. **Search** - Full-text search on articles
6. **User Profiles** - Public user profiles with bio
7. **Article Categories** - Organize articles better
8. **Reading Time** - Estimate reading time
9. **Bookmarks** - Save articles to read later
10. **Admin Dashboard** - Admin controls for content moderation

---

## File Structure Quick Reference

- **Backend config**: `backend/.env.development`
- **Frontend config**: `frontend/src/environments/environment.ts`
- **Backend main**: `backend/src/main.ts`
- **Frontend main**: `frontend/src/main.ts`
- **Backend routes**: Check controllers in `backend/src/`
- **Frontend routes**: `frontend/src/app/app-routing.module.ts`

---

## Key Files Modified/Created

### Backend
- ✅ `src/auth/user.model.ts` - Added role, OAuth fields
- ✅ `src/auth/auth.service.ts` - Added OAuth methods
- ✅ `src/auth/auth.controller.ts` - Added OAuth endpoints
- ✅ `src/auth/strategies/google.strategy.ts` - New
- ✅ `src/auth/strategies/facebook.strategy.ts` - New
- ✅ `src/auth/guards/roles.guard.ts` - New (role-based access)
- ✅ `src/articles/article.model.ts` - Added status, archived, chapters
- ✅ `src/articles/articles.service.ts` - Complete rewrite
- ✅ `src/articles/articles.controller.ts` - Complete rewrite
- ✅ `package.json` - Added OAuth packages

### Frontend
- ✅ `src/app/modules/login/login.component.html` - Added social buttons
- ✅ `src/app/modules/login/login.component.ts` - Added OAuth methods
- ✅ `src/app/modules/login/auth-callback/` - New OAuth callback
- ✅ `src/app/shared/services/authentication.service.ts` - Enhanced
- ✅ `src/app/modules/user-dashboard/add-article/` - Complete rewrite
- ✅ `src/app/modules/user-dashboard/user-articles/` - New listing component
- ✅ `src/app/shared/services/articles.service.ts` - Complete rewrite
- ✅ `src/app/shared/models/article.ts` - Enhanced interface

---

## Documentation Files
- 📄 [SETUP.md](./SETUP.md) - Complete setup instructions
- 📄 [ARCHITECTURE.md](./ARCHITECTURE.md) - System design & structure
- 📄 [QUICK_START.md](./QUICK_START.md) - This file!

---

Enjoy building your blog! 🚀
