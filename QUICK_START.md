# SportHub Vietnam - Quick Start Guide

This guide will help you get the SportHub Vietnam application up and running in less than 10 minutes.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher) - [Download](https://nodejs.org/)
- PostgreSQL database - [Download](https://www.postgresql.org/download/)
- npm (comes with Node.js)
- Git (optional, for cloning)

## 🚀 Quick Setup (5 Steps)

### Step 1: Clone or Download the Project

```bash
# If using git
git clone <repository-url>
cd HubSportWeb

# Or download and extract the ZIP file
```

### Step 2: Setup Backend

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env file with your database credentials
# DATABASE_URL="postgresql://username:password@localhost:5432/sporthub_db"
# JWT_SECRET=your_secret_key_here

# Generate Prisma Client
npm run prisma:generate

# Create and migrate database
npm run prisma:migrate

# Seed database with sample data (optional but recommended)
npm run prisma:seed

# Start backend server
npm run dev
```

Backend is now running at `http://localhost:5000` ✅

### Step 3: Setup Frontend (New Terminal)

```bash
# Open a new terminal window
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start frontend development server
npm run dev
```

Frontend is now running at `http://localhost:5173` ✅

### Step 4: Test the Application

Open your browser and navigate to:
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000`

### Step 5: Login with Default Credentials

**Admin Account:**
- Email: `admin@sporthub.vn`
- Password: `admin123`

**Customer Account:**
- Email: `customer@example.com`
- Password: `customer123`

## 🎉 You're All Set!

Your SportHub Vietnam application is now running!

## 📝 Common Commands Reference

### Backend Commands
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start

# View database in Prisma Studio
npm run prisma:studio

# Create new migration
npm run prisma:migrate

# Reset database and reseed
npm run prisma:migrate reset
npm run prisma:seed
```

### Frontend Commands
```bash
# Development mode
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

## 🐛 Troubleshooting

### Database Connection Issues

**Problem**: Cannot connect to PostgreSQL

**Solution**:
1. Ensure PostgreSQL is running
2. Check your DATABASE_URL in `.env`
3. Create database manually: `createdb sporthub_db`

### Port Already in Use

**Problem**: Port 5000 or 5173 already in use

**Solution**:
```bash
# Change port in backend/.env
PORT=5001

# Change port in frontend/vite.config.js
server: { port: 5174 }
```

### Prisma Client Issues

**Problem**: Prisma Client not generated

**Solution**:
```bash
cd backend
npm run prisma:generate
```

### CORS Issues

**Problem**: CORS errors in browser console

**Solution**:
1. Check `CORS_ORIGIN` in backend `.env`
2. Ensure it matches your frontend URL

### Module Not Found

**Problem**: Cannot find module errors

**Solution**:
```bash
# Delete node_modules and reinstall
rm -rf node_modules
npm install
```

## 📚 Next Steps

### For Development:
1. Explore the API endpoints in `backend/src/routes/`
2. Add new components in `frontend/src/components/`
3. Create new pages in `frontend/src/pages/`
4. Add new database models in `backend/prisma/schema.prisma`

### Recommended Reading:
- [Backend README](./backend/README.md) - Detailed backend documentation
- [Frontend README](./frontend/README.md) - Detailed frontend documentation
- [Project Structure](./PROJECT_STRUCTURE.md) - Complete project structure guide

## 🔧 Development Workflow

1. **Make Changes**: Edit files in `src/` directories
2. **Test Locally**: Both servers auto-reload on file changes
3. **Check Logs**: Watch terminal output for errors
4. **Test API**: Use Postman or curl for API testing
5. **Check Database**: Use Prisma Studio to view data

## 🌐 API Testing

### Using curl:

```bash
# Health check
curl http://localhost:5000/api/health

# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123","name":"Test User"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@sporthub.vn","password":"admin123"}'

# Get products
curl http://localhost:5000/api/products
```

### Using Browser:
Open `http://localhost:5000/api/health` in your browser to check if the API is running.

## 🎯 Project Structure Quick Reference

```
HubSportWeb/
├── backend/          # Node.js + Express + Prisma
│   ├── src/          # Source code
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── services/
│   │   └── middlewares/
│   └── prisma/       # Database schema
│
└── frontend/         # React + Redux + Tailwind
    ├── src/          # Source code
    │   ├── app/      # Redux store
    │   ├── features/ # Redux slices
    │   ├── components/
    │   ├── pages/
    │   └── services/ # API calls
    └── public/       # Static assets
```

## 💡 Tips

1. **Keep Both Servers Running**: Backend and frontend should run simultaneously
2. **Check Terminal Logs**: Errors and info appear in terminal
3. **Use Prisma Studio**: Great for viewing and editing database data
4. **Browser DevTools**: Use React DevTools and Redux DevTools extensions
5. **Hot Reload**: Both servers automatically reload on code changes

## 🆘 Getting Help

If you encounter issues:
1. Check the error message in terminal
2. Review the [Troubleshooting](#-troubleshooting) section
3. Check the detailed README files
4. Search for the error message online
5. Open an issue in the repository

## ✅ Verification Checklist

- [ ] Node.js v18+ installed
- [ ] PostgreSQL running
- [ ] Backend dependencies installed (`npm install` in backend/)
- [ ] Frontend dependencies installed (`npm install` in frontend/)
- [ ] Environment files created (`.env` in both directories)
- [ ] Database migrated (`npm run prisma:migrate`)
- [ ] Database seeded (`npm run prisma:seed`)
- [ ] Backend running on port 5000
- [ ] Frontend running on port 5173
- [ ] Can access `http://localhost:5173` in browser
- [ ] Can login with default credentials

---

**Congratulations!** You're ready to start developing with SportHub Vietnam! 🎊
