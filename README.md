# Marginalia — A MERN Blog Platform

A full-stack blogging platform built with MongoDB, Express, React, and Node.js.

## Features

- **Auth**: register/login with JWT, bcrypt-hashed passwords, protected routes
- **Posts**: create, edit, delete, draft vs. published, tags, slugs, auto read-time
- **Rich text editor**: React Quill for writing posts
- **Image uploads**: cover images uploaded directly to Cloudinary
- **Engagement**: likes and comments on posts
- **Search & pagination**: full-text search across title/content/tags
- **Responsive, editorial-styled UI** built with Tailwind CSS

## Project structure

```
blog-app/
  backend/     Express API (MongoDB via Mongoose, JWT auth, Cloudinary uploads)
  frontend/    React app (Vite, Tailwind, React Router, React Quill)
```

## 1. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env`:

- `MONGO_URI` — a local MongoDB instance (`mongodb://localhost:27017/blogapp`) or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster connection string
- `JWT_SECRET` — any long random string
- `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` — from a free [Cloudinary](https://cloudinary.com) account (Dashboard → Account Details)

Run it:

```bash
npm run dev
```

The API starts on `http://localhost:5000`. Check `http://localhost:5000/api/health` to confirm it's running.

## 2. Frontend setup

```bash
cd frontend
npm install
cp .env.example .env
```

`VITE_API_URL` defaults to `http://localhost:5000/api`, which matches the backend above.

Run it:

```bash
npm run dev
```

The app starts on `http://localhost:5173`.

## 3. Using the app

1. Register an account at `/register`.
2. Click **Write a post** to open the editor — add a cover image, title, rich text content, and tags.
3. Publish immediately or save as a draft.
4. Manage everything you've written (including drafts) from **Dashboard**.
5. Any signed-in user can like and comment on published posts; only the author (or an admin) can edit/delete a post.
