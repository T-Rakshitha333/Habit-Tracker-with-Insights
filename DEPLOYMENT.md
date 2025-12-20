# 🚀 Global Deployment Guide for HabitFlow

To make your Habit Tracker work on **any device in the world**, we need to move it from your local computer to the cloud.

## Step 1: Set up a Database (MongoDB Atlas)
Since we've upgraded the code to use a professional database:
1.  Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) and create a free account.
2.  Create a new Cluster (Free Tier).
3.  Go to **Database Access** -> Add New User (Username: `admin`, Password: `yourpassword`).
4.  Go to **Network Access** -> Add IP Address -> Select "Allow Access from Anywhere".
5.  Go to **Database** -> Click **Connect** -> Choose **Drivers** -> Copy the **Connection String**.
    *   It looks like: `mongodb+srv://admin:<password>@cluster.mongodb.net/habit-db?retryWrites=true&w=majority`

---

## Step 2: Deploy Backend (Render)
1.  Push your project to GitHub.
2.  Go to [Render](https://render.com) and sign in.
3.  Click **New +** -> **Web Service**.
4.  Connect your GitHub repo.
5.  Settings:
    *   **Root Directory**: `backend`
    *   **Build Command**: `npm install`
    *   **Start Command**: `node server.js`
6.  **Environment Variables**:
    *   `MONGODB_URI`: (Paste your MongoDB string from Step 1)
7.  Click **Create Web Service**. Copy the API URL Render gives you (e.g., `https://habit-api.onrender.com`).

---

## Step 3: Deploy Frontend (Vercel)
1.  Go to [Vercel](https://vercel.com) and sign in.
2.  Click **Add New...** -> **Project**.
3.  Connect the same GitHub repo.
4.  Settings:
    *   **Root Directory**: `frontend`
    *   **Framework Preset**: `Vite`
5.  **Environment Variables**:
    *   `VITE_API_URL`: `https://habit-api.onrender.com/api` (The URL from Step 2 + `/api`)
6.  Click **Deploy**.

---

## 🎉 Success!
Once Vercel finished, you will have a link like `https://habitflow.vercel.app`. You can open this link on **any phone, tablet, or computer** anywhere in the world!
