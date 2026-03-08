# EXERCISER Vietnam - E-commerce & Booking System

A full-stack web application for sports equipment sales, rentals, and expert booking services. Built with Node.js, Express, Prisma ORM (Backend) and React, Redux Toolkit, Tailwind CSS (Frontend).

## 🚀 Project Overview

EXERCISER Vietnam is a comprehensive platform that enables:
- **E-commerce**: Buy sports equipment with secure payment processing
- **Rental System**: Rent sports equipment with deposit management
- **Expert Booking**: Schedule sessions with sports experts and trainers
- **User Management**: Role-based access control (Admin, Customer, Expert, Shipper)

## 📁 Project Structure

```
EXERCISERWeb/
├── backend/                    # Node.js + Express + Prisma backend
│   ├── prisma/
│   │   ├── schema.prisma      # Database schema
│   │   └── seed.js            # Database seeding
│   ├── src/
│   │   ├── config/            # Configuration files
│   │   ├── controllers/       # Request handlers
│   │   ├── middlewares/       # Custom middleware (auth, role, error)
│   │   ├── routes/            # API routes
│   │   ├── services/          # Business logic
│   │   ├── utils/             # Utility functions
│   │   └── app.js             # Application entry point
│   ├── .env.example
│   ├── package.json
│   └── README.md
│
└── frontend/                   # React + Redux + Tailwind frontend
    ├── src/
    │   ├── app/               # Redux store configuration
    │   ├── features/          # Redux slices (auth, cart)
    │   ├── components/        # React components
    │   ├── pages/             # Page components
    │   ├── services/          # RTK Query API services
    │   ├── App.jsx            # Main app with routing
    │   └── main.jsx           # Application entry
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    ├── package.json
    └── README.md
```

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: Bcrypt for password hashing
- **CORS**: Enabled for frontend integration

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **State Management**: Redux Toolkit
- **Data Fetching**: RTK Query
- **Routing**: React Router Dom v6
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios (via RTK Query)

## 📦 Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn package manager

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` file with your configuration:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/exerciser_db"
JWT_SECRET=your_secret_key
PORT=5000
CORS_ORIGIN=http://localhost:5173
```

4. Generate Prisma Client:
```bash
npm run prisma:generate
```

5. Run database migrations:
```bash
npm run prisma:migrate
```

6. Seed the database (optional):
```bash
npm run prisma:seed
```

7. Start the backend server:
```bash
npm run dev
```

Backend will be running at `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` file:
```env
VITE_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm run dev
```

Frontend will be running at `http://localhost:5173`

## 🔑 Default Credentials (After Seeding)

**Admin Account:**
- Email: `admin@exerciser.vn`
- Password: `admin123`

**Customer Account:**
- Email: `customer@example.com`
- Password: `customer123`

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (Protected)

### Product Endpoints
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (Admin only)
- `PUT /api/products/:id` - Update product (Admin only)
- `DELETE /api/products/:id` - Delete product (Admin only)

### Health Check
- `GET /api/health` - API health status

## 🗄️ Database Schema

### Core Models

**User**
- Roles: ADMIN, CUSTOMER, EXPERT, SHIPPER
- Fields: id, email, password, role, balance, name, phone, address

**Product**
- Types: SALE, RENTAL
- Fields: id, name, description, type, salePrice, rentalPrice, depositFee, category, brand

**ProductItem**
- Status: AVAILABLE, RENTING, MAINTENANCE
- Fields: id, serialNumber, status, productId

**Order**
- Status: PENDING, CONFIRMED, PROCESSING, SHIPPING, DELIVERED, CANCELLED, RETURNED
- Fields: id, userId, status, totalAmount, totalDeposit

**ExpertProfile**
- Fields: id, userId, bio, hourlyRate, isVerified, specialization

**Booking**
- Status: PENDING, CONFIRMED, COMPLETED, CANCELLED
- Fields: id, userId, expertId, bookingDate, duration, totalAmount

## 🔐 Security Features

- JWT-based authentication
- Bcrypt password hashing
- Role-based authorization middleware
- Protected API routes
- CORS configuration
- Input validation

## 🎨 Frontend Features

### State Management
- **Auth Slice**: User authentication and session management
- **Cart Slice**: Shopping cart with automatic total calculation

### Components
- Responsive layout with Header and Footer
- Protected routes based on authentication and role
- Loading states and error handling
- Reusable UI components (Button, LoadingSpinner)

### Pages
- Home page with hero section
- Product listing with filters
- Login and registration forms
- Admin dashboard (protected)
- 404 Not Found page

## 🚀 Development Scripts

### Backend
```bash
npm run dev          # Start development server with nodemon
npm start            # Start production server
npm run prisma:generate   # Generate Prisma Client
npm run prisma:migrate    # Run database migrations
npm run prisma:studio     # Open Prisma Studio GUI
npm run prisma:seed       # Seed database with sample data
```

### Frontend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## 📝 Architecture Highlights

### Backend Architecture
- **Clean Code Structure**: Separation of concerns with controllers, services, and routes
- **Middleware Pattern**: Reusable authentication and authorization middleware
- **Service Layer**: Business logic isolated in service classes
- **Error Handling**: Centralized error handling middleware

### Frontend Architecture
- **Component-Based**: Reusable React components
- **Redux Toolkit**: Simplified Redux with less boilerplate
- **RTK Query**: Automatic caching and data synchronization
- **Tailwind CSS**: Utility-first styling approach

## 🔄 Development Workflow

1. **Backend Development**: Write business logic in services, expose via controllers, define routes
2. **Frontend Development**: Create components, manage state with Redux, fetch data with RTK Query
3. **Integration**: Connect frontend to backend API endpoints
4. **Testing**: Test API endpoints and UI components
5. **Deployment**: Build and deploy to production

## 📄 License

MIT License

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For support, email support@exerciser.vn or create an issue in the repository.

---

**Note**: This is a boilerplate/starter template. Customize it according to your specific requirements before deploying to production.