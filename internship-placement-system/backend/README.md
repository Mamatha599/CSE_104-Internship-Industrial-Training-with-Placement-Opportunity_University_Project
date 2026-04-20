# Backend - Internship & Placement Management System

Node.js/Express backend with MongoDB for the internship and placement management system.

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB
- npm or yarn

### Installation
```bash
npm install
cp .env.example .env
# Configure your .env file
npm run dev
```

## 📁 Project Structure

```
src/
├── config/          # Configuration files
├── modules/         # Feature modules (auth, student, etc.)
├── middlewares/     # Express middlewares
├── utils/           # Utility functions
├── routes/          # Route definitions
├── app.js          # Express app setup
└── server.js       # Server entry point
```

## 🔧 Environment Variables

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/internship_placement_db
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile

### Students
- `GET /api/students/profile` - Get student profile
- `PUT /api/students/profile` - Update student profile
- `POST /api/students/applications/:id` - Apply for opportunity

### Opportunities
- `GET /api/opportunities` - List opportunities
- `POST /api/opportunities` - Create opportunity
- `GET /api/opportunities/:id` - Get opportunity details

## 🛠️ Development

```bash
npm run dev     # Start development server
npm start       # Start production server
```

## 📦 Dependencies

- **express** - Web framework
- **mongoose** - MongoDB ODM
- **jsonwebtoken** - JWT authentication
- **bcrypt** - Password hashing
- **cors** - Cross-origin resource sharing
- **dotenv** - Environment variables