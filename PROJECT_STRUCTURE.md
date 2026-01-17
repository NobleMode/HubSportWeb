# SportHub Vietnam - Complete Project Structure

## 📂 Full Directory Tree

```
HubSportWeb/
│
├── README.md                           # Main project documentation
├── .gitignore                         # Git ignore rules
│
├── backend/                            # Backend Application (Node.js + Express + Prisma)
│   ├── README.md                       # Backend documentation
│   ├── package.json                    # Backend dependencies
│   ├── .env.example                    # Environment variables template
│   ├── .gitignore                      # Backend-specific git ignore
│   │
│   ├── prisma/                         # Prisma ORM configuration
│   │   ├── schema.prisma              # Database schema definition
│   │   └── seed.js                    # Database seeding script
│   │
│   └── src/                           # Source code
│       ├── app.js                     # Application entry point
│       │
│       ├── config/                    # Configuration files
│       │   ├── config.js              # App configuration
│       │   └── database.js            # Prisma client setup
│       │
│       ├── controllers/               # Request handlers
│       │   ├── authController.js      # Authentication controller
│       │   └── productController.js   # Product controller
│       │
│       ├── middlewares/               # Custom middleware
│       │   ├── authMiddleware.js      # JWT authentication
│       │   ├── roleMiddleware.js      # Role-based authorization
│       │   └── errorMiddleware.js     # Error handling
│       │
│       ├── routes/                    # API route definitions
│       │   ├── index.js               # Main router
│       │   ├── authRoutes.js          # Auth routes
│       │   └── productRoutes.js       # Product routes
│       │
│       ├── services/                  # Business logic layer
│       │   ├── authService.js         # Authentication service
│       │   └── productService.js      # Product service
│       │
│       └── utils/                     # Utility functions
│           └── jwtUtils.js            # JWT helpers
│
└── frontend/                           # Frontend Application (React + Redux + Tailwind)
    ├── README.md                       # Frontend documentation
    ├── package.json                    # Frontend dependencies
    ├── .env.example                    # Environment variables template
    ├── .gitignore                      # Frontend-specific git ignore
    ├── index.html                      # HTML entry point
    ├── vite.config.js                  # Vite configuration
    ├── tailwind.config.js              # Tailwind CSS configuration
    ├── postcss.config.js               # PostCSS configuration
    │
    └── src/                           # Source code
        ├── main.jsx                   # Application entry point
        ├── App.jsx                    # Main App component with routing
        ├── index.css                  # Global styles
        │
        ├── app/                       # Redux store configuration
        │   └── store.js               # Redux store setup
        │
        ├── features/                  # Redux slices (feature-based)
        │   ├── auth/
        │   │   └── authSlice.js       # Authentication state
        │   ├── cart/
        │   │   └── cartSlice.js       # Shopping cart state
        │   └── products/
        │
        ├── services/                  # API services (RTK Query)
        │   ├── baseApi.js             # Base API configuration
        │   ├── authApi.js             # Auth API endpoints
        │   └── productApi.js          # Product API endpoints
        │
        ├── components/                # React components
        │   ├── common/                # Reusable components
        │   │   ├── Button.jsx
        │   │   └── LoadingSpinner.jsx
        │   └── layout/                # Layout components
        │       ├── Header.jsx
        │       ├── Footer.jsx
        │       └── MainLayout.jsx
        │
        ├── pages/                     # Page components
        │   ├── HomePage.jsx
        │   ├── LoginPage.jsx
        │   ├── RegisterPage.jsx
        │   ├── ProductsPage.jsx
        │   ├── AdminPage.jsx
        │   └── NotFoundPage.jsx
        │
        └── utils/                     # Utility functions
```

## 🔑 Key Files Description

### Backend Files

#### Configuration Files
- **`app.js`**: Express app setup, middleware configuration, route mounting, error handling
- **`config/config.js`**: Environment variables and app configuration
- **`config/database.js`**: Prisma client initialization and connection management
- **`prisma/schema.prisma`**: Database models, relations, and enums

#### Middleware
- **`authMiddleware.js`**: Verifies JWT tokens and attaches user to request
- **`roleMiddleware.js`**: Checks user roles for authorization (Admin, Expert, Customer, Shipper)
- **`errorMiddleware.js`**: Centralized error handling and 404 responses

#### Controllers
- **`authController.js`**: Handles register, login, and profile requests
- **`productController.js`**: Handles product CRUD operations

#### Services
- **`authService.js`**: Business logic for authentication (register, login, profile)
- **`productService.js`**: Business logic for product management

#### Routes
- **`routes/index.js`**: Main router that combines all route modules
- **`authRoutes.js`**: Authentication endpoints
- **`productRoutes.js`**: Product endpoints with role-based protection

### Frontend Files

#### Entry Points
- **`index.html`**: HTML template
- **`main.jsx`**: React app entry point, Redux Provider setup
- **`App.jsx`**: Main component with React Router configuration

#### Redux Store
- **`app/store.js`**: Redux store with auth slice, cart slice, and RTK Query API

#### Redux Slices
- **`features/auth/authSlice.js`**: Authentication state (user, token, isAuthenticated)
- **`features/cart/cartSlice.js`**: Shopping cart state with auto-calculation

#### RTK Query Services
- **`services/baseApi.js`**: Base API with automatic JWT token injection
- **`services/authApi.js`**: Authentication API endpoints
- **`services/productApi.js`**: Product API endpoints

#### Components
- **`components/layout/MainLayout.jsx`**: Wrapper with Header and Footer
- **`components/layout/Header.jsx`**: Navigation with auth status and cart
- **`components/layout/Footer.jsx`**: Site footer
- **`components/common/Button.jsx`**: Reusable button with variants
- **`components/common/LoadingSpinner.jsx`**: Loading indicator

#### Pages
- **`HomePage.jsx`**: Landing page with hero section
- **`LoginPage.jsx`**: User login form
- **`RegisterPage.jsx`**: User registration form
- **`ProductsPage.jsx`**: Product listing with cart functionality
- **`AdminPage.jsx`**: Admin dashboard (protected route)
- **`NotFoundPage.jsx`**: 404 error page

## 🎯 Component Hierarchy

### Backend Request Flow
```
Client Request
    ↓
Express Middleware (CORS, JSON Parser)
    ↓
Auth Middleware (if protected)
    ↓
Role Middleware (if role-restricted)
    ↓
Route Handler
    ↓
Controller
    ↓
Service (Business Logic)
    ↓
Prisma ORM
    ↓
PostgreSQL Database
    ↓
Response back to Client
```

### Frontend Component Tree
```
main.jsx (Entry)
    ↓
Provider (Redux Store)
    ↓
App.jsx (Router)
    ↓
MainLayout
    ├── Header
    ├── Page Component (Route)
    │   ├── Common Components
    │   └── Feature Components
    └── Footer
```

## 🔄 Data Flow

### Authentication Flow
1. User submits login form
2. Frontend calls `useLoginMutation` (RTK Query)
3. Backend validates credentials and returns JWT token
4. Frontend stores token in Redux store and localStorage
5. Token automatically included in subsequent API requests via `prepareHeaders`

### Shopping Cart Flow
1. User adds product to cart
2. Frontend dispatches `addToCart` action
3. Cart slice automatically calculates totals (amount + deposit)
4. Cart state updates and UI reflects changes
5. Cart badge shows item count

### Protected Route Flow
1. User tries to access protected route
2. `ProtectedRoute` component checks authentication status
3. If not authenticated → redirect to login
4. If authenticated but wrong role → redirect to home
5. If authorized → render protected component

## 📋 File Naming Conventions

### Backend
- Controllers: `camelCase` + `Controller.js` (e.g., `authController.js`)
- Services: `camelCase` + `Service.js` (e.g., `productService.js`)
- Middleware: `camelCase` + `Middleware.js` (e.g., `authMiddleware.js`)
- Routes: `camelCase` + `Routes.js` (e.g., `authRoutes.js`)

### Frontend
- Components: `PascalCase.jsx` (e.g., `HomePage.jsx`)
- Slices: `camelCase` + `Slice.js` (e.g., `authSlice.js`)
- Services: `camelCase` + `Api.js` (e.g., `authApi.js`)

## 🏗️ Architecture Patterns

### Backend Patterns
- **MVC Pattern**: Controllers handle requests, Services contain business logic
- **Middleware Pattern**: Reusable request interceptors
- **Repository Pattern**: Prisma ORM as data access layer
- **Dependency Injection**: Services injected into controllers

### Frontend Patterns
- **Container/Presentational**: Pages (containers) use common components (presentational)
- **Redux Toolkit**: Simplified Redux with slices and RTK Query
- **Compound Components**: Layout components compose smaller components
- **Custom Hooks**: Can be added for shared logic

## 📦 Package Organization

### Backend Dependencies
- **Production**: express, @prisma/client, bcrypt, jsonwebtoken, cors, dotenv
- **Development**: nodemon, prisma

### Frontend Dependencies
- **Production**: react, react-dom, react-router-dom, @reduxjs/toolkit, react-redux, axios
- **Development**: vite, @vitejs/plugin-react, tailwindcss, postcss, autoprefixer, eslint

## 🚀 Extension Points

### Backend Extensions
- Add more models to `prisma/schema.prisma`
- Create new controllers in `src/controllers/`
- Add new services in `src/services/`
- Define new routes in `src/routes/`
- Add custom middleware in `src/middlewares/`

### Frontend Extensions
- Create new slices in `src/features/`
- Add new API endpoints in `src/services/`
- Build new components in `src/components/`
- Add new pages in `src/pages/`
- Define new routes in `App.jsx`
