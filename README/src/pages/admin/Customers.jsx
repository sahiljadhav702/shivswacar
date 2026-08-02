import Modal from '../../components/ui/Modal';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api/axiosConfig';
import toast from 'react-hot-toast';

const Customers = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Customer',
    car_brand: 'Hyundai',
    car_model: '',
    car_number: '',
    created_at: new Date().toISOString().split('T')[0]
  });

  const { data: customersData, isLoading } = useQuery({
    queryKey: ['customers'],
    queryFn: () => api.get('/customers')
  });

  const mutation = useMutation({
    mutationFn: (customerData) => {
      if (editingId) {
        return api.put(`/customers/${editingId}`, customerData);
      }
      return api.post('/customers', customerData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast.success(editingId ? 'Customer updated successfully!' : 'Customer added successfully!');
      closeModal();
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Something went wrong');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/customers/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast.success('Customer deleted successfully!');
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
    if(window.confirm('Are you sure you want to delete this customer?')) {
      deleteMutation.mutate(id);
    }
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ 
      name: '', 
      email: '', 
      phone: '', 
      role: 'Customer',
      car_brand: 'Hyundai',
      car_model: '',
      car_number: '',
      created_at: new Date().toISOString().split('T')[0]
    });
    setIsModalOpen(true);
  };

  const openEditModal = (customer) => {
    setEditingId(customer.id);
    setFormData({
      name: customer.name || '',
      email: customer.email || '',
      phone: customer.mobile || '',
      role: 'Customer',
      car_brand: customer.car_brand || 'Hyundai',
      car_model: customer.car_model || '',
      car_number: customer.car_number || '',
      created_at: customer.createdAt ? new Date(customer.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  if (isLoading) return <div className="p-8 text-center text-gray-500">Loading Customers...</div>;

  const customersDataRaw = customersData?.data || [];
  // Sort customers by ID ascending (1, 2, 3...)
  const customers = [...customersDataRaw].sort((a, b) => a.id - b.id);

  return (
    <div className="glass-panel rounded-2xl overflow-hidden animate-fade-in">
      <div className="p-6 border-b border-slate-200/50 dark:border-slate-700/50 flex justify-between items-center bg-white/50 dark:bg-slate-900/50">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Customer Directory</h2>
        <button onClick={openAddModal} className="px-5 py-2.5 bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 text-sm font-semibold flex items-center gap-2">
          <span className="text-lg leading-none">+</span> Add Customer
        </button>
      </div>

      <div className="premium-table-container rounded-none border-x-0 border-b-0">
        <table className="premium-table">
          <thead>
            <tr>
              <th className="premium-th">ID</th>
              <th className="premium-th">Name</th>
              <th className="premium-th">Contact Info</th>
              <th className="premium-th">Joined</th>
              <th className="premium-th">Vehicles</th>
              <th className="premium-th text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-8 text-center text-gray-500 dark:text-gray-400">
                  No customers found.
                </td>
              </tr>
            ) : (
              customers.map((customer, idx) => (
                <tr key={customer.id} className="premium-tr">
                  <td className="premium-td font-semibold text-slate-900 dark:text-white">
                    #{idx + 1}
                  </td>
                  <td className="premium-td font-bold text-slate-900 dark:text-white">
                    {customer.name}
                  </td>
                  <td className="premium-td">
                    <div className="flex flex-col">
                      {customer.email && typeof customer.email === 'string' && !customer.email.includes('@dummy.com') && (
                        <span>{customer.email}</span>
                      )}
                      {customer.phone && (
                        <span className={(customer.email && typeof customer.email === 'string' && !customer.email.includes('@dummy.com')) ? "text-xs text-slate-400" : ""}>
                          {customer.phone}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="premium-td">
                    {customer.joined ? new Date(customer.joined).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="premium-td">
                    {customer.vehicle || <span className="text-slate-400 italic">No vehicles</span>}
                  </td>
                  <td className="premium-td text-right space-x-3">
                    <button onClick={() => openEditModal(customer)} className="text-primary hover:text-primary-dark font-semibold transition-colors">Edit</button>
                    <button onClick={() => handleDelete(customer.id)} className="text-red-500 hover:text-red-700 font-semibold transition-colors">Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingId ? "Edit Customer" : "Add New Customer"} fullScreen={true}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Full Name</label>
              <input required type="text" name="name" value={formData.name} onChange={handleInputChange} className="input-field" placeholder="John Doe" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Joining Date</label>
              <input required type="date" name="created_at" value={formData.created_at} onChange={handleInputChange} className="input-field" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Email Address</label>
              <input required type="email" name="email" value={formData.email} onChange={handleInputChange} className="input-field" placeholder="john@example.com" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Phone Number</label>
              <input required type="text" name="phone" value={formData.phone} onChange={handleInputChange} className="input-field" placeholder="+91 9876543210" />
            </div>
            
            <div className="col-span-1 md:col-span-2 border-t border-slate-200 dark:border-slate-700/50 pt-4 mt-2">
              <h4 className="text-md font-bold text-slate-900 dark:text-white mb-4">Vehicle Details (Optional)</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Car Brand</label>
                  <input type="text" name="car_brand" value={formData.car_brand} onChange={handleInputChange} className="input-field" placeholder="e.g. Hyundai" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Car Model</label>
                  <input type="text" name="car_model" value={formData.car_model} onChange={handleInputChange} className="input-field" placeholder="e.g. i20" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Car Number</label>
                  <input type="text" name="car_number" value={formData.car_number} onChange={handleInputChange} className="input-field" placeholder="e.g. MH 12 AB 1234" />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t border-slate-200 dark:border-slate-700/50">
            <button type="button" onClick={closeModal} className="px-6 py-2.5 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors">Cancel</button>
            <button type="submit" disabled={mutation.isPending} className="px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-primary to-primary-dark hover:shadow-lg hover:shadow-primary/30 rounded-xl disabled:opacity-50 transition-all duration-300">
              {mutation.isPending ? 'Saving...' : 'Save Customer'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Customers;
