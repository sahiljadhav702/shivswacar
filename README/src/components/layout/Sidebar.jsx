import { ChevronLeft } from 'lucide-react';
import { LogOut } from 'lucide-react';

import { useLocation, useNavigate, Link } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  CalendarCheck, 
  Wrench, 
  FileText, 
  BarChart3, 
  Settings
} from "lucide-react";
import { cn } from "../../utils/cn";
import hyundaiLogo from "../../assets/hyundai-logo.png";

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Customers", href: "/admin/customers", icon: Users },
  { name: "Bookings", href: "/admin/bookings", icon: CalendarCheck },
  { name: "Services", href: "/admin/services", icon: Wrench },
  { name: "Invoices", href: "/admin/invoices", icon: FileText },
  { name: "Reports", href: "/admin/reports", icon: BarChart3 },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export default function Sidebar({ isOpen, setIsOpen }) {
  const location = useLocation();
  const navigate = useNavigate();
  const role = localStorage.getItem("userRole") || "Super Admin";

  const filteredNavigation = navigation.filter(item => {
    if (role === "Super Admin" || role === "SUPER_ADMIN") return true;
    if (role === "Sub Admin" || role === "Manager" || role === "MANAGER") {
      return ["Customers", "Bookings", "Services", "Invoices", "Staff Management"].includes(item.name);
    }
    return true; // fallback
  });

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div 
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 glass-panel border-r-0 border-r-white/10 transition-transform duration-300 md:static md:translate-x-0 flex flex-col",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-20 shrink-0 items-center justify-between px-6 border-b border-slate-200/50 dark:border-slate-700/50">
          <Link to="/admin" className="flex items-center gap-2">
            <img src={hyundaiLogo} alt="Hyundai Logo" style={{ height: '40px', width: 'auto', objectFit: 'contain' }} />
          </Link>
          <button 
            className="md:hidden text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            onClick={() => setIsOpen(false)}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-6 custom-scrollbar">
          <nav className="space-y-2 px-4">
            {filteredNavigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 relative group overflow-hidden",
                    isActive 
                      ? "bg-primary/10 text-primary dark:text-white border border-primary/20 shadow-[0_0_15px_rgba(0,44,95,0.15)] dark:shadow-[0_0_15px_rgba(255,255,255,0.1)]" 
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200 border border-transparent"
                  )}
                  onClick={() => window.innerWidth < 768 && setIsOpen(false)}
                >
                  {/* Glowing line for active item */}
                  {isActive && <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-primary dark:bg-white rounded-r-full shadow-lg shadow-primary/30"></div>}
                  
                  <item.icon className={cn("w-5 h-5 shrink-0 transition-colors duration-300 relative z-10", isActive ? "text-primary dark:text-white" : "text-slate-400 dark:text-slate-500 group-hover:text-primary dark:group-hover:text-slate-300")} />
                  <span className="relative z-10">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
        
        <div className="p-5 border-t border-slate-200/50 dark:border-slate-700/50">
          <button 
            onClick={() => {
              localStorage.removeItem('adminAuth');
              localStorage.removeItem('userRole');
              navigate('/');
            }}
            className="flex items-center gap-3 px-4 py-3 w-full text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/10 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-xl transition-all duration-300 border border-red-100 dark:border-red-900/20"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            Logout
          </button>
        </div>
      </div>
    </>
  );
}
