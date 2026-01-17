# SportHub Vietnam Frontend

Frontend application for SportHub Vietnam E-commerce & Booking System built with React, Redux Toolkit, and Tailwind CSS.

## Tech Stack

- **Framework**: React 18 (with Vite)
- **State Management**: Redux Toolkit
- **Data Fetching**: RTK Query
- **Routing**: React Router Dom v6
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios (via RTK Query)

## Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   └── store.js              # Redux store configuration
│   ├── features/
│   │   ├── auth/
│   │   │   └── authSlice.js      # Authentication state management
│   │   ├── cart/
│   │   │   └── cartSlice.js      # Shopping cart state management
│   │   └── products/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.jsx        # Reusable button component
│   │   │   └── LoadingSpinner.jsx # Loading spinner component
│   │   └── layout/
│   │       ├── Header.jsx        # Header navigation
│   │       ├── Footer.jsx        # Footer component
│   │       └── MainLayout.jsx    # Main layout wrapper
│   ├── pages/
│   │   ├── HomePage.jsx          # Landing page
│   │   ├── LoginPage.jsx         # Login page
│   │   ├── RegisterPage.jsx      # Registration page
│   │   ├── ProductsPage.jsx      # Products listing
│   │   ├── AdminPage.jsx         # Admin dashboard (protected)
│   │   └── NotFoundPage.jsx      # 404 page
│   ├── services/
│   │   ├── baseApi.js            # RTK Query base API configuration
│   │   ├── authApi.js            # Auth API endpoints
│   │   └── productApi.js         # Product API endpoints
│   ├── utils/
│   ├── App.jsx                   # Main App component with routing
│   ├── main.jsx                  # Application entry point
│   └── index.css                 # Global styles with Tailwind
├── index.html
├── vite.config.js                # Vite configuration
├── tailwind.config.js            # Tailwind CSS configuration
├── postcss.config.js             # PostCSS configuration
├── .env.example                  # Environment variables template
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

Edit `.env` file:
```env
VITE_API_URL=http://localhost:5000/api
```

## Running the Application

### Development Mode
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Production Build
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## Redux Store Structure

### Auth Slice
Manages user authentication state:
- `user`: Current user object
- `token`: JWT authentication token
- `isAuthenticated`: Boolean flag
- `loading`: Loading state
- `error`: Error messages

**Actions:**
- `setCredentials`: Set user and token after login/register
- `logout`: Clear authentication state
- `updateUser`: Update user information

### Cart Slice
Manages shopping cart with automatic calculations:
- `items`: Array of cart items
- `totalAmount`: Auto-calculated total price
- `totalDeposit`: Auto-calculated total deposit (for rentals)
- `itemCount`: Total number of items

**Actions:**
- `addToCart`: Add item to cart
- `removeFromCart`: Remove item from cart
- `updateQuantity`: Update item quantity
- `clearCart`: Clear all items
- `calculateTotals`: Auto-calculate totals (internal)

## RTK Query API

### Base API Configuration
Located in `services/baseApi.js`:
- Automatic JWT token injection in headers
- Base URL configuration
- Tag-based cache invalidation

### Auth API
Located in `services/authApi.js`:
- `useLoginMutation`: Login user
- `useRegisterMutation`: Register new user
- `useGetProfileQuery`: Fetch user profile

### Product API
Located in `services/productApi.js`:
- `useGetProductsQuery`: Fetch all products
- `useGetProductByIdQuery`: Fetch single product
- `useCreateProductMutation`: Create product (Admin)
- `useUpdateProductMutation`: Update product (Admin)
- `useDeleteProductMutation`: Delete product (Admin)

## Routing

The application uses React Router v6 with the following routes:

### Public Routes
- `/` - Home page
- `/login` - Login page
- `/register` - Registration page
- `/products` - Products listing

### Protected Routes
- `/admin` - Admin dashboard (requires ADMIN role)

### Protected Route Implementation
```jsx
<ProtectedRoute requiredRole="ADMIN">
  <AdminPage />
</ProtectedRoute>
```

## Components

### Layout Components
- **Header**: Navigation bar with auth status and cart
- **Footer**: Site footer with links and info
- **MainLayout**: Wrapper for all pages

### Common Components
- **Button**: Reusable button with variants (primary, secondary, danger, success)
- **LoadingSpinner**: Loading indicator with size options

## Styling with Tailwind CSS

### Custom Theme
Custom primary color palette defined in `tailwind.config.js`

### Custom Utility Classes
Defined in `index.css`:
- `.btn-primary`: Primary button style
- `.btn-secondary`: Secondary button style
- `.input-field`: Form input style
- `.card`: Card container style

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | http://localhost:5000/api |

## Features

### Authentication
- User registration and login
- JWT token management
- Automatic token injection in API calls
- Protected routes based on authentication and role

### Shopping Cart
- Add products to cart (buy or rent)
- Automatic calculation of totals
- Separate handling for sale and rental items
- Deposit fee calculation for rentals

### Product Management
- Browse all products
- Filter by type (SALE/RENTAL)
- View product details
- Admin can create/update/delete products

## Development Notes

- All API calls are made through RTK Query for automatic caching and state management
- Authentication token is stored in localStorage and Redux store
- Protected routes automatically redirect to login if not authenticated
- Role-based access control for admin routes
- Cart state persists in Redux store during session

## Integration with Backend

The frontend expects the backend API to be running at the URL specified in `VITE_API_URL`.

### API Response Format
All API responses should follow this format:
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Authentication Headers
JWT token is automatically added to all requests:
```
Authorization: Bearer <token>
```
