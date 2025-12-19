import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Insights from './pages/Insights';
import Challenges from './pages/Challenges';
import NotificationManager from './components/NotificationManager';

function App() {
  return (
    <BrowserRouter>
      <NotificationManager />
      <div className="page-layout">
        <Sidebar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/insights" element={<Insights />} />
            <Route path="/challenges" element={<Challenges />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
