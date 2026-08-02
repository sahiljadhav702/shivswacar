import { Plus, Package, Wrench, X } from 'lucide-react';
import Modal from '../../components/ui/Modal';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api/axiosConfig';
import toast from 'react-hot-toast';

const Services = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('parts'); // 'parts' or 'packages'
  
  // PARTS STATE
  const [isPartModalOpen, setIsPartModalOpen] = useState(false);
  const [editingPartId, setEditingPartId] = useState(null);
  const [partFormData, setPartFormData] = useState({ name: '', price: '', intervals: [] });
  
  // PACKAGES STATE
  const [isPkgModalOpen, setIsPkgModalOpen] = useState(false);
  const [editingPkgId, setEditingPkgId] = useState(null);
  const [pkgFormData, setPkgFormData] = useState({
    title: '', description: '', price: '', oldPrice: '', badge: '', icon_type: 'Wrench', includes: [''], popular: false, time_taken: '4 Hrs Taken', image_url: 'https://gomechanic.in/assets/img/customerpage/category/car-service.jpg'
  });

  const availableIntervals = [1500, 10000, 20000, 30000, 40000, 50000, 60000, 70000, 80000, 90000, 100000];

  // --- QUERIES ---
  const { data: partsData, isLoading: partsLoading } = useQuery({ queryKey: ['services'], queryFn: () => api.get('/services') });
  const { data: packagesData, isLoading: pkgsLoading } = useQuery({ queryKey: ['packages'], queryFn: () => api.get('/packages') });

  // --- MUTATIONS: PARTS ---
  const partMutation = useMutation({
    mutationFn: (data) => editingPartId ? api.put(`/services/${editingPartId}`, data) : api.post('/services', data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['services'] }); toast.success('Part saved!'); setIsPartModalOpen(false); },
    onError: (err) => toast.error('Error saving part')
  });
  const deletePartMutation = useMutation({
    mutationFn: (id) => api.delete(`/services/${id}`),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['services'] }); toast.success('Part deleted!'); }
  });

  // --- MUTATIONS: PACKAGES ---
  const pkgMutation = useMutation({
    mutationFn: (data) => editingPkgId ? api.put(`/packages/${editingPkgId}`, data) : api.post('/packages', data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['packages'] }); toast.success('Package saved!'); setIsPkgModalOpen(false); },
    onError: (err) => toast.error('Error saving package')
  });
  const deletePkgMutation = useMutation({
    mutationFn: (id) => api.delete(`/packages/${id}`),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['packages'] }); toast.success('Package deleted!'); }
  });

  // --- HANDLERS: PARTS ---
  const toggleInterval = (km) => {
    const current = partFormData.intervals || [];
    setPartFormData({ ...partFormData, intervals: current.includes(km) ? current.filter(i => i !== km) : [...current, km] });
  };
  const handlePartSubmit = (e) => {
    e.preventDefault();
    partMutation.mutate({ ...partFormData, duration: 0, description: '', parts: partFormData.intervals || [] });
  };
  const openEditPart = (service) => {
    setEditingPartId(service.id);
    let parsedIntervals = [];
    try { parsedIntervals = typeof service.parts === 'string' ? JSON.parse(service.parts) : service.parts; } catch (e) {}
    setPartFormData({ name: service.name || '', price: service.price || '', intervals: parsedIntervals || [] });
    setIsPartModalOpen(true);
  };

  // --- HANDLERS: PACKAGES ---
  const handlePkgSubmit = (e) => {
    e.preventDefault();
    const cleanIncludes = pkgFormData.includes.filter(i => i.trim() !== '');
    pkgMutation.mutate({ ...pkgFormData, includes: cleanIncludes });
  };
  const openEditPkg = (pkg) => {
    setEditingPkgId(pkg.id);
    let parsedIncludes = [''];
    try { parsedIncludes = typeof pkg.includes === 'string' ? JSON.parse(pkg.includes) : pkg.includes; } catch (e) {}
    if (!parsedIncludes || parsedIncludes.length === 0) parsedIncludes = [''];
    setPkgFormData({
      title: pkg.title || '', description: pkg.description || '', price: pkg.price || '', oldPrice: pkg.oldPrice || '',
      badge: pkg.badge || '', icon_type: pkg.icon_type || 'Wrench', includes: parsedIncludes, popular: pkg.popular ? true : false,
      time_taken: pkg.time_taken || '4 Hrs Taken', image_url: pkg.image_url || 'https://gomechanic.in/assets/img/customerpage/category/car-service.jpg'
    });
    setIsPkgModalOpen(true);
  };
  const updatePkgInclude = (index, val) => {
    const newInc = [...pkgFormData.includes];
    newInc[index] = val;
    setPkgFormData({ ...pkgFormData, includes: newInc });
  };
  const addPkgInclude = () => setPkgFormData({ ...pkgFormData, includes: [...pkgFormData.includes, ''] });
  const removePkgInclude = (index) => {
    const newInc = [...pkgFormData.includes];
    newInc.splice(index, 1);
    setPkgFormData({ ...pkgFormData, includes: newInc });
  };

  const parts = partsData?.data || [];
  const packages = packagesData?.data || [];

  return (
    <div className="space-y-6">
      <div className="glass-panel rounded-2xl overflow-hidden animate-fade-in">
          <div className="p-6 border-b border-slate-200/50 dark:border-slate-700/50 flex justify-between items-center bg-white/50 dark:bg-slate-900/50">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Service Parts</h2>
            <button onClick={() => { setEditingPartId(null); setPartFormData({ name: '', price: '', intervals: [] }); setIsPartModalOpen(true); }} className="px-5 py-2.5 bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl hover:shadow-lg transition-all text-sm font-semibold flex items-center gap-2">
              <Plus size={16} /> Add Part
            </button>
          </div>
          <div className="premium-table-container rounded-none border-x-0 border-b-0">
            {partsLoading ? <div className="p-8 text-center text-gray-500">Loading Parts...</div> : (
              <table className="premium-table">
                <thead><tr><th className="premium-th">Part Name</th><th className="premium-th">Base Price</th><th className="premium-th text-right">Actions</th></tr></thead>
                <tbody>
                  {parts.length === 0 ? <tr><td colSpan="3" className="p-8 text-center">No parts found.</td></tr> : parts.map(p => (
                    <tr key={p.id} className="premium-tr">
                      <td className="premium-td font-bold">{p.name}</td>
                      <td className="premium-td font-semibold">₹{p.price}</td>
                      <td className="premium-td text-right space-x-3">
                        <button onClick={() => openEditPart(p)} className="text-primary font-semibold">Edit</button>
                        <button onClick={() => window.confirm('Delete?') && deletePartMutation.mutate(p.id)} className="text-red-500 font-semibold">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

      {/* PARTS MODAL */}
      <Modal isOpen={isPartModalOpen} onClose={() => setIsPartModalOpen(false)} title={editingPartId ? "Edit Part" : "Add New Part"}>
        <div className="max-h-[70vh] overflow-y-auto px-1 pb-4">
          <form onSubmit={handlePartSubmit} className="space-y-4">
            <div><label className="block text-sm font-medium mb-1">Part Name</label><input required type="text" name="name" value={partFormData.name} onChange={e => setPartFormData({...partFormData, name: e.target.value})} className="input-field py-2 w-full" /></div>
            <div><label className="block text-sm font-medium mb-1">Base Price (₹)</label><input required type="number" step="0.01" name="price" value={partFormData.price} onChange={e => setPartFormData({...partFormData, price: e.target.value})} className="input-field py-2 w-full" /></div>
            <div><label className="block text-sm font-medium mb-2">Service Intervals (Km)</label>
              <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-2 border rounded-lg dark:border-gray-600">
                {availableIntervals.map(km => (<label key={km} className="flex items-center space-x-2 text-sm cursor-pointer"><input type="checkbox" checked={(partFormData.intervals || []).includes(km)} onChange={() => toggleInterval(km)} className="rounded" /><span>{km.toLocaleString()} Km</span></label>))}
              </div>
            </div>
            <div className="flex justify-end space-x-3 pt-6 mt-4 border-t"><button type="button" onClick={() => setIsPartModalOpen(false)} className="px-4 py-2 text-sm bg-gray-100 rounded-lg">Cancel</button><button type="submit" disabled={partMutation.isPending} className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg">{partMutation.isPending ? 'Saving...' : 'Save Part'}</button></div>
          </form>
        </div>
      </Modal>



    </div>
  );
};

export default Services;
