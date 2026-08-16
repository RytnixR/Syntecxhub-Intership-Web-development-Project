# 👥 User Management System (Week 2 Project)

A full-stack user administration application built during **Week 2** of the **Syntecxhub Web Development Internship**. This application provides administrative controls for managing user accounts, handling role-based access control, and executing full CRUD operations with database persistence.

---

## 🌐 Live Demo & Repository Links

* **Live Application:** [syntecxhub-user-management.onrender.com](https://syntecxhub-user-management.onrender.com)

> ⏳ **Please Note (Cold Start Delay):**  
> Because the application is hosted on Render's free tier, the server automatically spins down after periods of inactivity. Please allow **30 to 50 seconds** for the initial load while the cloud instance boots up. Subsequent requests will load instantly.

---

## ✨ Key Features

* **Full CRUD Operations:** Create, Read, Update, and Delete user profile records.
* **Role-Based Access Control (RBAC):** Assign and manage user permissions (e.g., `Admin`, `User`, `Moderator`).
* **Live Search & Filtering:** Filter user directories by name, email, or assigned role with debounced search input.
* **Form Validation & Security:** Client-side validation paired with backend schema enforcement and password encryption.
* **Responsive UI:** Clean, mobile-friendly interface designed with modal dialogs for add/edit operations and action confirmation prompts.

---

## 🛠️ Tech Stack

* **Frontend:** React.js / HTML5, Tailwind CSS / CSS3, JavaScript (ES6+), Axios
* **Backend:** Node.js, Express.js, RESTful APIs
* **Database:** MongoDB Atlas / Mongoose ODM
* **Deployment:** Render (Live Web Service)
* **Tools & Utilities:** MongoDB Compass, Git, GitHub

---

## 📡 REST API Reference

| HTTP Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/users` | Retrieve all users (supports `?search=` and `?role=` query parameters) |
| `GET` | `/api/users/:id` | Retrieve a single user record by ID |
| `POST` | `/api/users` | Register/create a new user record |
| `PUT` | `/api/users/:id` | Update profile information and user roles |
| `DELETE` | `/api/users/:id` | Remove a user account from the system |

---
