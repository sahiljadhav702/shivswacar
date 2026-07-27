import Modal from '../../components/ui/Modal';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api/axiosConfig';
import toast from 'react-hot-toast';

const Bookings = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    customerId: '',
    vehicleId: '',
    status: 'Pending',
    complaints: ''
  });

  const { data: bookingsData, isLoading } = useQuery({
    queryKey: ['bookings'],
    queryFn: () => api.get('/bookings')
  });

  const mutation = useMutation({
    mutationFn: (bookingData) => {
      if (editingId) {
        return api.put(`/bookings/${editingId}`, bookingData);
      }
      return api.post('/bookings', bookingData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toast.success(editingId ? 'Booking updated successfully!' : 'Booking created successfully!');
      closeModal();
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Something went wrong');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/bookings/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toast.success('Booking deleted successfully!');
    }
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  const handleDelete = (id) => {
    if(window.confirm('Are you sure you want to delete this booking?')) {
      deleteMutation.mutate(id);
    }
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ customerId: '', vehicleId: '', status: 'Pending', complaints: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (booking) => {
    setEditingId(booking.id);
    setFormData({
      customerId: booking.customerId || '',
      vehicleId: booking.vehicleId || '',
      status: booking.status || 'Pending',
      complaints: booking.complaints || ''
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const getStatusColor = (status) => {
    const s = (status || 'Pending').toUpperCase();
    switch (s) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500';
      case 'IN PROGRESS': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-500';
      case 'COMPLETED': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500';
      case 'CANCELLED': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500';
      case 'CONFIRMED': return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  if (isLoading) return <div className="p-8 text-center text-gray-500">Loading Bookings...</div>;

  const bookings = bookingsData?.data || [];

  return (
    <div className="glass-panel rounded-2xl overflow-hidden animate-fade-in">
      <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-white/50 dark:bg-slate-900/50">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Service Bookings (Job Cards)</h2>
        <button onClick={openAddModal} className="px-5 py-2.5 bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 text-sm font-semibold flex items-center gap-2">
          <span className="text-lg leading-none">+</span> Create Booking
        </button>
      </div>

      <div className="premium-table-container rounded-none border-x-0 border-b-0">
        <table className="premium-table">
          <thead>
            <tr>
              <th className="premium-th">Job Number</th>
              <th className="premium-th">Customer</th>
              <th className="premium-th">Vehicle</th>
              <th className="premium-th">Complaints</th>
              <th className="premium-th">Status</th>
              <th className="premium-th">Date</th>
              <th className="premium-th text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length === 0 ? (
              <tr>
                <td colSpan="7" className="p-8 text-center text-slate-500 dark:text-slate-400">
                  No bookings found.
                </td>
              </tr>
            ) : (
              bookings.map((booking) => (
                <tr key={booking.id} className="premium-tr">
                  <td className="premium-td font-bold text-slate-900 dark:text-white">
                    {booking.jobNumber || `JC-${booking.id}`}
                  </td>
                  <td className="premium-td font-semibold text-slate-700 dark:text-slate-300">
                    {booking.customerName || `Customer #${booking.customerId}`}
                  </td>
                  <td className="premium-td">
                    {booking.vehicleNumber || `Vehicle #${booking.vehicleId}`}
                  </td>
                  <td className="premium-td max-w-[200px] truncate text-slate-500 dark:text-slate-400">
                    {booking.complaints || 'N/A'}
                  </td>
                  <td className="premium-td">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${getStatusColor(booking.status)}`}>
                      {booking.status || 'PENDING'}
                    </span>
                  </td>
                  <td className="premium-td">
                    {booking.createdAt ? new Date(booking.createdAt).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="premium-td text-right space-x-3">
                    <button onClick={() => openEditModal(booking)} className="text-primary hover:text-primary-dark font-semibold transition-colors">Edit</button>
                    <button onClick={() => handleDelete(booking.id)} className="text-red-500 hover:text-red-700 font-semibold transition-colors">Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingId ? "Edit Booking" : "Create New Booking"} fullScreen={true}>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Customer ID</label>
              <input required type="number" name="customerId" value={formData.customerId} onChange={handleInputChange} className="input-field py-2" placeholder="e.g. 1" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Vehicle ID</label>
              <input required type="number" name="vehicleId" value={formData.vehicleId} onChange={handleInputChange} className="input-field py-2" placeholder="e.g. 1" />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Status</label>
              <select name="status" value={formData.status} onChange={handleInputChange} className="input-field py-2">
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Complaints / Job</label>
              <input required type="text" name="complaints" value={formData.complaints} onChange={handleInputChange} className="input-field py-2" placeholder="Issue..." />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-3 border-t border-slate-200 dark:border-slate-700/50">
            <button type="button" onClick={closeModal} className="px-5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors">Cancel</button>
            <button type="submit" disabled={mutation.isPending} className="px-5 py-2 text-xs font-semibold text-white bg-gradient-to-r from-primary to-primary-dark hover:shadow-lg hover:shadow-primary/30 rounded-lg disabled:opacity-50 transition-all duration-300">
              {mutation.isPending ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Bookings;
