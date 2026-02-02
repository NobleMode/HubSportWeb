# SportHub Vietnam - Architecture Overview

This document provides a visual overview of the system architecture, data flow, and component interactions.

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                             │
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Browser    │  │    Mobile    │  │   Desktop    │          │
│  │  (Chrome,    │  │  (Future)    │  │  (Future)    │          │
│  │  Firefox)    │  │              │  │              │          │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘          │
│         │                 │                  │                   │
│         └─────────────────┴──────────────────┘                   │
│                           │                                       │
└───────────────────────────┼───────────────────────────────────────┘
                            │ HTTP/HTTPS
                            │ Port 5173
┌───────────────────────────┼───────────────────────────────────────┐
│                           │                                       │
│                    FRONTEND LAYER                                 │
│                   (React + Redux)                                 │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │                     React Application                       │  │
│  │                                                              │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │  │
│  │  │   Pages     │  │ Components  │  │   Layouts   │        │  │
│  │  │  - Home     │  │  - Button   │  │  - Header   │        │  │
│  │  │  - Login    │  │  - Spinner  │  │  - Footer   │        │  │
│  │  │  - Products │  │  - Cards    │  │  - Main     │        │  │
│  │  │  - Admin    │  │             │  │             │        │  │
│  │  └─────────────┘  └─────────────┘  └─────────────┘        │  │
│  │                                                              │  │
│  │  ┌────────────────────────────────────────────────────┐    │  │
│  │  │            Redux Store (State Management)          │    │  │
│  │  │                                                      │    │  │
│  │  │  ┌──────────────┐  ┌──────────────┐                │    │  │
│  │  │  │  Auth Slice  │  │  Cart Slice  │                │    │  │
│  │  │  │  - user      │  │  - items     │                │    │  │
│  │  │  │  - token     │  │  - totals    │                │    │  │
│  │  │  │  - isAuth    │  │  - count     │                │    │  │
│  │  │  └──────────────┘  └──────────────┘                │    │  │
│  │  │                                                      │    │  │
│  │  │  ┌────────────────────────────────────────────┐    │    │  │
│  │  │  │       RTK Query (API Layer)                │    │    │  │
│  │  │  │  - baseApi (auto token injection)          │    │    │  │
│  │  │  │  - authApi (login, register, profile)      │    │    │  │
│  │  │  │  - productApi (CRUD operations)            │    │    │  │
│  │  │  └────────────────────────────────────────────┘    │    │  │
│  │  └────────────────────────────────────────────────────┘    │  │
│  └──────────────────────────────────────────────────────────┘  │
│                            │                                     │
└────────────────────────────┼─────────────────────────────────────┘
                             │ REST API
                             │ HTTP/HTTPS
                             │ Port 5000
┌────────────────────────────┼─────────────────────────────────────┐
│                            │                                     │
│                     BACKEND LAYER                                │
│                  (Node.js + Express)                             │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                   Express Application                     │   │
│  │                                                            │   │
│  │  ┌──────────────────── Middleware ─────────────────────┐  │   │
│  │  │  CORS → JSON Parser → Auth → Role → Error Handler   │  │   │
│  │  └──────────────────────────────────────────────────────┘  │   │
│  │                            │                               │   │
│  │  ┌──────────────────── Routes ────────────────────────┐   │   │
│  │  │  /api/auth    /api/products    /api/orders         │   │   │
│  │  └──────────────────────│────────────────────────────┘   │   │
│  │                         │                                 │   │
│  │  ┌──────────────── Controllers ──────────────────────┐   │   │
│  │  │  authController    productController              │   │   │
│  │  │  - register()      - getAllProducts()             │   │   │
│  │  │  - login()         - getProductById()             │   │   │
│  │  │  - getProfile()    - createProduct()              │   │   │
│  │  └──────────────────────│────────────────────────────┘   │   │
│  │                         │                                 │   │
│  │  ┌──────────────── Services ──────────────────────┐      │   │
│  │  │  authService       productService              │      │   │
│  │  │  - Business Logic                              │      │   │
│  │  │  - Data Validation                             │      │   │
│  │  │  - Complex Operations                          │      │   │
│  │  └──────────────────────│──────────────────────────┘     │   │
│  │                         │                                 │   │
│  └─────────────────────────┼─────────────────────────────────┘   │
│                            │                                     │
│  ┌─────────────────────────┼─────────────────────────────────┐   │
│  │               Prisma ORM (Database Layer)                 │   │
│  │                         │                                 │   │
│  │  ┌──────────── Prisma Client ────────────┐               │   │
│  │  │  - User Model                         │               │   │
│  │  │  - Product Model                      │               │   │
│  │  │  - Order Model                        │               │   │
│  │  │  - ProductItem Model                  │               │   │
│  │  │  - ExpertProfile Model                │               │   │
│  │  └───────────────────────────────────────┘               │   │
│  └───────────────────────┬─────────────────────────────────┘   │
│                          │                                     │
└──────────────────────────┼─────────────────────────────────────┘
                           │ SQL Queries
                           │ TCP/IP
┌──────────────────────────┼─────────────────────────────────────┐
│                          │                                     │
│                   DATABASE LAYER                               │
│                    (PostgreSQL)                                │
│                                                                │
│  ┌────────────────────────────────────────────────────────┐   │
│  │                 PostgreSQL Database                     │   │
│  │                                                          │   │
│  │  Tables:                                                 │   │
│  │  ├── users                                               │   │
│  │  ├── products                                            │   │
│  │  ├── product_items                                       │   │
│  │  ├── orders                                              │   │
│  │  ├── order_items                                         │   │
│  │  ├── expert_profiles                                     │   │
│  │  ├── bookings                                            │   │
│  │  ├── shipments                                           │   │
│  │  └── reviews                                             │   │
│  │                                                          │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

## 🔄 Request Flow

### Authentication Flow

```
User                    Frontend                  Backend                   Database
  │                        │                         │                         │
  │   1. Submit Login      │                         │                         │
  ├───────────────────────>│                         │                         │
  │                        │   2. POST /api/auth/login                        │
  │                        ├────────────────────────>│                         │
  │                        │                         │   3. Find User          │
  │                        │                         ├────────────────────────>│
  │                        │                         │<────────────────────────┤
  │                        │                         │   4. Verify Password    │
  │                        │                         │   5. Generate JWT       │
  │                        │<────────────────────────┤                         │
  │                        │   6. Save to Redux +    │                         │
  │                        │      localStorage       │                         │
  │   7. Redirect to Home  │                         │                         │
  │<───────────────────────┤                         │                         │
  │                        │                         │                         │
```

### Protected API Call Flow

```
Frontend                          Backend                         Database
   │                                 │                               │
   │   1. GET /api/products          │                               │
   │   Authorization: Bearer <token> │                               │
   ├────────────────────────────────>│                               │
   │                                 │   2. authMiddleware           │
   │                                 │   - Verify JWT                │
   │                                 │   - Attach user to request    │
   │                                 │                               │
   │                                 │   3. roleMiddleware           │
   │                                 │   - Check user role           │
   │                                 │                               │
   │                                 │   4. Controller               │
   │                                 │   - Handle request            │
   │                                 │                               │
   │                                 │   5. Service                  │
   │                                 │   - Business logic            │
   │                                 │                               │
   │                                 │   6. Query Database           │
   │                                 ├──────────────────────────────>│
   │                                 │<──────────────────────────────┤
   │                                 │   7. Return data              │
   │<────────────────────────────────┤                               │
   │                                 │                               │
```

### Shopping Cart Flow

```
User Action              Frontend (Redux)           Backend
     │                         │                       │
     │   Add to Cart           │                       │
     ├────────────────────────>│                       │
     │                         │  dispatch(addToCart)  │
     │                         │  - Add item to state  │
     │                         │  - Calculate totals   │
     │                         │  - Update UI          │
     │<────────────────────────┤                       │
     │   Cart Updated          │                       │
     │                         │                       │
     │   Checkout              │                       │
     ├────────────────────────>│                       │
     │                         │  POST /api/orders     │
     │                         ├──────────────────────>│
     │                         │<──────────────────────┤
     │                         │  dispatch(clearCart)  │
     │<────────────────────────┤                       │
     │   Order Confirmed       │                       │
     │                         │                       │
```

## 📊 Data Models Relationship

```
┌──────────────┐
│     User     │
│  - id        │
│  - email     │◄────────────┐
│  - password  │             │
│  - role      │             │
│  - balance   │             │
└──────┬───────┘             │
       │                     │
       │ 1:N                 │ 1:1
       │                     │
       ▼                     │
┌──────────────┐      ┌──────┴──────────┐
│    Order     │      │ ExpertProfile   │
│  - id        │      │  - id           │
│  - userId    │      │  - userId       │
│  - status    │      │  - bio          │
│  - total     │      │  - hourlyRate   │
└──────┬───────┘      │  - isVerified   │
       │              └─────────────────┘
       │ 1:N
       │
       ▼
┌──────────────┐      ┌─────────────────┐
│  OrderItem   │ N:1  │    Product      │
│  - id        │─────>│  - id           │
│  - orderId   │      │  - name         │
│  - productId │      │  - type         │
│  - quantity  │      │  - salePrice    │
│  - price     │      │  - rentalPrice  │
└──────────────┘      │  - depositFee   │
                      └────────┬────────┘
                               │
                               │ 1:N
                               │
                               ▼
                      ┌─────────────────┐
                      │  ProductItem    │
                      │  - id           │
                      │  - serialNumber │
                      │  - status       │
                      │  - productId    │
                      └─────────────────┘
```

## 🛡️ Security Architecture

```
┌────────────────────────────────────────────────────────────────┐
│                      Security Layers                            │
│                                                                  │
│  ┌─────────────── Layer 1: Transport ──────────────────┐        │
│  │  • HTTPS (Production)                               │        │
│  │  • CORS Configuration                               │        │
│  └─────────────────────────────────────────────────────┘        │
│                            │                                     │
│  ┌─────────────── Layer 2: Authentication ─────────────┐        │
│  │  • JWT Token Validation                             │        │
│  │  • Token Expiration (7 days)                        │        │
│  │  • Bcrypt Password Hashing (10 rounds)              │        │
│  └─────────────────────────────────────────────────────┘        │
│                            │                                     │
│  ┌─────────────── Layer 3: Authorization ──────────────┐        │
│  │  • Role-Based Access Control (RBAC)                 │        │
│  │  • Route-Level Permissions                          │        │
│  │  • Roles: ADMIN, CUSTOMER, EXPERT, SHIPPER          │        │
│  └─────────────────────────────────────────────────────┘        │
│                            │                                     │
│  ┌─────────────── Layer 4: Input Validation ───────────┐        │
│  │  • Request Body Validation                           │        │
│  │  • Type Checking                                     │        │
│  │  • Sanitization (Future Enhancement)                │        │
│  └─────────────────────────────────────────────────────┘        │
│                            │                                     │
│  ┌─────────────── Layer 5: Database ───────────────────┐        │
│  │  • Prisma ORM (SQL Injection Prevention)            │        │
│  │  • Parameterized Queries                            │        │
│  │  • Connection Pooling                               │        │
│  └─────────────────────────────────────────────────────┘        │
└────────────────────────────────────────────────────────────────┘
```

## 🎯 Component Communication

### Frontend State Management

```
┌────────────────────────────────────────────────────┐
│              Redux Store                            │
│                                                      │
│  ┌──────────────┐         ┌──────────────┐         │
│  │  Auth Slice  │         │  Cart Slice  │         │
│  │              │         │              │         │
│  │  Actions:    │         │  Actions:    │         │
│  │  • setCredentials      │  • addToCart │         │
│  │  • logout    │         │  • removeItem│         │
│  │  • updateUser│         │  • clearCart │         │
│  │              │         │  • calculate │         │
│  │  Selectors:  │         │              │         │
│  │  • user      │         │  Selectors:  │         │
│  │  • token     │         │  • items     │         │
│  │  • isAuth    │         │  • total     │         │
│  └──────┬───────┘         │  • count     │         │
│         │                 └──────┬───────┘         │
│         │                        │                 │
│         ▼                        ▼                 │
│  ┌─────────────────────────────────────────┐      │
│  │          RTK Query API                   │      │
│  │                                           │      │
│  │  • Automatic Caching                     │      │
│  │  • Auto Token Injection                  │      │
│  │  • Tag-based Invalidation                │      │
│  │  • Optimistic Updates                    │      │
│  └─────────────────────────────────────────┘      │
│                     │                              │
└─────────────────────┼──────────────────────────────┘
                      │
                      ▼
          ┌────────────────────┐
          │   React Components │
          │   • useSelector    │
          │   • useDispatch    │
          │   • useQuery       │
          │   • useMutation    │
          └────────────────────┘
```

## 🔌 API Endpoints Map

```
/api
├── /health (GET) ────────────── Health Check
│
├── /auth
│   ├── /register (POST) ──────── Create new user
│   ├── /login (POST) ─────────── Authenticate user
│   └── /profile (GET) ────────── Get user profile [Protected]
│
├── /products
│   ├── / (GET) ───────────────── List all products
│   ├── /:id (GET) ────────────── Get product details
│   ├── / (POST) ──────────────── Create product [Admin]
│   ├── /:id (PUT) ────────────── Update product [Admin]
│   └── /:id (DELETE) ─────────── Delete product [Admin]
│
├── /orders (Future)
│   ├── / (GET) ───────────────── List user orders
│   ├── /:id (GET) ────────────── Get order details
│   └── / (POST) ──────────────── Create new order
│
├── /bookings (Future)
│   ├── / (GET) ───────────────── List user bookings
│   ├── /:id (GET) ────────────── Get booking details
│   └── / (POST) ──────────────── Create new booking
│
└── /experts (Future)
    ├── / (GET) ───────────────── List all experts
    └── /:id (GET) ────────────── Get expert profile
```

## 🚀 Deployment Architecture (Production)

```
┌────────────────────────────────────────────────────────┐
│                   Load Balancer                         │
│                   (Nginx / AWS ELB)                     │
└────────────────┬─────────────────┬─────────────────────┘
                 │                 │
        ┌────────┴────────┐  ┌────┴────────────┐
        │   Frontend      │  │   Backend       │
        │   (Static)      │  │   (Node.js)     │
        │   Vercel/       │  │   Heroku/       │
        │   Netlify       │  │   AWS EC2       │
        └─────────────────┘  └────┬────────────┘
                                  │
                         ┌────────┴────────┐
                         │   Database      │
                         │   (PostgreSQL)  │
                         │   AWS RDS /     │
                         │   Heroku        │
                         └─────────────────┘
```

This architecture provides a scalable, maintainable, and secure foundation for the SportHub Vietnam platform! 🎯
