# SportHub Vietnam - API Examples

This document provides practical examples of API requests and responses for the SportHub Vietnam backend.

## 🔧 Base URL

```
http://localhost:5000/api
```

## 📝 API Request Examples

### 1. Authentication

#### Register New User

**Request:**
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "john.doe@example.com",
  "password": "securePassword123",
  "name": "John Doe"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "clx1a2b3c4d5e6f7g8h9i0j1",
      "email": "john.doe@example.com",
      "role": "CUSTOMER",
      "name": "John Doe",
      "balance": 0,
      "createdAt": "2024-01-17T10:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Login User

**Request:**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@sporthub.vn",
  "password": "admin123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "clx1a2b3c4d5e6f7g8h9i0j2",
      "email": "admin@sporthub.vn",
      "role": "ADMIN",
      "name": "Admin User",
      "balance": 0
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Get User Profile (Protected)

**Request:**
```http
GET /api/auth/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "clx1a2b3c4d5e6f7g8h9i0j2",
    "email": "admin@sporthub.vn",
    "role": "ADMIN",
    "name": "Admin User",
    "phone": null,
    "address": null,
    "balance": 0,
    "createdAt": "2024-01-15T08:00:00.000Z",
    "updatedAt": "2024-01-15T08:00:00.000Z"
  }
}
```

### 2. Products

#### Get All Products

**Request:**
```http
GET /api/products
```

**Response (200 OK):**
```json
{
  "success": true,
  "count": 4,
  "data": [
    {
      "id": "clx1a2b3c4d5e6f7g8h9i0j3",
      "name": "Nike Football",
      "description": "Professional quality football for training and matches",
      "type": "SALE",
      "salePrice": 500000,
      "rentalPrice": null,
      "depositFee": null,
      "category": "Football",
      "brand": "Nike",
      "imageUrl": null,
      "stock": 10,
      "isActive": true,
      "averageRating": 0,
      "availableStock": 0
    },
    {
      "id": "clx1a2b3c4d5e6f7g8h9i0j4",
      "name": "Mountain Bike",
      "description": "Professional mountain bike for rent",
      "type": "RENTAL",
      "salePrice": null,
      "rentalPrice": 200000,
      "depositFee": 5000000,
      "category": "Bicycle",
      "brand": "Giant",
      "imageUrl": null,
      "stock": 5,
      "isActive": true,
      "averageRating": 0,
      "availableStock": 3
    }
  ]
}
```

#### Get Product by ID

**Request:**
```http
GET /api/products/clx1a2b3c4d5e6f7g8h9i0j3
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "clx1a2b3c4d5e6f7g8h9i0j3",
    "name": "Nike Football",
    "description": "Professional quality football for training and matches",
    "type": "SALE",
    "salePrice": 500000,
    "rentalPrice": null,
    "depositFee": null,
    "category": "Football",
    "brand": "Nike",
    "imageUrl": null,
    "stock": 10,
    "isActive": true,
    "createdAt": "2024-01-15T08:00:00.000Z",
    "updatedAt": "2024-01-15T08:00:00.000Z",
    "productItems": [],
    "reviews": []
  }
}
```

#### Filter Products by Type

**Request:**
```http
GET /api/products?type=RENTAL
```

**Response (200 OK):**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": "clx1a2b3c4d5e6f7g8h9i0j4",
      "name": "Mountain Bike",
      "type": "RENTAL",
      "rentalPrice": 200000,
      "depositFee": 5000000
    },
    {
      "id": "clx1a2b3c4d5e6f7g8h9i0j5",
      "name": "Tennis Racket",
      "type": "RENTAL",
      "rentalPrice": 50000,
      "depositFee": 1000000
    }
  ]
}
```

#### Create Product (Admin Only)

**Request:**
```http
POST /api/products
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "name": "Basketball Hoop",
  "description": "Professional basketball hoop for outdoor use",
  "type": "SALE",
  "salePrice": 3000000,
  "category": "Basketball",
  "brand": "Spalding",
  "stock": 5
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "id": "clx1a2b3c4d5e6f7g8h9i0j6",
    "name": "Basketball Hoop",
    "description": "Professional basketball hoop for outdoor use",
    "type": "SALE",
    "salePrice": 3000000,
    "rentalPrice": null,
    "depositFee": null,
    "category": "Basketball",
    "brand": "Spalding",
    "imageUrl": null,
    "stock": 5,
    "isActive": true,
    "createdAt": "2024-01-17T10:45:00.000Z",
    "updatedAt": "2024-01-17T10:45:00.000Z"
  }
}
```

#### Update Product (Admin Only)

**Request:**
```http
PUT /api/products/clx1a2b3c4d5e6f7g8h9i0j6
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "salePrice": 2800000,
  "stock": 8
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Product updated successfully",
  "data": {
    "id": "clx1a2b3c4d5e6f7g8h9i0j6",
    "name": "Basketball Hoop",
    "salePrice": 2800000,
    "stock": 8,
    "updatedAt": "2024-01-17T11:00:00.000Z"
  }
}
```

#### Delete Product (Admin Only)

**Request:**
```http
DELETE /api/products/clx1a2b3c4d5e6f7g8h9i0j6
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

### 3. Health Check

**Request:**
```http
GET /api/health
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "SportHub API is running",
  "timestamp": "2024-01-17T10:30:00.000Z"
}
```

## ❌ Error Responses

### 400 Bad Request

```json
{
  "success": false,
  "message": "Email and password are required"
}
```

### 401 Unauthorized

```json
{
  "success": false,
  "message": "No token provided. Authorization denied."
}
```

### 403 Forbidden

```json
{
  "success": false,
  "message": "Access denied. Insufficient permissions.",
  "requiredRoles": ["ADMIN"],
  "userRole": "CUSTOMER"
}
```

### 404 Not Found

```json
{
  "success": false,
  "message": "Not Found - /api/invalid-endpoint"
}
```

### 500 Internal Server Error

```json
{
  "success": false,
  "message": "Internal Server Error",
  "stack": "Error: ... (only in development mode)"
}
```

## 🔐 Authentication Flow

1. **Register or Login** to get JWT token
2. **Store token** in localStorage or cookies
3. **Include token** in Authorization header for protected routes:
   ```
   Authorization: Bearer <your-jwt-token>
   ```

## 📦 Using with Frontend

### JavaScript Fetch Example

```javascript
// Login
const login = async (email, password) => {
  const response = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  
  const data = await response.json();
  
  if (data.success) {
    localStorage.setItem('token', data.data.token);
  }
  
  return data;
};

// Get products with auth
const getProducts = async () => {
  const token = localStorage.getItem('token');
  
  const response = await fetch('http://localhost:5000/api/products', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  return response.json();
};
```

### Axios Example

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Add token to all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Usage
const login = async (email, password) => {
  const { data } = await api.post('/auth/login', { email, password });
  localStorage.setItem('token', data.data.token);
  return data;
};

const getProducts = async () => {
  const { data } = await api.get('/products');
  return data;
};
```

## 🧪 Testing with cURL

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123","name":"Test User"}'

# Login and save token
TOKEN=$(curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@sporthub.vn","password":"admin123"}' \
  | jq -r '.data.token')

# Get profile with token
curl http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer $TOKEN"

# Get products
curl http://localhost:5000/api/products

# Create product (admin only)
curl -X POST http://localhost:5000/api/products \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"New Product","type":"SALE","salePrice":100000,"stock":10}'
```

## 📱 Postman Collection

You can import these examples into Postman:

1. Create a new collection named "SportHub Vietnam"
2. Add environment variables:
   - `base_url`: `http://localhost:5000/api`
   - `token`: (will be set after login)
3. Add requests from the examples above
4. Use `{{base_url}}` and `{{token}}` in your requests

## 🎯 Rate Limiting & Best Practices

- No rate limiting implemented in this boilerplate (add if needed)
- Always validate input on both client and server
- Use HTTPS in production
- Never expose JWT secrets
- Implement refresh token mechanism for production
- Add request validation middleware for complex payloads

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [JWT.io](https://jwt.io/) - Decode and verify JWT tokens
- [Postman](https://www.postman.com/) - API testing tool
