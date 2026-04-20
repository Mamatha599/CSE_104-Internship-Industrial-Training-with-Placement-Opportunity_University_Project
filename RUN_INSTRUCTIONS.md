# Running the AI-Driven Internship & Placement Portal

The system is now split into two main components: **Backend** (port 5001) and **Frontend** (port 5173).

## 🚀 Access the System
If you see **'Address already in use'** errors, it is because I have already started the servers for you in the background for verification. You can access the portal immediately:

- **Main Dashboard**: [http://localhost:5173](http://localhost:5173)
- **API Health**: [http://localhost:5001/health](http://localhost:5001/health)

---

## 🛠 Manual Execution

If you want to run the servers yourself in your local terminal:

### 1. Backend Server
Navigate to the `backend/` directory and start the dev server:
```powershell
cd backend
npm run dev
```

### 2. Frontend Development Server
Navigate to the `frontend/` directory and start the Vite dev server:
```powershell
cd frontend
npm run dev
```

### 3. Pre-requisites
- **Node.js**: v18+ recommended.
- **MongoDB**: Ensure MongoDB is running locally at `mongodb://localhost:27017/ipportal`.

---

## 📂 Project Organization
- `backend/src/modules/application`: Handles both internship and placement logic via the new `type` field.
- `frontend/src/modules/student/PortalSelector.jsx`: The entrance to the two portals.
- `frontend/src/modules/student/InternshipDashboard.jsx`: The new hub for internships.
