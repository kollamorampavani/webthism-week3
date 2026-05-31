# BlogCMS Full Stack Application

This repository contains a full-stack blog and content management system built with:

- **Backend:** Node.js, Express, PostgreSQL
- **Frontend:** React, Vite
- **Authentication:** JWT
- **Features:** user signup/login, post creation, post listing, single post detail, comments

## Project Structure

- `backend/` — Express server, database connection, auth, posts/comments API
- `frontend/` — React client with routing and API integration

## Setup Instructions

### Backend

1. Install dependencies:
   ```bash
   cd backend
   npm install
   ```

2. Create a PostgreSQL database and update `backend/.env`:
   ```env
   PORT=5000
   DB_USER=postgres
   DB_PASSWORD=postgres
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=blog_cms
   JWT_SECRET=your_jwt_secret_here
   ```

3. Start the backend server:
   ```bash
   npm run dev
   ```

The backend will auto-create the `users`, `posts`, and `comments` tables when it starts.

### Frontend

1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```

2. Start the frontend dev server:
   ```bash
   npm run dev
   ```

3. Open the app in your browser at the URL shown by Vite (usually `http://localhost:5173`).

## Features

- Sign up and log in with email and password
- Create, read, update, and delete posts
- View a list of posts with author information and comment counts
- Open a single post page with full content and comment thread
- Add comments to posts when logged in

## API Endpoints

- `POST /api/auth/signup` — register a user
- `POST /api/auth/login` — log in and receive a JWT
- `GET /api/posts` — list all posts
- `POST /api/posts` — create a new post (authenticated)
- `GET /api/posts/:id` — load one post with comments
- `POST /api/posts/:id/comments` — add a comment (authenticated)

## Deployment Notes

- Deploy the backend to a server or platform that supports Node.js and PostgreSQL.
- Deploy the frontend to Vercel, Netlify, or any static hosting provider.
- Update the base API URL in `frontend/src/api.js` when deploying to production.
