# FitHub Fitness Tracker

FitHub is a web application for logging fitness activities, tracking progress, and managing user profiles. Built with Node.js, Express, and MongoDB.

## Project Structure

### Configuration

- `index.js`: Main entry point and server setup.
- `package.json`: Project metadata and dependencies.
- `package-lock.json`: Dependency version locking.
- `.env.example`: Template for environment variables.

### Folders

- `routes/`: Modular route handlers for pages, users, and activities.
- `models/`: Mongoose schemas for data storage.
- `views/`: EJS templates for the UI.
- `public/`: Static assets (CSS, JS, images).

## Setup

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Environment variables**:
   Create a `.env` file using `.env.example` as a guide:

   ```env
   MONGODB_URI=mongodb://localhost:27017/fitHub
   SESSION_SECRET=your_secret
   PORT=3000
   ```

3. **Run the application**:

   ```bash
   npm run server
   ```

## Demo Credentials

For portfolio review purposes, you can use the following pre-configured accounts to explore the application:

### 1. Standard User (Demo)
- **Email:** `guest@fithub.app`
- **Password:** `guestpassword123`
- **Access:** Full access to activity tracking, nutrition planning, and reminders.

### 2. Administrator
- **Email:** `admin@fithub.app`
- **Password:** `adminpassword123`
- **Access:** Includes access to the **Admin Dashboard** (available in the navbar) to view system-wide stats and user management.

## Security & Architecture

This project demonstrates several professional security practices:
- **RBAC (Role-Based Access Control):** Server-side middleware enforces strict access limits based on user roles (User vs. Admin).
- **Password Hashing:** Uses `bcrypt` with a salt factor of 12 for secure credential storage.
- **Session Security:** Cryptographically signed session cookies with unique secrets.
- **API Protection:** All data-driven endpoints are protected by authorization guards to prevent unauthorized access.
- **Separation of Concerns:** Clean architectural split between Routes, Models, and Middleware.
