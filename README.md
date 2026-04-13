User Task Management System
Overview

This is a full-stack Employee Task Management System where administrators can assign tasks to users and users can view and update their assigned tasks. The system includes authentication, role-based access control, and a dynamic user interface.

Features
User registration and login with JWT authentication
Role-based access (Admin and User)
Admin can:
View all registered users
Assign tasks to users
View tasks assigned by them (grouped by user)
Users can:
View their assigned tasks
Mark tasks as completed
Search and filter tasks
Persistent login using localStorage
Secure password hashing


Tech Stack
Frontend
React.js
CSS
Fetch API

Backend
FastAPI (Python)
SQLite
JWT Authentication
Passlib (bcrypt hashing)

Project Structure
Frontend
index.js – Entry point of React app
App.js – Main application logic and routing
Login.js – Login page
Register.js – Registration page
Dashboard.js – Main dashboard for admin and users
api.js – Handles all API calls
styles.css – Styling

Backend
main.py – FastAPI application entry point
schemas.py – Pydantic models
auth.py – JWT token creation and verification
utils.py – Password hashing and verification
database.py – Database connection

User
GET /profile – Get current user details
GET /my-tasks – Get tasks assigned to logged-in user
PUT /tasks/{task_id} – Mark task as completed

Admin
GET /users – Get all users
POST /tasks – Assign task to user
GET /assigned-tasks – View tasks assigned by admin
Authentication Flow
User logs in with email and password
Backend validates credentials
JWT token is generated and returned
Token is stored in localStorage
Token is sent in Authorization header for protected APIs

Example:

Authorization: Bearer <token>
Database Schema
Users Table
id
name
email
password
role

Tasks Table
id
title
description
status
user_id (assigned user)
assigned_by (admin who assigned)

Key Functionalities
Role-based authorization ensures only admins can assign tasks
Tasks are grouped by user for admin view
Users can only update their own tasks
Dynamic filtering and searching in UI
Proper error handling in both frontend and backend

Conclusion
This project demonstrates full-stack development using modern technologies, including secure authentication, API design, and dynamic frontend behavior. It is designed to be scalable and easily extendable for real-world use cases.
