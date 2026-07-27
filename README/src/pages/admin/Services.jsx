import { Plus } from 'lucide-react';
import Modal from '../../components/ui/Modal';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api/axiosConfig';
import toast from 'react-hot-toast';

const Services = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    intervals: []
  });

  const availableIntervals = [1500, 10000, 20000, 30000, 40000, 50000, 60000, 70000, 80000, 90000, 100000];

  const toggleInterval = (km) => {
    const current = formData.intervals || [];
    if (current.includes(km)) {
      setFormData({ ...formData, intervals: current.filter(i => i !== km) });
    } else {
      setFormData({ ...formData, intervals: [...current, km] });
    }
  };

  const { data: servicesData, isLoading } = useQuery({
    queryKey: ['services'],
    queryFn: () => api.get('/services')
  });

  const mutation = useMutation({
    mutationFn: (serviceData) => {
      if (editingId) {
        return api.put(`/services/${editingId}`, serviceData);
      }
      return api.post('/services', serviceData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      toast.success(editingId ? 'Service updated successfully!' : 'Service created successfully!');
      closeModal();
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Something went wrong');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/services/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      toast.success('Service deleted successfully!');
    }
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };



  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({
      ...formData,
      duration: 0,
      description: '',
      parts: formData.intervals || []
    });
  };

  const handleDelete = (id) => {
    if(window.confirm('Are you sure you want to delete this part?')) {
      deleteMutation.mutate(id);
    }
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ name: '', price: '', intervals: [] });
    setIsModalOpen(true);
  };

  const openEditModal = (service) => {
    setEditingId(service.id);
    let parsedIntervals = [];
    if (service.parts) {
      try {
        parsedIntervals = typeof service.parts === 'string' ? JSON.parse(service.parts) : service.parts;
      } catch (e) {}
    }
    setFormData({
      name: service.name || '',
      price: service.price || '',
      intervals: parsedIntervals || []
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  if (isLoading) return <div className="p-8 text-center text-gray-500">Loading Services...</div>;

  const services = servicesData?.data || [];

  return (
    <div className="glass-panel rounded-2xl overflow-hidden animate-fade-in">
      <div className="p-6 border-b border-slate-200/50 dark:border-slate-700/50 flex justify-between items-center bg-white/50 dark:bg-slate-900/50">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Service Parts</h2>
        <button onClick={openAddModal} className="px-5 py-2.5 bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 text-sm font-semibold flex items-center gap-2">
          <Plus size={16} /> Add Part
        </button>
      </div>

      <div className="premium-table-container rounded-none border-x-0 border-b-0">
        <table className="premium-table">
          <thead>
            <tr>
              <th className="premium-th">Part Name</th>
              <th className="premium-th">Base Price</th>
              <th className="premium-th text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-8 text-center text-slate-500 dark:text-slate-400">
                  No service packages found.
                </td>
              </tr>
            ) : (
              services.map((service) => {
                return (
                  <tr key={service.id} className="premium-tr">
                    <td className="premium-td font-bold text-slate-900 dark:text-white">
                      {service.name}
                    </td>
                    <td className="premium-td font-semibold text-slate-900 dark:text-white">
                      ₹{service.price}
                    </td>
                    <td className="premium-td text-right space-x-3">
                      <button onClick={() => openEditModal(service)} className="text-primary hover:text-primary-dark font-semibold transition-colors">Edit</button>
                      <button onClick={() => handleDelete(service.id)} className="text-red-500 hover:text-red-700 font-semibold transition-colors">Delete</button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingId ? "Edit Part" : "Add New Part"}>
        <div className="max-h-[70vh] overflow-y-auto px-1 pb-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Part Name</label>
              <input required type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Engine Oil" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Part Base Price (₹)</label>
              <input required type="number" step="0.01" name="price" value={formData.price} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" placeholder="999" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Applicable Service Intervals (Km)</label>
              <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-2 border rounded-lg dark:border-gray-600 dark:bg-gray-700/50">
                {availableIntervals.map(km => (
                  <label key={km} className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={(formData.intervals || []).includes(km)}
                      onChange={() => toggleInterval(km)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span>{km.toLocaleString()} Km</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-6 mt-4 border-t dark:border-gray-700 sticky bottom-0 bg-white dark:bg-gray-800">
              <button type="button" onClick={closeModal} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors">Cancel</button>
              <button type="submit" disabled={mutation.isPending} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50 transition-colors">
                {mutation.isPending ? 'Saving...' : 'Save Part'}
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default Services;
