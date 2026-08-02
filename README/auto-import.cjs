const fs = require('fs');
const path = require('path');

const errs = JSON.parse(fs.readFileSync('eslint-errors.json', 'utf8'));

const importMap = {
  // lucide-react
  Landmark: "import { Landmark } from 'lucide-react';",
  Building2: "import { Building2 } from 'lucide-react';",
  Building: "import { Building } from 'lucide-react';",
  Castle: "import { Castle } from 'lucide-react';",
  Tent: "import { Tent } from 'lucide-react';",
  Hotel: "import { Hotel } from 'lucide-react';",
  MapPin: "import { MapPin } from 'lucide-react';",
  ArrowRight: "import { ArrowRight } from 'lucide-react';",
  Globe: "import { Globe } from 'lucide-react';",
  MessageCircle: "import { MessageCircle } from 'lucide-react';",
  Camera: "import { Camera } from 'lucide-react';",
  ChevronRight: "import { ChevronRight } from 'lucide-react';",
  Phone: "import { Phone } from 'lucide-react';",
  Mail: "import { Mail } from 'lucide-react';",
  Link: "import { Link } from 'lucide-react';",
  User: "import { User } from 'lucide-react';",
  Settings: "import { Settings } from 'lucide-react';",
  X: "import { X } from 'lucide-react';",
  Eye: "import { Eye } from 'lucide-react';",
  Edit: "import { Edit } from 'lucide-react';",
  Trash2: "import { Trash2 } from 'lucide-react';",
  Battery: "import { Battery } from 'lucide-react';",
  Shield: "import { Shield } from 'lucide-react';",
  Award: "import { Award } from 'lucide-react';",
  ShieldCheck: "import { ShieldCheck } from 'lucide-react';",
  Wrench: "import { Wrench } from 'lucide-react';",
  TrendingUp: "import { TrendingUp } from 'lucide-react';",
  Clock: "import { Clock } from 'lucide-react';",
  Star: "import { Star } from 'lucide-react';",
  Check: "import { Check } from 'lucide-react';",
  Zap: "import { Zap } from 'lucide-react';",
  Truck: "import { Truck } from 'lucide-react';",
  ArrowLeft: "import { ArrowLeft } from 'lucide-react';",
  Calendar: "import { Calendar } from 'lucide-react';",
  CircleCheck: "import { CircleCheck } from 'lucide-react';",
  Plus: "import { Plus } from 'lucide-react';",
  Car: "import { Car } from 'lucide-react';",
  Fuel: "import { Fuel } from 'lucide-react';",
  Droplets: "import { Droplets } from 'lucide-react';",
  Gauge: "import { Gauge } from 'lucide-react';",
  Sparkles: "import { Sparkles } from 'lucide-react';",
  CheckCircle2: "import { CheckCircle2 } from 'lucide-react';",
  ChevronLeft: "import { ChevronLeft } from 'lucide-react';",
  Edit2: "import { Edit2 } from 'lucide-react';",
  Search: "import { Search } from 'lucide-react';",
  Activity: "import { Activity } from 'lucide-react';",
  Wind: "import { Wind } from 'lucide-react';",
  CarFront: "import { CarFront } from 'lucide-react';",
  ShieldAlert: "import { ShieldAlert } from 'lucide-react';",
  AlertTriangle: "import { AlertTriangle } from 'lucide-react';",
  Home: "import { Home } from 'lucide-react';",
  FileText: "import { FileText } from 'lucide-react';",
  ExternalLink: "import { ExternalLink } from 'lucide-react';",
  MessageSquare: "import { MessageSquare } from 'lucide-react';",
  Reply: "import { Reply } from 'lucide-react';",
  UserCog: "import { UserCog } from 'lucide-react';",
  Filter: "import { Filter } from 'lucide-react';",
  Download: "import { Download } from 'lucide-react';",
  Bell: "import { Bell } from 'lucide-react';",
  Save: "import { Save } from 'lucide-react';",
  LogOut: "import { LogOut } from 'lucide-react';",
  Menu: "import { Menu } from 'lucide-react';",
  Sun: "import { Sun } from 'lucide-react';",
  Moon: "import { Moon } from 'lucide-react';",

  // framer-motion
  motion: "import { motion, AnimatePresence } from 'framer-motion';",
  AnimatePresence: "import { motion, AnimatePresence } from 'framer-motion';",

  // react-router-dom
  Routes: "import { Routes, Route, Link, Outlet, BrowserRouter } from 'react-router-dom';",
  Route: "import { Routes, Route, Link, Outlet, BrowserRouter } from 'react-router-dom';",
  Outlet: "import { Routes, Route, Link, Outlet, BrowserRouter } from 'react-router-dom';",
  BrowserRouter: "import { Routes, Route, Link, Outlet, BrowserRouter } from 'react-router-dom';",

  // recharts
  ResponsiveContainer: "import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, AreaChart, CartesianGrid, XAxis, YAxis, Area } from 'recharts';",
  PieChart: "import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, AreaChart, CartesianGrid, XAxis, YAxis, Area } from 'recharts';",
  Pie: "import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, AreaChart, CartesianGrid, XAxis, YAxis, Area } from 'recharts';",
  Cell: "import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, AreaChart, CartesianGrid, XAxis, YAxis, Area } from 'recharts';",
  Tooltip: "import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, AreaChart, CartesianGrid, XAxis, YAxis, Area } from 'recharts';",
  Legend: "import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, AreaChart, CartesianGrid, XAxis, YAxis, Area } from 'recharts';",
  AreaChart: "import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, AreaChart, CartesianGrid, XAxis, YAxis, Area } from 'recharts';",
  CartesianGrid: "import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, AreaChart, CartesianGrid, XAxis, YAxis, Area } from 'recharts';",
  XAxis: "import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, AreaChart, CartesianGrid, XAxis, YAxis, Area } from 'recharts';",
  YAxis: "import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, AreaChart, CartesianGrid, XAxis, YAxis, Area } from 'recharts';",
  Area: "import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, AreaChart, CartesianGrid, XAxis, YAxis, Area } from 'recharts';",

  // others
  QueryClientProvider: "import { QueryClientProvider } from '@tanstack/react-query';",
  Toaster: "import { Toaster } from 'react-hot-toast';",
  StrictMode: "import { StrictMode } from 'react';",
  App: "import App from './App';",

  // local components mapping logic (will compute based on src dir)
};

const undef = {};
errs.forEach(f => {
  if(!f.messages) return;
  f.messages.forEach(m => {
    if(m.ruleId === 'no-undef' || m.message.includes('not defined') || m.ruleId === 'react/jsx-no-undef') {
      undef[f.filePath] = undef[f.filePath] || new Set();
      const match = m.message.match(/'(.*?)'/);
      if(match) undef[f.filePath].add(match[1]);
    }
  });
});

Object.keys(undef).forEach(filePath => {
  let content = fs.readFileSync(filePath, 'utf8');
  let newImports = new Set();
  
  // compute depth for local imports
  const srcPath = path.resolve(__dirname, 'src');
  const fileDir = path.dirname(filePath);
  
  const getRel = (targetFile) => {
    let rel = path.relative(fileDir, path.resolve(srcPath, targetFile)).replace(/\\/g, '/');
    if (!rel.startsWith('.')) rel = './' + rel;
    // remove extension
    rel = rel.replace(/\.jsx?$/, '');
    return rel;
  };
  
  const localMap = {
    AdminLayout: `import AdminLayout from '${getRel('components/layout/AdminLayout')}';`,
    Sidebar: `import Sidebar from '${getRel('components/layout/Sidebar')}';`,
    Topbar: `import Topbar from '${getRel('components/layout/Topbar')}';`,
    Modal: `import Modal from '${getRel('components/ui/Modal')}';`,
    Table: `import Table from '${getRel('components/ui/Table')}';`,
    Badge: `import Badge from '${getRel('components/ui/Badge')}';`,
    Navbar: `import Navbar from '${getRel('components/Navbar')}';`,
    Footer: `import Footer from '${getRel('components/Footer')}';`,
    SplashScreen: `import SplashScreen from '${getRel('components/SplashScreen')}';`,
    ServiceTabs: `import ServiceTabs from '${getRel('components/ServiceTabs')}';`,
    RevenueChart: `import RevenueChart from '${getRel('components/dashboard/RevenueChart')}';`,
    CategoryChart: `import CategoryChart from '${getRel('components/dashboard/CategoryChart')}';`,
    Dashboard: `import Dashboard from '${getRel('pages/admin/Dashboard')}';`,
    Customers: `import Customers from '${getRel('pages/admin/Customers')}';`,
    Bookings: `import Bookings from '${getRel('pages/admin/Bookings')}';`,
    Services: `import Services from '${getRel('pages/admin/Services')}';`,
    Invoices: `import Invoices from '${getRel('pages/admin/Invoices')}';`,
    InvoicePrint: `import InvoicePrint from '${getRel('pages/admin/InvoicePrint')}';`,
    Reports: `import Reports from '${getRel('pages/admin/Reports')}';`,
    Staff: `import Staff from '${getRel('pages/admin/Staff')}';`,
    Settings: `import Settings from '${getRel('pages/admin/Settings')}';`,
    Enquiries: `import Enquiries from '${getRel('pages/admin/Enquiries')}';`,
    Mechanics: `import Mechanics from '${getRel('pages/admin/Mechanics')}';`,
    Home: `import Home from '${getRel('pages/Home')}';`,
    MyGarage: `import MyGarage from '${getRel('pages/MyGarage')}';`,
    CarServices: `import CarServices from '${getRel('pages/CarServices')}';`,
    PUC: `import PUC from '${getRel('pages/PUC')}';`,
    CarDetails: `import CarDetails from '${getRel('pages/CarDetails')}';`,
    BatteryServiceSelection: `import BatteryServiceSelection from '${getRel('pages/BatteryServiceSelection')}';`,
    GarageSelection: `import GarageSelection from '${getRel('pages/GarageSelection')}';`,
    DateTimeSelection: `import DateTimeSelection from '${getRel('pages/DateTimeSelection')}';`,
    SocialMedia: `import SocialMedia from '${getRel('pages/SocialMedia')}';`,
    Login: `import Login from '${getRel('pages/Login')}';`,
    NotFound: `import NotFound from '${getRel('pages/NotFound')}';`
  };

  undef[filePath].forEach(v => {
    if (v === 'Link' && localMap[v] && !importMap[v]) {} // link is special
    if (importMap[v]) newImports.add(importMap[v]);
    else if (localMap[v]) newImports.add(localMap[v]);
    else console.log(`Warning: unknown var ${v} in ${filePath}`);
  });
  
  if (undef[filePath].has('Link') && filePath.includes('App.jsx')) {
    // App uses react router
  } else if (undef[filePath].has('Link')) {
    // Other files might use react-router link or lucide-react link
    // Default to react router Link for now, except Navbar which uses Lucide Link? Wait Navbar uses lucide-react Link!
    // we'll just import from lucide-react unless it's layout components or app
  }
  
  if (newImports.size > 0) {
    fs.writeFileSync(filePath, [...newImports].join('\n') + '\n\n' + content, 'utf8');
  }
});
