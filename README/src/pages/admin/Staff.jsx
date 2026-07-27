import Modal from '../../components/ui/Modal';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api/axiosConfig';
import toast from 'react-hot-toast';

const Staff = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Mechanic'
  });

  const { data: staffData, isLoading } = useQuery({
    queryKey: ['staff'],
    queryFn: () => api.get('/staff')
  });

  const mutation = useMutation({
    mutationFn: (staffMember) => {
      if (editingId) {
        return api.put(`/staff/${editingId}`, staffMember);
      }
      return api.post('/staff', staffMember);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
      toast.success(editingId ? 'Staff updated successfully!' : 'Staff created successfully!');
      closeModal();
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Something went wrong');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/staff/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
      toast.success('Staff deleted successfully!');
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
    if(window.confirm('Are you sure you want to remove this staff member?')) {
      deleteMutation.mutate(id);
    }
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ name: '', email: '', phone: '', role: 'Mechanic' });
    setIsModalOpen(true);
  };

  const openEditModal = (staff) => {
    setEditingId(staff.id);
    setFormData({
      name: staff.name || '',
      email: staff.email || '',
      phone: staff.phone || '',
      role: staff.role || 'Mechanic'
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  if (isLoading) return <div className="p-8 text-center text-gray-500">Loading Staff...</div>;

  const staffMembers = staffData?.data || [];

  return (
    <div className="glass-panel rounded-2xl overflow-hidden animate-fade-in">
      <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-white/50 dark:bg-slate-900/50">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Staff Management</h2>
        <button onClick={openAddModal} className="px-5 py-2.5 bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 text-sm font-semibold flex items-center gap-2">
          <span className="text-lg leading-none">+</span> Add Staff
        </button>
      </div>

      <div className="premium-table-container rounded-none border-x-0 border-b-0">
        <table className="premium-table">
          <thead>
            <tr>
              <th className="premium-th">Staff Name</th>
              <th className="premium-th">Role</th>
              <th className="premium-th">Email</th>
              <th className="premium-th">Phone</th>
              <th className="premium-th">Joined</th>
              <th className="premium-th text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {staffMembers.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-8 text-center text-slate-500 dark:text-slate-400">
                  No staff members found.
                </td>
              </tr>
            ) : (
              staffMembers.map((staff) => (
                <tr key={staff.id} className="premium-tr">
                  <td className="premium-td font-bold text-slate-900 dark:text-white">
                    {staff.name}
                  </td>
                  <td className="premium-td">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${staff.role === 'Admin' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'}`}>
                      {staff.role}
                    </span>
                  </td>
                  <td className="premium-td text-slate-600 dark:text-slate-400">
                    {staff.email && !staff.email.includes('@staff.com') && !staff.email.includes('@dummy.com') ? staff.email : 'N/A'}
                  </td>
                  <td className="premium-td font-medium text-slate-700 dark:text-slate-300">
                    {staff.phone || 'N/A'}
                  </td>
                  <td className="premium-td">
                    {staff.createdAt ? new Date(staff.createdAt).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="premium-td text-right space-x-3">
                    <button onClick={() => openEditModal(staff)} className="text-primary hover:text-primary-dark font-semibold transition-colors">Edit</button>
                    <button onClick={() => handleDelete(staff.id)} className="text-red-500 hover:text-red-700 font-semibold transition-colors">Remove</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingId ? "Edit Staff" : "Add New Staff"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
            <input required type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. John Doe" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number</label>
              <input required type="text" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" placeholder="+91..." />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role</label>
            <select name="role" value={formData.role} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none">
              <option value="Mechanic">Mechanic</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t dark:border-gray-700">
            <button type="button" onClick={closeModal} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors">Cancel</button>
            <button type="submit" disabled={mutation.isPending} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50 transition-colors">
              {mutation.isPending ? 'Saving...' : 'Save Staff'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Staff;
