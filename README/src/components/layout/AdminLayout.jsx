import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { Routes, Route, Link, Outlet, BrowserRouter } from 'react-router-dom';

import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('adminAuth') === 'true';
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-background-light to-slate-100 dark:from-background-dark dark:to-slate-900 text-slate-800 dark:text-slate-200 selection:bg-primary/30 selection:text-primary-dark dark:selection:text-white">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden relative">
        {/* Background glow effects */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-accent/5 blur-[100px] pointer-events-none"></div>

        <Topbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        {/* Scrollable Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 custom-scrollbar relative z-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
