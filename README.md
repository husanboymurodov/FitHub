# FitHub Fitness Tracker

FitHub is a comprehensive health and fitness management platform. It allows users to log workouts, track nutritional metrics, visualize progress through interactive analytics, and manage wellness reminders.

**Live Demo:** [https://fithub-app-745483922277.asia-southeast1.run.app](https://fithub-app-745483922277.asia-southeast1.run.app)

## Core Features

- **Activity Tracking**: Comprehensive logging of workouts with metrics for duration, distance, and calorie expenditure.
- **Nutrition Analytics**: Daily calorie tracking and meal discovery via external API integration.
- **Progress Visualization**: Dynamic data visualization using Chart.js to monitor health trends.
- **Task Management**: Automated reminders for hydration, exercise, and nutrition.
- **Admin Suite**: High-level system monitoring and user management dashboard.

## Technical Stack

- **Runtime**: Node.js (Express.js)
- **Persistence**: MongoDB (Mongoose ODM)
- **Templating**: EJS (Embedded JavaScript)
- **Frontend**: Vanilla CSS, Bootstrap 5, Chart.js
- **Security**: Passport.js, Bcrypt (Salting/Hashing), Express-Session
- **Infrastructure**: Docker, Google Cloud Run (512Mi RAM, 1 vCPU), MongoDB Atlas

## Project Architecture

```text
├── app.js               # Application entry point & middleware
├── index.js             # Server initialization
├── Dockerfile           # Container configuration
├── cloudbuild.yaml      # GCP CI/CD pipeline definition
├── models/              # Mongoose data schemas
├── routes/              # Modular API & Page routing
├── middleware/          # Authentication & RBAC logic
├── views/               # Server-side rendered templates
├── public/              # Client-side assets (JS, CSS, Images)
└── tests/               # Unit and Integration test suites
```

## Deployment (Google Cloud Run)

The application is containerized and deployed via **Google Cloud Build (2nd Gen)** to ensure consistent architecture compliance and automated delivery.

### Infrastructure Details
- **Service Name**: `fithub-app`
- **Region**: `asia-southeast1` (Singapore)
- **Auto-scaling**: 0 to 3 instances (Cost-optimized)
- **Registry**: Google Artifact Registry (`cloud-run-source-deploy`)

### CI/CD Workflow
1. **Source Integration**: Changes are pushed to the GitHub repository.
2. **Automated Build**: Cloud Build detects commits to the `main` branch and builds the Docker image.
3. **Automated Deployment**: The image is pushed to Artifact Registry and automatically deployed to Cloud Run.

```bash
# Example deployment command (Automated via Cloud Build)
gcloud run deploy fithub-app \
  --image asia-southeast1-docker.pkg.dev/husanboymurodov/cloud-run-source-deploy/fithub-app:$COMMIT_SHA \
  --region asia-southeast1 \
  --allow-unauthenticated \
  --set-env-vars MONGODB_URI='[MONGODB_ATLAS_URI]',SESSION_SECRET='[SESSION_SECRET]'
```

## Local Development

### Prerequisites
- Node.js (v20+)
- MongoDB (Local or Atlas)

### Installation
```bash
npm install
npm run server
```

### Environment Configuration
Create a `.env` file in the root directory:
```env
MONGODB_URI=mongodb://localhost:27017/fitHub
SESSION_SECRET=fithub_dev_secret
PORT=3000
```

## Demo Credentials

For demonstration and review:

### 1. Standard User
- **Email:** `guest@fithub.app`
- **Password:** `guestpassword123`

### 2. Administrator
- **Email:** `admin@fithub.app`
- **Password:** `adminpassword123`

## Security Implementation

- **Identity Management**: Role-Based Access Control (RBAC) managed via custom middleware.
- **Credential Protection**: Industry-standard Bcrypt hashing with a cost factor of 12.
- **Secrets Management**: Integration with **GCP Secret Manager** for OAuth tokens and secure environment variable injection.
- **Session Integrity**: Cryptographically signed session cookies.
- **Data Protection**: Sanitized inputs and protected API endpoints to prevent unauthorized access.
