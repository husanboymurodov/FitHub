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
