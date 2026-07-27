import Badge from '../../components/ui/Badge';
import RevenueChart from '../../components/dashboard/RevenueChart';
import CategoryChart from '../../components/dashboard/CategoryChart';
import Table from '../../components/ui/Table';
import Modal from '../../components/ui/Modal';

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Car, CalendarCheck, Wrench, IndianRupee, TrendingUp } from "lucide-react";

const getStatusBadge = (status) => {
  const s = (status || 'Pending').toUpperCase();
  const map = {
    'COMPLETED': 'success',
    'IN PROGRESS': 'info',
    'PENDING': 'warning',
    'CONFIRMED': 'default'
  };
  return <Badge variant={map[s] || 'default'}>{status || 'Pending'}</Badge>;
};

const columns = [
  { header: "ID", accessor: "id", cell: (row, idx) => <span className="font-semibold text-slate-900 dark:text-white">{idx + 1}</span> },
  { header: "Customer", accessor: "customer" },
  { header: "Vehicle", accessor: "vehicle" },
  { header: "Service Type", accessor: "type" },
  { header: "Date", accessor: "date" },
  { header: "Status", accessor: "status", cell: (row) => getStatusBadge(row.status) },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [statsData, setStatsData] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [statusForm, setStatusForm] = useState("");

  useEffect(() => {
    Promise.all([
      fetch("http://localhost:5000/api/dashboard/stats").then(res => res.json()),
      fetch("http://localhost:5000/api/dashboard/recent").then(res => res.json())
    ])
      .then(([statsRes, recentRes]) => {
        setStatsData(statsRes);
        if (Array.isArray(recentRes)) setRecentBookings(recentRes);
        setLoading(false);
      })
      .catch(err => {
        setLoading(false);
      });
  }, []);

  const handleAction = async (action, row) => {
    if (action === 'view') {
      setSelectedBooking(row);
      setIsViewModalOpen(true);
    } else if (action === 'edit') {
      setEditingId(row.id);
      setStatusForm(row.status || 'Pending');
      setIsEditModalOpen(true);
    } else if (action === 'delete') {
      if (window.confirm("Are you sure you want to delete this booking?")) {
        try {
          const res = await fetch(`http://localhost:5000/api/bookings/${row.id}`, { method: 'DELETE' });
          if (res.ok) {
            setRecentBookings(recentBookings.filter(b => b.id !== row.id));
          }
        } catch (err) {
        }
      }
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:5000/api/bookings/${editingId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: statusForm })
      });
      if (res.ok) {
        setRecentBookings(recentBookings.map(b => b.id === editingId ? { ...b, status: statusForm } : b));
        setIsEditModalOpen(false);
      }
    } catch (err) {
    }
  };

  const stats = [
    { name: "Total Customers", value: statsData?.totalCustomers || "0", icon: Users, change: "0%", trend: "up" },
    { name: "Total Vehicles", value: statsData?.totalVehicles || "0", icon: Car, change: "0%", trend: "up" },
    { name: "Today's Bookings", value: statsData?.todayBookings || "0", icon: CalendarCheck, change: "0%", trend: "up" },
    { name: "Pending Services", value: statsData?.pendingServices || "0", icon: Wrench, change: "0%", trend: "up" },
    { name: "Monthly Revenue", value: statsData?.monthlyRevenue || "₹0", icon: IndianRupee, change: "0%", trend: "up" },
    { name: "Total Earnings", value: statsData?.totalEarnings || "₹0", icon: TrendingUp, change: "0%", trend: "up" },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Dashboard Overview</h1>
        <p className="text-slate-500 dark:text-slate-400">Welcome back, here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="glass-panel rounded-2xl p-6 flex flex-col gap-4 group hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary dark:text-white group-hover:scale-110 transition-transform duration-300 border border-primary/10">
                <stat.icon className="w-6 h-6 drop-shadow-md" />
              </div>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${stat.trend === 'up' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400' : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400'}`}>
                {stat.change}
              </span>
            </div>
            <div>
              <p className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{loading ? "..." : stat.value}</p>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">{stat.name}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass-panel rounded-2xl lg:col-span-2 min-h-[380px] p-2 overflow-hidden">
          <RevenueChart />
        </div>
        <div className="glass-panel rounded-2xl min-h-[380px] p-2 overflow-hidden">
          <CategoryChart />
        </div>
      </div>

      {/* Recent Bookings Table */}
      <div className="glass-panel rounded-2xl overflow-hidden p-0">
        <div className="p-6 border-b border-slate-200/50 dark:border-slate-700/50 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Recent Bookings</h2>
          <button onClick={() => navigate('/admin/bookings')} className="text-sm text-primary font-semibold hover:text-primary-dark transition-colors">View All &rarr;</button>
        </div>
        {loading ? (
          <div className="h-64 flex items-center justify-center text-slate-500 bg-surface-light dark:bg-surface-dark border border-t-0 border-slate-200 dark:border-slate-800 rounded-b-lg">
            Loading recent bookings...
          </div>
        ) : (
          <Table
            columns={columns}
            data={recentBookings}
            actions={['view', 'edit', 'delete']}
            onAction={handleAction}
          />
        )}
      </div>

      <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title="Booking Details">
        {selectedBooking && (
          <div className="space-y-4">
            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-500 text-sm">Booking ID</span>
                <span className="font-medium text-slate-900 dark:text-white">#{selectedBooking.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 text-sm">Customer</span>
                <span className="font-medium text-slate-900 dark:text-white">{selectedBooking.customer}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 text-sm">Vehicle</span>
                <span className="font-medium text-slate-900 dark:text-white">{selectedBooking.vehicle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 text-sm">Service Type</span>
                <span className="font-medium text-slate-900 dark:text-white max-w-[200px] text-right truncate" title={selectedBooking.type}>{selectedBooking.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 text-sm">Date</span>
                <span className="font-medium text-slate-900 dark:text-white">{selectedBooking.date}</span>
              </div>
              <div className="flex justify-between items-center mt-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                <span className="text-slate-500 text-sm">Status</span>
                <span>{getStatusBadge(selectedBooking.status)}</span>
              </div>
            </div>
            <div className="pt-2 flex justify-end">
              <button onClick={() => setIsViewModalOpen(false)} className="btn-primary">Close</button>
            </div>
          </div>
        )}
      </Modal>

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Update Booking Status">
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Status</label>
            <select className="input-field" value={statusForm} onChange={e => setStatusForm(e.target.value)}>
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          <div className="pt-4 flex justify-end gap-3 border-t border-slate-200 dark:border-slate-800">
            <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors">Cancel</button>
            <button type="submit" className="btn-primary">Save Changes</button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
