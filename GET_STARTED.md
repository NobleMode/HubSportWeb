# 🚀 Get Started with SportHub Vietnam

## Quick Navigation

👋 **New to the project?** Start here:

### 📖 Essential Reading Order

1. **[README.md](./README.md)** 
   - 📌 Start here! Main project overview
   - Tech stack, features, and quick setup

2. **[QUICK_START.md](./QUICK_START.md)**
   - ⚡ 5-step setup guide
   - Get running in 10 minutes
   - Troubleshooting tips

3. **[PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)**
   - 📂 Complete file structure
   - Understanding the codebase
   - File naming conventions

### 🔧 For Developers

4. **[API_EXAMPLES.md](./API_EXAMPLES.md)**
   - 🌐 API request/response examples
   - cURL commands
   - Integration examples

5. **[ARCHITECTURE.md](./ARCHITECTURE.md)**
   - 🏗️ System architecture
   - Data flow diagrams
   - Component relationships

### 📚 Reference Guides

6. **[PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)**
   - ✨ Feature overview
   - Extension points
   - Production checklist

7. **[backend/README.md](./backend/README.md)**
   - 🔙 Backend-specific documentation
   - API endpoints details
   - Database models

8. **[frontend/README.md](./frontend/README.md)**
   - 🎨 Frontend-specific documentation
   - Redux structure
   - Component guide

## ⚡ Quick Start (Copy & Paste)

### Terminal 1 - Backend
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your database credentials
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

### Terminal 2 - Frontend
```bash
cd frontend
npm install
npm run dev
```

### Access the App
- 🌐 Frontend: http://localhost:5173
- 🔧 Backend API: http://localhost:5000
- 👤 Login: admin@sporthub.vn / admin123

## 🎯 Choose Your Path

### 🏃‍♂️ I want to start coding immediately
→ Follow **QUICK_START.md** (5 steps)

### 📖 I want to understand the architecture first
→ Read **ARCHITECTURE.md** then **PROJECT_STRUCTURE.md**

### 🔌 I need to integrate with the API
→ Check **API_EXAMPLES.md**

### 🛠️ I'm setting up for production
→ Read **PROJECT_SUMMARY.md** → Production Checklist

### 🐛 I'm having issues
→ **QUICK_START.md** → Troubleshooting section

## 📋 Pre-flight Checklist

Before starting, ensure you have:
- ✅ Node.js v18+ installed
- ✅ PostgreSQL database running
- ✅ Git (optional)
- ✅ Code editor (VS Code recommended)

## 🎓 Learning Path

### Beginner
1. Read README.md
2. Follow QUICK_START.md
3. Explore the running app
4. Read PROJECT_STRUCTURE.md
5. Make small changes

### Intermediate
1. Read ARCHITECTURE.md
2. Study backend/README.md
3. Study frontend/README.md
4. Review API_EXAMPLES.md
5. Add new features

### Advanced
1. Review entire codebase
2. Read PROJECT_SUMMARY.md
3. Plan extensions
4. Implement advanced features
5. Prepare for production

## 🆘 Getting Help

**Issue?** Check these in order:
1. QUICK_START.md → Troubleshooting
2. Error message in terminal
3. Browser console (F12)
4. Check .env configuration
5. Verify database connection

## 🎨 What You'll Build

This boilerplate provides:
- ✅ User authentication & authorization
- ✅ Product catalog (buy/rent)
- ✅ Shopping cart
- ✅ Admin dashboard
- ✅ Expert booking system (schema ready)
- ✅ Order management (schema ready)

## 🚀 Next Steps After Setup

1. ✅ Login with default credentials
2. ✅ Browse products page
3. ✅ Add items to cart
4. ✅ Access admin dashboard
5. ✅ Check API with Postman
6. ✅ Start building your features!

## 📞 Support & Community

- 📝 Documentation: All .md files in root
- 🐛 Issues: GitHub Issues
- 💬 Discussions: GitHub Discussions
- 📧 Email: support@sporthub.vn

## 🎉 You're Ready!

Choose your path above and start building! 

**Happy Coding!** 🚀👨‍💻👩‍💻

---

*Last Updated: January 2024*
*Version: 1.0.0*
*License: MIT*
