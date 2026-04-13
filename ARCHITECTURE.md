# Bloogy Architecture

## System Overview
```
┌─────────────┐                  ┌──────────────┐
│   Browser   │◄────────────────►│ Angular App  │
│  (Client)   │   HTTP/HTTPS     │  (Frontend)  │
└─────────────┘                  └──────────────┘
                                       │
                                  HTTP/REST
                                       │
┌─────────────────────────────────────▼──────────────────────────┐
│                     NestJS Backend API                          │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Controllers (Route handlers)                             │  │
│  │ ├─ AuthController                                        │  │
│  │ ├─ ArticlesController                                    │  │
│  │ ├─ ProfileController                                     │  │
│  │ └─ ...                                                   │  │
│  └──────────────────────────────────────────────────────────┘  │
│                           │                                     │
│  ┌────────────────────────▼─────────────────────────────────┐  │
│  │ Services (Business Logic)                                │  │
│  │ ├─ AuthService                                           │  │
│  │ ├─ ArticlesService                                       │  │
│  │ ├─ ProfileService                                        │  │
│  │ └─ ...                                                   │  │
│  └──────────────────────────────────────────────────────────┘  │
│                           │                                     │
│  ┌────────────────────────▼─────────────────────────────────┐  │
│  │ Modules (Feature organization)                           │  │
│  │ ├─ AuthModule                                            │  │
│  │ ├─ ArticlesModule                                        │  │
│  │ ├─ ProfileModule                                         │  │
│  │ └─ CoreModule                                            │  │
│  └──────────────────────────────────────────────────────────┘  │
│                           │                                     │
│  ┌────────────────────────▼─────────────────────────────────┐  │
│  │ Database Layer (Mongoose)                                │  │
│  │ ├─ UserSchema                                            │  │
│  │ ├─ ArticleSchema                                         │  │
│  │ ├─ Relationships (References)                            │  │
│  │ └─ Indexes & Validation                                  │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                           │
                        TCP/IP
                           │
        ┌──────────────────▼──────────────────┐
        │      MongoDB Atlas / Local          │
        │       Database Instance              │
        └──────────────────────────────────────┘
```

## Project Structure

### Backend (`/backend`)
```
backend/
├── src/
│   ├── main.ts                     # Application entry point
│   ├── app.module.ts               # Root module
│   ├──
│   ├── auth/
│   │   ├── auth.controller.ts      # Auth endpoints
│   │   ├── auth.service.ts         # Auth logic (login, register, OAuth)
│   │   ├── auth.module.ts          # Auth module definition
│   │   ├── user.model.ts           # User schema & interface
│   │   ├── jwt.strategy.ts         # JWT validation strategy
│   │   ├── strategies/
│   │   │   ├── google.strategy.ts  # Google OAuth strategy
│   │   │   └── facebook.strategy.ts # Facebook OAuth strategy
│   │   ├── guards/
│   │   │   └── roles.guard.ts      # Role-based access control
│   │   └── dto/
│   │       ├── auth-credentials.dto.ts
│   │       ├── register.dto.ts
│   │       └── logged-user.dto.ts
│   │
│   ├── articles/
│   │   ├── articles.controller.ts  # Article endpoints
│   │   ├── articles.service.ts     # Article CRUD operations
│   │   ├── articles.module.ts      # Articles module
│   │   ├── article.model.ts        # Article schema & interface
│   │   └── dto/
│   │       └── article.dto.ts      # Article data validation
│   │
│   ├── core/
│   │   ├── config/
│   │   │   ├── config.service.ts   # Environment config
│   │   │   └── config.module.ts
│   │   ├── filters/
│   │   │   ├── http.filter.ts      # Global error handling
│   │   │   └── fallback.filter.ts
│   │   ├── middleware/
│   │   │   ├── file-management.middleware.ts # File handling
│   │   │   └── send-email.middleware.ts      # Email service
│   │   └── services/
│   │       └── logger.service.ts   # Logging service
│   │
│   ├── profile/
│   │   ├── profile.controller.ts
│   │   ├── profile.service.ts
│   │   ├── profile.module.ts
│   │   ├── profile.model.ts
│   │   └── dto/
│   │       └── profile.dto.ts
│   │
│   ├── comments/
│   │   └── ... (similar structure)
│   │
│   └── products/ (legacy)
│       └── ... (similar structure)
│
├── .env.development         # Development environment variables
├── .env.production          # Production environment variables
├── package.json
└── tsconfig.json
```

### Frontend (`/frontend`)
```
frontend/
├── src/
│   ├── index.html           # Main HTML file
│   ├── main.ts              # Application bootstrap
│   ├── styles.scss          # Global styles
│   │
│   └── app/
│       ├── app.component.ts          # Root component
│       ├── app.module.ts              # Root module
│       ├── app-routing.module.ts      # Main routing
│       │
│       ├── modules/
│       │   ├── login/                            # Authentication module
│       │   │   ├── login/
│       │   │   │   ├── login.component.ts       # Login page
│       │   │   │   └── login.component.html
│       │   │   ├── register/
│       │   │   │   ├── register.component.ts    # Registration page
│       │   │   │   └── register.component.html
│       │   │   ├── auth-callback/
│       │   │   │   └── auth-callback.component.ts # OAuth callback
│       │   │   ├── tabs.component.ts            # Login/Register tabs
│       │   │   ├── login.module.ts
│       │   │   └── login-routing.module.ts
│       │   │
│       │   ├── home/                            # Home module
│       │   │   ├── home.component.ts            # Hero page
│       │   │   ├── home.module.ts
│       │   │   └── home-routing.module.ts
│       │   │
│       │   ├── user-dashboard/                  # User dashboard module
│       │   │   ├── add-article/
│       │   │   │   ├── add-article.component.ts # Article editor
│       │   │   │   ├── add-article.component.html
│       │   │   │   └── add-article.component.scss
│       │   │   ├── user-articles/
│       │   │   │   ├── user-articles.component.ts # Article list
│       │   │   │   ├── user-articles.component.html
│       │   │   │   └── user-articles.component.scss
│       │   │   ├── user-dashboard.component.ts
│       │   │   ├── user-dashboard.module.ts
│       │   │   └── user-dashboard-routing.module.ts
│       │   │
│       │   ├── profile/                         # Profile module
│       │   │   └── ... (user profile management)
│       │   │
│       │   ├── admin-dashboard/                 # Admin module
│       │   │   └── ... (admin features)
│       │   │
│       │   └── ...
│       │
│       ├── shared/                              # Shared utilities
│       │   ├── services/
│       │   │   ├── authentication.service.ts    # Auth logic
│       │   │   ├── articles.service.ts          # Article REST calls
│       │   │   ├── backend.service.ts           # Base HTTP service
│       │   │   └── ...
│       │   ├── models/
│       │   │   ├── article.ts                   # Article interface
│       │   │   ├── user.ts                      # User interface
│       │   │   ├── logged-user.ts
│       │   │   └── ...
│       │   ├── components/
│       │   │   ├── header/                      # Navigation header
│       │   │   ├── footer/
│       │   │   └── ...
│       │   ├── guards/
│       │   │   ├── auth.guard.ts                # Route protection
│       │   │   └── ...
│       │   ├── interceptors/
│       │   │   └── jwt.interceptor.ts           # JWT token injection
│       │   ├── helpers/
│       │   └── styles/
│       │
│       ├── environments/
│       │   ├── environment.ts                   # Dev config
│       │   └── environment.prod.ts              # Prod config
│       │
│       └── assets/                              # Images, etc.
│
└── package.json
```

## Data Flow

### User Registration Flow
```
1. User fills registration form
2. Frontend validates form
3. Frontend sends POST /auth/signUp
4. Backend creates new User (hashed password)
5. Backend creates User Profile
6. Backend returns JWT token
7. Frontend stores JWT in localStorage
8. Frontend navigates to dashboard
```

### Article Creation Flow
```
1. User clicks "New Article"
2. Frontend opens article editor
3. User fills title, description, content
4. User adds tags
5. User clicks "Publish" or "Save as Draft"
6. Frontend sends POST /articles with data
7. Backend validates and creates article
8. Backend sets status (draft/published)
9. Backend returns article with ID
10. Frontend navigates to articles list
```

### Article Discovery Flow
```
1. User visits home page
2. Frontend fetches GET /articles/published
3. Backend returns published articles (not archived)
4. Frontend renders article cards
5. User clicks article
6. Frontend fetches GET /articles/:id
7. Backend increments view count
8. Frontend displays full article
```

### OAuth Flow
```
1. User clicks "Login with Google"
2. Frontend redirects to GET /auth/google
3. Backend redirects to Google OAuth
4. User authenticates with Google
5. Google redirects to /auth/google/callback
6. Backend validates Google token
7. Backend finds or creates User with googleId
8. Backend generates JWT token
9. Backend redirects to frontend with token
10. Frontend handles token in callback component
11. Frontend stores token and navigates to dashboard
```

## Key Features Implementation

### Authentication
- Local login/registration with password hashing (bcrypt)
- JWT token-based authentication
- Google OAuth 2.0 integration
- Facebook OAuth integration
- Email verification (framework present)

### Article Management
- Create, Read, Update, Delete (CRUD)
- Draft/Published status
- Archive (soft delete)
- Rich text editor (ngx-editor)
- Tags/Categories
- Author information
- View tracking
- Date tracking (created, updated, published)

### Authorization
- JWT guards for protected routes
- Role-based access control (user, superadmin)
- Resource ownership validation (can only edit own articles)

### Responsive Design
- Angular Material components
- Mobile-friendly layout
- Flexbox layouts
- Breakpoints for tablets/mobiles

## Technologies Used

### Backend
- **NestJS**: Progressive Node.js framework
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB ODM
- **Passport.js**: Authentication middleware
- **JWT**: Token-based authentication
- **bcryptjs**: Password hashing
- **Swagger**: API documentation

### Frontend
- **Angular 13**: Frontend framework
- **TypeScript**: Type-safe JavaScript
- **Angular Material**: UI component library
- **ngx-editor**: Rich text editor
- **ngx-dropzone**: File upload handling
- **RxJS**: Reactive programming
- **Bootstrap**: Additional styling

## Security Considerations
- Passwords hashed with bcrypt
- JWT tokens with expiration
- Environment variables for secrets
- CORS configuration needed
- Input validation with class-validator
- Protected API routes with JWT guards
- SQL injection protection via Mongoose
- XSS prevention through Angular sanitization

## Scalability Considerations
- Separation of concerns (modules)
- Service-based architecture
- Database indexing
- Pagination support
- Caching (can be added)
- CDN for images (future)
- Database replication (MongoDB Atlas)
- Load balancing (deployment)

## Performance Optimizations
- JWT for stateless auth (no sessions)
- Pagination for article lists
- Lazy loading of modules (frontend)
- Material design for fast UX
- API response filtering
- Indexes on frequently queried fields

---
**Last Updated**: 2026-04-12
