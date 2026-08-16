# 📋 TaskFlow Pro — Full-Stack Task Management Application

A full-stack task management application featuring Kanban workflow organization, priority filtering, user authentication, and data export capabilities. Developed as part of the SyntecxHub Web Development Internship.

---

## 🚀 Live Demo

- **Frontend (Vercel):** [https://syntecxhubintershipwebdevelopmentpr.vercel.app](https://syntecxhubintershipwebdevelopmentpr.vercel.app)
- **Backend API (Render):** [https://task-manager-backend-0un8.onrender.com](https://task-manager-backend-0un8.onrender.com)

---

## ✨ Features

- **🔐 Authentication & Security:** Secure registration and login using JSON Web Tokens (JWT) and Bcrypt password hashing.
- **📊 Interactive Workspaces:** Switch seamlessly between interactive **Kanban Board** (drag/status-organized) and **Grid/List** views.
- **⚡ Task Operations (CRUD):** Create, read, update, and delete tasks with custom titles, descriptions, priorities, statuses, categories, and due dates.
- **🔍 Multi-Level Filtering & Sorting:** Filter tasks dynamically by priority and category; sort by creation date or due dates.
- **📥 CSV Data Export:** Export the complete task inventory to a standard `.csv` format directly from the dashboard toolbar.
- **🌓 Theme Support:** Responsive Dark/Light mode toggle with persistent session caching via `localStorage`.
- **🔔 Visual Notifications:** Real-time feedback via toast alerts and in-form error validation.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React.js (Vite)
- **Styling:** Tailwind CSS
- **State Management:** React Context API
- **Icons:** Lucide React
- **Notifications:** React Hot Toast
- **HTTP Client:** Axios
- **Hosting:** Vercel

### Backend
- **Runtime:** Node.js & Express.js
- **Database:** MongoDB Atlas (Mongoose ODM)
- **Authentication:** JWT (`jsonwebtoken`) & `bcryptjs`
- **Configuration:** CORS, Custom Error Handlers, Google DNS resolution for SRV records
- **Hosting:** Render

---

## 📂 Project Structure

```text
Task-Manager-App/
├── Backend/
│   ├── controllers/
│   │   ├── authController.js
│   │   └── taskController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── errorMiddleware.js
│   ├── models/
│   │   ├── Task.js
│   │   └── User.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── taskRoutes.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
└── client/
    ├── src/
    │   ├── assets/
    │   ├── components/
    │   │   ├── Auth.jsx
    │   │   ├── KanbanBoard.jsx
    │   │   ├── Navbar.jsx
    │   │   ├── StatCards.jsx
    │   │   ├── TaskCard.jsx
    │   │   └── TaskModal.jsx
    │   ├── context/
    │   │   ├── AuthContext.jsx
    │   │   └── TaskContext.jsx
    │   ├── services/
    │   │   └── api.js
    │   ├── App.jsx
    │   ├── index.css
    │   └── main.jsx
    ├── index.html
    ├── package.json
    └── vite.config.js
