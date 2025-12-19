# 🚀 Deployment Guide for HabitFlow

Since this is a Full Stack application (React Frontend + Node.js Backend), it needs to be deployed in two parts.

## Part 1: Deploy Backend (Node.js) to Render

1.  **Push your code to GitHub**.
2.  Go to [Render.com](https://render.com) and sign up.
3.  Click **New +** -> **Web Service**.
4.  Connect your GitHub repository.
5.  Select the `backend` directory as the **Root Directory**.
6.  Set the **Build Command** to: `npm install`
7.  Set the **Start Command** to: `node server.js`
8.  Click **Create Web Service**.
9.  **Copy the URL** Render gives you (e.g., `https://habitflow-api.onrender.com`).

## Part 2: Deploy Frontend (React) to Vercel

1.  Go to [Vercel.com](https://vercel.com) and sign up.
2.  Click **Add New...** -> **Project**.
3.  Import the same GitHub repository.
4.  Set the **Root Directory** to `frontend`.
5.  Open the **Environment Variables** section.
6.  Add a new variable:
    *   **Name**: `VITE_API_URL`
    *   **Value**: `https://habitflow-api.onrender.com/api` (The URL from Part 1 + `/api`)
7.  Click **Deploy**.

## 🎉 Success!
Vercel will give you a live public URL (e.g., `https://habitflow.vercel.app`) where your app is running.
