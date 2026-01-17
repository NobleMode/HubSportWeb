# SportHub Vietnam Backend API

Backend API for SportHub Vietnam E-commerce & Booking System built with Node.js, Express, and Prisma ORM.

## Tech Stack

- **Framework**: Express.js
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: Bcrypt
- **CORS**: Enabled for frontend integration

## Project Structure

```
backend/
├── prisma/
│   ├── schema.prisma         # Database schema definition
│   └── seed.js               # Database seeding script
├── src/
│   ├── config/
│   │   ├── config.js         # Application configuration
│   │   └── database.js       # Prisma client configuration
│   ├── controllers/
│   │   ├── authController.js # Authentication controllers
│   │   └── productController.js # Product controllers
│   ├── middlewares/
│   │   ├── authMiddleware.js # JWT authentication middleware
│   │   ├── roleMiddleware.js # Role-based authorization
│   │   └── errorMiddleware.js # Error handling
│   ├── routes/
│   │   ├── index.js          # Main router
│   │   ├── authRoutes.js     # Auth routes
│   │   └── productRoutes.js  # Product routes
│   ├── services/
│   │   ├── authService.js    # Authentication business logic
│   │   └── productService.js # Product business logic
│   ├── utils/
│   │   └── jwtUtils.js       # JWT utility functions
│   └── app.js                # Application entry point
├── .env.example              # Environment variables template
├── .gitignore
└── package.json
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` file with your configuration:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/sporthub_db"
JWT_SECRET=your_secret_key
PORT=5000
CORS_ORIGIN=http://localhost:5173
```

3. Generate Prisma Client:
```bash
npm run prisma:generate
```

4. Run database migrations:
```bash
npm run prisma:migrate
```

5. Seed the database (optional):
```bash
npm run prisma:seed
```

## Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

### Prisma Studio (Database GUI)
```bash
npm run prisma:studio
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get current user profile (Protected)

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (Admin only)
- `PUT /api/products/:id` - Update product (Admin only)
- `DELETE /api/products/:id` - Delete product (Admin only)

### Health Check
- `GET /api/health` - API health check

## Database Models

### User
- Roles: ADMIN, CUSTOMER, EXPERT, SHIPPER
- Fields: id, email, password, role, balance, name, phone, address

### Product
- Types: SALE, RENTAL
- Fields: id, name, description, type, salePrice, rentalPrice, depositFee, category, brand

### ProductItem
- Status: AVAILABLE, RENTING, MAINTENANCE
- Fields: id, serialNumber, status, productId

### Order
- Status: PENDING, CONFIRMED, PROCESSING, SHIPPING, DELIVERED, CANCELLED, RETURNED
- Fields: id, userId, status, totalAmount, totalDeposit

### ExpertProfile
- Fields: id, userId, bio, hourlyRate, isVerified, specialization

### Booking
- Status: PENDING, CONFIRMED, COMPLETED, CANCELLED
- Fields: id, userId, expertId, bookingDate, duration, totalAmount

## Default Credentials (After Seeding)

**Admin Account:**
- Email: admin@sporthub.vn
- Password: admin123

**Customer Account:**
- Email: customer@example.com
- Password: customer123

## Middleware

### authMiddleware
Verifies JWT token and attaches user to request object.

### roleMiddleware
Checks user role permissions:
- `adminOnly` - Admin access only
- `expertOnly` - Expert and Admin access
- `customerOnly` - Customer and Admin access
- `shipperOnly` - Shipper and Admin access

## Development Notes

- All API responses follow a consistent format with `success`, `message`, and `data` fields
- Passwords are hashed using bcrypt before storing in database
- JWT tokens are set to expire in 7 days by default
- CORS is configured to allow requests from the frontend
- Error handling is centralized through error middleware

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 5000 |
| `NODE_ENV` | Environment mode | development |
| `DATABASE_URL` | PostgreSQL connection string | - |
| `JWT_SECRET` | JWT signing secret | - |
| `JWT_EXPIRE` | JWT expiration time | 7d |
| `CORS_ORIGIN` | Allowed CORS origin | http://localhost:5173 |
