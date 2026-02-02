# AI-Driven Internship & Placement Management System

A comprehensive web application for managing internships, industrial training, and campus placements in educational institutions.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB
- Git

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd internship-placement-system
```

2. **Backend Setup**
```bash
cd backend
npm install
cp .env.example .env
# Update .env with your configuration
npm run dev
```

3. **Frontend Setup**
```bash
cd frontend
npm install
cp .env.example .env
# Update .env with your configuration
npm run dev
```

## 📁 Project Structure

```
internship-placement-system/
├── backend/                 # Node.js/Express backend
│   ├── src/
│   │   ├── config/         # Database & environment config
│   │   ├── modules/        # Feature modules
│   │   ├── middlewares/    # Express middlewares
│   │   ├── utils/          # Utility functions
│   │   └── routes/         # Route definitions
│   └── package.json
├── frontend/               # React frontend
│   ├── src/
│   │   ├── api/           # API service functions
│   │   ├── modules/       # React components by feature
│   │   ├── context/       # React context providers
│   │   └── utils/         # Utility functions
│   └── package.json
└── docs/                  # Documentation
```

## 🎯 Features

- **Multi-role Authentication** (Student, Faculty, Placement Cell, Recruiter)
- **Student Profile Management**
- **Opportunity Posting & Management**
- **Application Tracking**
- **Faculty Approval Workflow**
- **Analytics Dashboard**
- **Resume Upload**
- **Certificate Generation**

## 🛠️ Technology Stack

- **Backend**: Node.js, Express.js, MongoDB, JWT
- **Frontend**: React.js, Vite, Axios, React Router
- **Authentication**: JWT-based with role-based access control

## 📚 API Documentation

The API follows RESTful conventions. Key endpoints:

- `POST /api/auth/login` - User authentication
- `GET /api/opportunities` - List opportunities
- `POST /api/students/applications/:id` - Apply for opportunity
- `GET /api/analytics/dashboard` - Analytics data

## 🔧 Development

### Backend Development
```bash
cd backend
npm run dev  # Starts with nodemon
```

### Frontend Development
```bash
cd frontend
npm run dev  # Starts Vite dev server
```

## 🚀 Deployment

### Backend
- Configure environment variables
- Set up MongoDB connection
- Deploy to cloud platform (Render, Railway, etc.)

### Frontend
- Build: `npm run build`
- Deploy to Vercel, Netlify, or similar

## 📝 License

MIT License - see LICENSE file for details