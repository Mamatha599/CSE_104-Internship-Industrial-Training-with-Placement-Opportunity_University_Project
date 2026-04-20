# Frontend - Internship & Placement Management System

React.js frontend application for the internship and placement management system.

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
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
├── api/             # API service functions
├── modules/         # React components by feature
├── context/         # React context providers
├── routes/          # Route definitions
├── utils/           # Utility functions
├── App.jsx         # Main App component
└── main.jsx        # Entry point
```

## 🔧 Environment Variables

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_NAME=Internship & Placement Management System
```

## 🎯 Features

### Student Portal
- Profile management
- Browse opportunities
- Apply for internships/placements
- Track application status

### Faculty Portal
- Review student applications
- Approve/reject applications
- Monitor student progress

### Placement Cell Portal
- Create opportunities
- Manage student data
- View analytics dashboard

### Recruiter Portal
- Post job opportunities
- View student applications
- Manage recruitment process

## 🛠️ Development

```bash
npm run dev     # Start development server
npm run build   # Build for production
npm run preview # Preview production build
```

## 📦 Dependencies

- **react** - UI library
- **react-router-dom** - Client-side routing
- **axios** - HTTP client
- **vite** - Build tool