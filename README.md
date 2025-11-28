## 🔗 Live Demo
Frontend: https://hrms-assignment.netlify.app  
Backend : https://hrms-project-wowh.onrender.com  

# HRMS – Human Resource Management System

A full-stack **Human Resource Management System (HRMS)** built with:

- **Backend:** Node.js, Express, Sequelize, SQLite, JWT Authentication, Bcrypt password hashing
- **Frontend:** React (Vite), Axios, React Router

- **Tools & Utilities** 
Postman — API testing, 
Sequelize CLI — migrations & seeders, 
Nodemon—auto-restart server,
Git & GitHub — version control,
VS Code — development

- **Features:** Organisations registration, Admin login, Employees, Teams, Employee ↔ Team assignment, Audit Logs
  
This project was built as a full-stack assignment to demonstrate:

- Secure authentication
- Multi-tenant organisation support
- Clean REST API design
- React frontend with protected routes
- Logging & audit trail

---

📁 Project Structure

```

HRMS-PROJECT/
│
├── backend/
│   ├── config/                 # Sequelize DB configuration
│   ├── migrations/             # Auto-generated migration files
│   ├── models/                 # Sequelize models and associations
│   ├── node_modules/
│   ├── seeders/                # Initial seed data (organisation, user, teams, employees)
│   └── src/
│       ├── controllers/        # Business logic
│       │   ├── authController.js
│       │   ├── employeeController.js
│       │   └── teamController.js
│       │
│       ├── middlewares/
│       │   └── authMiddleware.js   # JWT auth protection
│       │
│       ├── routes/             # API route definitions
│       │   ├── auth.js
│       │   ├── employees.js
│       │   ├── logs.js
│       │   └── teams.js
│       │
│       ├── utils/
│       │   └── logHelper.js    # Log actions into Logs table
│       │
│       └── index.js            # Main Express entry point
│
│   ├── .env                    # Environment variables
│   ├── dev.sqlite              # SQLite database file
│   └── package.json
│
│
└── frontend/
|    ├── node_modules/
|    └── src/
|       ├── components/         # Reusable UI components
|       │   ├── EmployeeForm.jsx
|       │   ├── TeamForm.jsx
|       │   ├── Navbar.jsx
|       │   └── ProtectedRoute.jsx
|       │
|       ├── pages/              # Main application pages
|       │   ├── Employees.jsx
|       │   ├── Login.jsx
|       │   ├── Logs.jsx
|       │   ├── RegisterOrg.jsx
|       │   └── Teams.jsx
|       │
|       ├── services/
|       │   └── api.js          # Axios setup + auth token interceptor
|       │
|       ├── App.jsx             # Route definitions
|       ├── App.css
|       ├── index.css
|       ├── main.jsx            # Vite/React entry point
|       │
|   ├── index.html              # Base HTML template
|   ├── package.json
|   ├── vite.config.js
|   ├── README.md
└── README.md


###  Prerequisites

◾Node.js (v16+ recommended)

◾npm or yarn

The backend uses SQLite, so no external DB service is required for local development.

⚙️ Backend Setup (Node + Express + Sequelize + SQLite)

1️⃣ Install dependencies

cd backend
npm install

2️⃣ Environment variables

Create .env in backend/ (if you don’t already have one):

cd backend
cp .env.example .env   # if example exists, otherwise create .env manually

Sample .env:

PORT=5000
JWT_SECRET=super-secret-key
NODE_ENV=development 

SQLite connection is configured via config/config.js (Sequelize) using a storage file, e.g. database.sqlite.

3️⃣ Run migrations

Make sure you have sequelize-cli installed (locally or globally).

cd backend
npx sequelize-cli db:migrate

4️⃣ Seed sample data

npx sequelize-cli db:seed:all

This will create the necessary tables:

◼️Organisation

◼️Admin user

◼️Employees

◼️Teams

◼️EmployeeTeam (junction table)

◼️Logs

Admin credentials:

email: admin@example.com
password: 123456

5️⃣ Start the backend server

cd backend
npm run dev   

The backend will typically run on:

http://localhost:5000

Main API base URL used by the frontend:

http://localhost:5000/api 

💻 Frontend Setup (React + Vite)

1️⃣ Install dependencies

cd frontend
npm install 

2️⃣ Check API base URL
Check src/services/api.js to ensure the base URL matches your backend:

// frontend/src/services/api.js
const API_BASE_URL = 'http://localhost:5000/api';

3️⃣ Start frontend

cd frontend
npm run dev

Vite usually runs on:

http://localhost:5173 

🔐 Authentication Flow

Register Organisation

POST /api/auth/register

Body example:

{
  "orgName": "Evallo TechWorks",
  "adminName": "Admin User",
  "email": "admin@example.com",
  "password": "123456"
}

👉 Creates:

◾Organisation

◾Admin user (owner of that org)

LOGIN

POST /api/auth/login 

◾Body:

{ "email": "admin@example.com", "password": "123456" }

◾Response:

{ "token": "JWT_TOKEN_HERE", "user": { ... } }

👉The frontend stores the JWT in localStorage as token, and api.js attaches it as:

Authorization: Bearer <token>

◼️Protected routes: 

/employees

/employees/new

/employees/:id/edit

/teams

/teams/new

/teams/:id/edit

/logs

Protected using:

Backend: authMiddleware.js

Frontend: ProtectedRoute.jsx

👥 Employees & Teams

👉 Employees

GET /api/employees – list employees for the organisation
(includes their related Teams)

GET /api/employees/:id – get one employee

POST /api/employees – create

PUT /api/employees/:id – update

DELETE /api/employees/:id – delete

Employees include their Teams because of Sequelize:

include: [{ model: Team, through: { attributes: [] } }]

🧩 Teams & Assignment

Team APIs

GET /api/teams – list teams for the organisation
(includes related Employees)

GET /api/teams/:id – get one team

POST /api/teams – create

PUT /api/teams/:id – update

DELETE /api/teams/:id – delete 

Employee ↔ Team Assignment

-> Assign employee to team

◾POST /api/teams/:teamId/assign
◾Body: { "employeeId": 2 }

-> Unassign employee from team

◾DELETE /api/teams/:teamId/unassign
◾Body: { "employeeId": 2 }

📊 Audit Logging

Every important action (auth, CRUD, assignments) is logged via a Logs table.

Example backend helper:

logAction(req, 'employee_assigned_to_team', {
  employeeId: 2,
  teamId: 3
});

👉 Logs API

GET /api/logs – admin-only; returns logs with parsed meta.

Sample log entry:

{
        "id": 2,
        "organisationId": 1,
        "userId": 1,
        "action": "user_logged_in",
        "meta": {
            "userId": 1,
            "email": "admin@example.com"
        },
        "createdAt": "2025-11-23T16:50:43.085Z",
        "updatedAt": "2025-11-23T16:50:43.085Z"
    }


The frontend /logs page supports:

◾Filtering by action

◾Filtering by userId

◾Filtering by date range (from / to)

🐳 (Optional) Docker Setup

This step is optional. The project uses SQLite, so a separate DB container is not strictly required.
This is an example docker-compose.yml if you want to containerize backend + frontend.

Create docker-compose.yml at the project root:

version: '3.9'

services:
  backend:
    build: ./backend
    container_name: hrms-backend
    ports:
      - "5000:5000"
    env_file:
      - ./backend/.env
    volumes:
      - ./backend:/usr/src/app
      - sqlite-data:/usr/src/app/database
    depends_on: []
    command: npm start

  frontend:
    build: ./frontend
    container_name: hrms-frontend
    ports:
      - "5173:5173"
    environment:
      - VITE_API_BASE_URL=http://localhost:5000/api
    volumes:
      - ./frontend:/usr/src/app
    command: npm run dev -- --host 0.0.0.0

volumes:
  sqlite-data:

Then:

docker-compose up --build

Backend: http://localhost:5000

Frontend: http://localhost:5173

🧪 Useful Scripts

Backend (/backend/package.json)

Example scripts:

 "scripts": {
    "start": "node src/index.js",
    "dev": "nodemon src/index.js"
    "migrate": "sequelize-cli db:migrate",
    "seed": "sequelize-cli db:seed:all"
  },

Frontend (/frontend/package.json)
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview"
}

✅ How to Run Everything (Quick Recap)

1. Backend

cd backend
npm install
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
npm run dev

2.Frontend

cd frontend
npm install
npm run dev

3.Open:

Frontend: http://localhost:5173

Backend: http://localhost:5000/api

Login with the seeded admin user (see seed file) and manage Employees, Teams, Assignments, and view Logs.
