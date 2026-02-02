# Internship & Placement Management System

A modular web application for managing student internships and placements in educational institutions.

## 🏗️ Project Structure

```
/internship-placement-system
├── backend/                 # Node.js + Express API
│   ├── src/
│   │   ├── config/         # Database configuration
│   │   ├── modules/        # Feature-based modules
│   │   │   ├── student/    # Student management
│   │   │   ├── application/# Application tracking
│   │   │   └── opportunity/# Opportunity listings
│   │   ├── middlewares/    # Auth & role middlewares
│   │   ├── utils/          # Shared utilities
│   │   ├── app.js          # Express app setup
│   │   └── server.js       # Server entry point
│   └── package.json
│
├── frontend/               # React.js application
│   ├── src/
│   │   ├── api/           # API service layer
│   │   ├── modules/       # Feature components
│   │   │   ├── student/   # Student components
│   │   │   └── opportunity/# Opportunity components
│   │   ├── routes/        # App routing
│   │   ├── context/       # React context
│   │   ├── utils/         # Frontend utilities
│   │   ├── App.jsx        # Main app component
│   │   └── main.jsx       # React entry point
│   └── package.json
│
└── README.md
```

## 🚀 Quick Start

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
   # Edit .env with your MongoDB URI and JWT secret
   ```

4. Start the server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## 📋 Current Features (Student Module)

- ✅ Student registration & authentication
- ✅ Profile management with skills tracking
- ✅ Browse available opportunities
- ✅ Apply for internships/placements
- ✅ Track application status
- ✅ JWT-based secure authentication

## 🔮 Future Modules (Integration Ready)

The architecture supports easy integration of:

- **Faculty/Mentor Module** (`/backend/src/modules/mentor/`)
- **Admin/Placement Cell Module** (`/backend/src/modules/admin/`)
- **AI Matching System** (`/backend/src/modules/ai/`)
- **Analytics Dashboard** (`/backend/src/modules/analytics/`)
- **Notification System** (`/backend/src/modules/notifications/`)

## 🛠️ Technology Stack

- **Backend:** Node.js, Express.js, MongoDB, JWT
- **Frontend:** React.js, React Router, Axios
- **Development:** Vite, Nodemon

## 🔐 API Endpoints

### Student Routes (`/api/v1/students`)
- `POST /register` - Student registration
- `POST /login` - Student login
- `GET /profile` - Get student profile
- `PUT /profile` - Update student profile

### Opportunity Routes (`/api/v1/opportunities`)
- `GET /` - List opportunities
- `GET /:id` - Get opportunity details

### Application Routes (`/api/v1/applications`)
- `POST /` - Apply for opportunity
- `GET /` - Get student applications
- `GET /:id` - Get application details

## 🏛️ Architecture Benefits

1. **Modular Design:** Each feature is self-contained
2. **Scalable:** Easy to add new modules without affecting existing ones
3. **Maintainable:** Clear separation of concerns
4. **Secure:** Role-based access control ready
5. **API-First:** RESTful design for future integrations

## 🔄 Integration Guidelines

When adding new modules:

1. Create module folder in `/backend/src/modules/[module-name]/`
2. Follow the pattern: `model.js`, `controller.js`, `routes.js`, `service.js`
3. Add routes to `/backend/src/app.js`
4. Create corresponding frontend components in `/frontend/src/modules/[module-name]/`
5. Update API service in `/frontend/src/api/`

## 📝 Development Notes

- All routes are versioned (`/api/v1/`)
- JWT tokens expire in 7 days (configurable)
- MongoDB connection with Mongoose ODM
- CORS enabled for frontend integration
- Environment-based configuration
- Consistent error handling and response format