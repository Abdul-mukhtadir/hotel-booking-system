# 🏨 Hotel Booking System

A full-stack Hotel Booking System built using the MERN Stack that allows users to search hotels, check room availability, make secure bookings, apply offers, make online payments, and manage reservations.

---

# 🚀 Features

## User Features

- User Registration and Login
- JWT Authentication
- Search Hotels
- Filter Hotels by City, Price, Room Type and Amenities
- View Hotel Details
- View Multiple Rooms
- Check Room Availability
- Book Hotel Rooms
- Prevent Booking for Past Dates
- Check-In and Check-Out Validation
- Guest Capacity Validation
- Razorpay Payment Integration
- Apply Coupon Codes
- Booking History
- Download Invoice PDF
- Add/Remove Favorite Hotels
- User Profile Management
- Booking Confirmation Email
- Booking Cancellation Email
- Booking Reminder Email

---

## Admin Features

- Admin Dashboard
- Manage Hotels
- Manage Rooms
- Manage Bookings
- Manage Users
- Manage Reviews
- Manage Offers
- Update Booking Status
- Send Booking Reminder Emails

---

# 🛠 Tech Stack

## Frontend

- React.js
- React Router
- Tailwind CSS
- Axios
- React Hot Toast

## Backend

- Node.js
- Express.js

## Database

- MongoDB Atlas
- Mongoose

## Authentication

- JWT Authentication

## Payment Gateway

- Razorpay

## Email Service

- Nodemailer

## Deployment

- Frontend: Netlify
- Backend: Render
- Database: MongoDB Atlas

---

# 📂 Project Structure

```
hotel-booking-system
│
├── client
│   ├── components
│   ├── pages
│   ├── services
│   ├── context
│   └── utils
│
├── server
│   ├── controllers
│   ├── models
│   ├── routes
│   ├── middleware
│   ├── config
│   └── utils
│
└── README.md
```

---

# 🔐 Demo Credentials

## Admin Login

Email:
```
john@gmail.com
```

Password:
```
123456
```

---

## User Login

Email:
```
riyaz7khan3@gmail.com
```

Password:
```
Testing@123
```

---

# 🌐 Live Demo

## Frontend

https://hotelsyst.netlify.app

## Backend

https://hotel-booking-system-dcg4.onrender.com

---

# ⚙ Installation

## Clone Repository

```bash
git clone https://github.com/Abdul-mukhtadir/hotel-booking-system.git
```

## Install Dependencies

### Client

```bash
cd client
npm install
```

### Server

```bash
cd server
npm install
```

---

# Environment Variables

Create a .env file inside the server folder.

```
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret
RAZORPAY_KEY_ID=your_key
RAZORPAY_KEY_SECRET=your_secret
EMAIL_USER=your_email
EMAIL_PASS=your_password
```

Create a .env file inside the client folder.

```
VITE_API_URL=your_backend_url
VITE_RAZORPAY_KEY=your_razorpay_key
```

---

# 📋 Validations Implemented

- Required Field Validation
- Email Validation
- Password Validation
- Phone Number Validation
- Check-In Date Validation
- Check-Out Date Validation
- Prevent Past Date Booking
- Guest Capacity Validation
- Room Availability Validation
- Prevent Duplicate Booking
- Secure Payment Validation

---

# 📧 Notifications

- Welcome Email
- Booking Confirmation Email
- Booking Cancellation Email
- Booking Reminder Email

---

# 📄 Invoice

Users can download booking invoices containing:

- Invoice ID
- Hotel Name
- Room Type
- Room Number
- Check-In Date
- Check-Out Date
- Guests
- Payment Status
- Booking Status
- Total Amount

---

# 👨‍💻 Developed By

Abdul Mukhtadir Shaik

MCA Final Project

Hotel Booking System