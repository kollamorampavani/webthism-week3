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

### Frontend Deployment

The frontend can be deployed automatically using GitHub Pages.
After the workflow runs, the site will be available at:

`https://kollamorampavani.github.io/webthism-week3/`

Make sure GitHub Pages is enabled for the `gh-pages` branch in repository settings.

### Backend Deployment

The backend requires a Node.js host with PostgreSQL.
You can deploy it on Render, Railway, Heroku, or any cloud provider that supports Node.js.

Required environment variables:

```env
PORT=5000
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
DB_PORT=5432
DB_NAME=blog_cms
JWT_SECRET=your_jwt_secret_here
```

If you use Render or Heroku, set the start command to:

```bash
npm run start
```

### Container Deployment

The repository includes Dockerfiles in both `backend/` and `frontend/` to support container-based hosting.

- `backend/Dockerfile`
- `frontend/Dockerfile`

### Update API URL for Production

After deploying the backend, update `frontend/src/api.js` to point to the live backend URL:

```js
const API = axios.create({
    baseURL: 'https://your-backend-url.com/api',
});
```
