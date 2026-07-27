const fs = require('fs');
let c = fs.readFileSync('src/components/layout/Sidebar.jsx', 'utf8');

const replacement = `const navigation = [
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
  const role = localStorage.getItem("userRole") || "Super Admin";`;

c = c.replace(/import hyundaiLogo from "\.\.\/\.\.\/assets\/hyundai-logo\.png";[\s\S]*?const filteredNavigation = navigation\.filter\(item => {/, 
`import hyundaiLogo from "../../assets/hyundai-logo.png";

${replacement}

  const filteredNavigation = navigation.filter(item => {`
);

fs.writeFileSync('src/components/layout/Sidebar.jsx', c);
