Hamza Fitness Club Website - Complete System
Live Deployment
Website: https://hamza-fitness-club-website.vercel.app

Backend API: Running locally on http://localhost:3000

Database: MongoDB Atlas (Cloud)

System Status
COMPLETE AND FUNCTIONAL

Working Features

1.Frontend (Vercel)

    Responsive website with all pages
    Multi-step booking form
    Real-time slot validation (6-9 PM, 30-min slots)
    Live booking summary
    Mobile navigation

2.Backend (Node.js/Express)
    RESTful API endpoints
    Appointment CRUD operations
    Database connectivity
    CORS enabled for frontend communication

3.Database (MongoDB Atlas)

Cloud database: hamza-fitness-club
Collections: appointments
All bookings stored persistently

4.Technology Stack

    Frontend: HTML, CSS (Tailwind), JavaScript
    Backend: Node.js, Express.js, Mongoose
    Database: MongoDB Atlas
    Deployment: Vercel (Frontend)

5.API Endpoints

    GET/POST /api/appointments - Manage bookings
    GET/POST /api/members - Member management
    GET/POST /api/trainers - Trainer profiles
    GET/POST /api/classes - Class schedules
    GET /health - System status check

6.Database Connection

    Cluster: gym-cluster.yv2tvvg.mongodb.net
    User: fa23bse158_db_user
    Database: hamza-fitness-club
    Status: Connected and operational

7.Booking Process

    User fills form on frontend website
    Data sent to backend API via POST /api/appointments
    Backend validates and saves to MongoDB Atlas
    Confirmation returned to user
    Data persists in cloud database

8.Local Development

bash
# Backend setup
cd Backend
npm install
node server.js

# Frontend
Use Live Server or Python server

Environment
env

PORT=3000
MONGODB_URI=mongodb+srv://fa23bse158_db_user:fa23bse158_mernapi@gym-cluster.yv2tvvg.mongodb.net/hamza-fitness-club?retryWrites=true&w=majority
Contact
Support Email: support@hamzafitnessclub.com

Phone: +92 305 7050399
Address: Chowk, Khatam-e-Nabuwat Plaza, Millat Rd, Green Town, Faisalabad
Business Hours:
    Monday-Saturday: 6:15-9:15 AM, 4:15-10:45 PM
    Sunday: 6:15-9:15 AM, 4:15-10:45 PM
    Friday: Closed