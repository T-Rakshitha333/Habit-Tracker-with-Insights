# HabitFlow - Habit Tracker & Insights

A full-stack habit tracking application built with the MERN stack (MongoDB/JSON DB, Express, React, Node.js).
Featuring charts, dark mode, challenges, and leaderboards.

## Project Structure

This repository contains both the frontend and backend code.

### `frontend/`
The React application (Vite).
- **Steps to run**:
  ```bash
  cd frontend
  npm install
  npm run dev
  ```
- **Key Features**: Dashboard, Insights Charts (Recharts), Challenges, Glassmorphism UI.

### `backend/`
The Node.js/Express API.
- **Steps to run**:
  ```bash
  cd backend
  npm install
  node server.js
  ```
- **Database**: Currently configured to use a local JSON file (`db/database.json`) for easy testing without MongoDB installation.

## Deployment

See `DEPLOYMENT.md` for instructions on how to deploy to Vercel and Render.
