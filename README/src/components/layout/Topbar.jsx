import { Menu } from 'lucide-react';
import { Search } from 'lucide-react';
import { Bell } from 'lucide-react';
import { Sun } from 'lucide-react';
import { Moon } from 'lucide-react';
import { User } from 'lucide-react';

import { useState, useEffect } from "react";

export default function Topbar({ toggleSidebar }) {
  const [isDark, setIsDark] = useState(
    localStorage.getItem("theme") === "dark" ||
    (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches)
  );

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  return (
    <header className="h-20 shrink-0 glass-header flex items-center justify-between px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="flex items-center gap-4 flex-1">
        <button 
          onClick={toggleSidebar}
          className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white md:hidden"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div className="relative max-w-md w-full hidden sm:block">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400 dark:text-slate-500" />
          </div>
          <input 
            type="text" 
            placeholder="Search dashboard..." 
            className="input-field pl-10 rounded-full bg-slate-100/50 dark:bg-slate-900/30 border-transparent hover:bg-slate-100 dark:hover:bg-slate-900/50 focus:bg-white dark:focus:bg-slate-800 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <button className="relative p-2.5 text-slate-500 hover:text-primary dark:text-slate-400 dark:hover:text-white rounded-full hover:bg-primary/5 dark:hover:bg-slate-800 transition-all duration-300">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full border-2 border-white dark:border-background-dark animate-pulse"></span>
        </button>
        
        <button 
          onClick={() => setIsDark(!isDark)}
          className="p-2.5 text-slate-500 hover:text-primary dark:text-slate-400 dark:hover:text-white rounded-full hover:bg-primary/5 dark:hover:bg-slate-800 transition-all duration-300"
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        <div className="h-8 w-px bg-border-light dark:bg-border-dark mx-1"></div>

        <button className="flex items-center gap-3 hover:opacity-80 transition-opacity pl-2">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-slate-900 dark:text-white leading-tight">
              {localStorage.getItem("userName") || (localStorage.getItem("userRole") === "Super Admin" ? "Admin User" : `${localStorage.getItem("userRole") || "Super"} User`)}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{localStorage.getItem("userRole") || "Super Admin"}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-primary-dark text-white shadow-lg shadow-primary/30 flex items-center justify-center font-bold border-2 border-white dark:border-slate-800">
            <User className="w-5 h-5" />
          </div>
        </button>
      </div>
    </header>
  );
}
