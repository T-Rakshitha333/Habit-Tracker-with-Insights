# 🚀 All-in-One Vercel Deployment Guide

I have refactored your project to run **both the Frontend and Backend on Vercel** as a single deployment. This is much easier to manage!

## Step 1: Set up MongoDB Atlas
1.  Create a free account at [MongoDB Atlas](https://www.mongodb.com/).
2.  Create a Cluster and get your **Connection String**.
    *   Example: `mongodb+srv://admin:<password>@cluster.mongodb.net/habit-db?retryWrites=true&w=majority`

---

## Step 2: Deploy to Vercel
1.  Push your updated code to **GitHub**.
2.  Go to [Vercel](https://vercel.com/) and click **Add New...** -> **Project**.
3.  Import your GitHub repository.
4.  **Configure Project Settings**:
    *   **Root Directory**: Leave as `.` (the project root).
    *   **Build Command**: `npm run build`
    *   **Output Directory**: `frontend/dist`
    *   **Install Command**: `npm install`
5.  **Environment Variables**:
    *   Add `MONGODB_URI` -> (Paste your MongoDB connection string).
6.  Click **Deploy**.

---

## 🎉 How it works:
*   **Backend**: Vercel automatically detects the `api/` folder and runs your Express app as a Serverless Function.
*   **Frontend**: Vercel builds your React app and serves it from the same domain.
*   **Routing**: I added a `vercel.json` file that makes sure `/api/*` goes to your backend and everything else goes to your React frontend.

### **Testing on other devices:**
Once the deployment is finished, Vercel will give you a link like `https://habitflow.vercel.app`. Open this link on your phone or any other device. Because we are using MongoDB, your habits will be synced across all of them!
