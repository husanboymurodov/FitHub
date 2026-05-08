# FitHub Fitness Tracker

FitHub is a Node.js and MongoDB fitness tracking app. It lets users log workouts, review progress charts, plan daily calorie intake, discover meals through TheMealDB, save favorite meals, and manage wellness reminders.

**Live demo:** https://fithub-app-745483922277.asia-southeast1.run.app

## Features

- **Authentication and profiles**: Email/password registration, login, demo user login, admin login, profile updates, and password changes.
- **Activity tracking**: Workout logs for cardio, strength, bodyweight, steps, notes, duration, distance, reps, and calories burned.
- **Progress charts**: Chart.js dashboards for recent activity trends.
- **Nutrition planner**: Meal discovery through TheMealDB, favorite meals, custom calorie entries, and daily intake totals.
- **Reminders**: Hydration, exercise, meal, and general reminders with browser notifications.
- **Admin dashboard**: Basic user and activity counts plus user listing for admin accounts.

## Tech Stack

- **Runtime**: Node.js 20, Express 5
- **Database**: MongoDB with Mongoose
- **Views**: EJS templates
- **Frontend**: Bootstrap 5, Bootstrap Icons, Chart.js, vanilla JavaScript
- **Auth**: Custom session-based auth with `express-session` and bcrypt password hashing
- **Deployment**: Docker, Google Cloud Build, Google Cloud Run, Artifact Registry

## Project Structure

```text
.
├── app.js                 # Express app, middleware, route mounting
├── index.js               # Production server startup and DB connection
├── config/database.js     # MongoDB connection and optional demo seeding
├── models/                # Mongoose schemas
├── routes/                # Page, API, activity, user, and admin routes
├── middleware/            # Login/admin authorization helpers
├── views/                 # EJS pages
├── public/                # Static CSS, JS, and image assets
├── tests/                 # Jest/Supertest tests
├── Dockerfile             # Cloud Run container image
└── cloudbuild.yaml        # Cloud Build pipeline
```

## Local Development

### Prerequisites

- Node.js 20+
- MongoDB locally or a MongoDB Atlas connection string

### Setup

```bash
npm install
# Create a .env file with the variables below.
npm run server
```

Example `.env`:

```env
MONGODB_URI=mongodb://localhost:27017/fitHub
SESSION_SECRET=replace-this-secret
PORT=3000
SEED_DEMO_ACCOUNTS=true
```

Open http://localhost:3000.

## Demo Accounts

Demo accounts are created automatically unless `SEED_DEMO_ACCOUNTS=false`.

| Role | Email | Password |
| --- | --- | --- |
| User | `guest@fithub.app` | `guestpassword123` |
| Admin | `admin@fithub.app` | `adminpassword123` |

## Testing

Run the default test suite:

```bash
npm test
```

The default suite runs tests that do not require a live MongoDB connection. Database-backed integration tests are skipped unless explicitly enabled:

```bash
RUN_DB_TESTS=true MONGODB_URI=mongodb://localhost:27017/fitHub_test npm test
```

Use a throwaway database for DB tests because the integration tests create and delete demo records.

## Deployment

The included Cloud Build pipeline builds and deploys the app to Cloud Run:

- **Service**: `fithub-app`
- **Region**: `asia-southeast1`
- **Image**: `asia-southeast1-docker.pkg.dev/husanboymurodov/fithub-repo/fithub-app:${COMMIT_SHA}`

Required Cloud Run environment variables:

```env
MONGODB_URI=<mongodb-atlas-uri>
SESSION_SECRET=<strong-session-secret>
NODE_ENV=production
SEED_DEMO_ACCOUNTS=true
```

Manual deploy equivalent:

```bash
gcloud run deploy fithub-app \
  --image asia-southeast1-docker.pkg.dev/husanboymurodov/fithub-repo/fithub-app:$COMMIT_SHA \
  --region asia-southeast1 \
  --platform managed \
  --allow-unauthenticated \
  --set-env-vars MONGODB_URI="$MONGODB_URI",SESSION_SECRET="$SESSION_SECRET",NODE_ENV=production
```

## Production Notes

- Static asset paths are lowercase to match Linux/Cloud Run case-sensitive filesystems.
- Session cookies are HTTP-only, `sameSite=lax`, and secure when `NODE_ENV=production`.
- Activity deletion is scoped to the current logged-in user.
- User timestamps are enabled so admin "new users this week" stats can work for newly created users.
- The nutrition page depends on TheMealDB for meal data and remote meal images.
