import api from '../../api/axiosConfig';
import { useState, useEffect } from "react";
import Table from "../../components/ui/Table";
import Modal from "../../components/ui/Modal";

const columns = [
  { header: "ID", accessor: "id", cell: (row, idx) => <span className="font-semibold text-slate-900 dark:text-white">{idx + 1}</span> },
  { header: "Registration", accessor: "number", cell: (row) => <span className="font-bold text-slate-900 dark:text-white uppercase px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded border border-slate-300 dark:border-slate-600">{row.number}</span> },
  { header: "Brand", accessor: "brand" },
  { header: "Model", accessor: "model", cell: (row) => <span className="font-medium text-slate-800 dark:text-slate-200">{row.model}</span> },
  { header: "Year", accessor: "year" },
  { header: "Fuel", accessor: "fuel" },
  { header: "Owner", accessor: "owner" },
];

export default function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ customer_id: "", registration_number: "", brand: "", model: "", year: "", fuel_type: "Petrol" });
  const [submitting, setSubmitting] = useState(false);

  const fetchVehicles = () => {
    setLoading(true);
    api.get(`/vehicles`).then(res => { const data = res.data;  {
        if (Array.isArray(data)) setVehicles(data);
        else setVehicles([]);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching vehicles:", err);
        setVehicles([]);
        setLoading(false);
      });
  };

  const fetchCustomers = () => {
    api.get(`/customers`).then(res => { const data = res.data;  {
        if (Array.isArray(data)) setCustomers(data);
      })
      .catch(err => console.error("Error fetching customers:", err));
  };

  useEffect(() => {
    fetchVehicles();
    fetchCustomers();
  }, []);

  const handleAction = (action, row) => {
    if (action === 'view') {
      setSelectedVehicle(row);
      setIsViewModalOpen(true);
    } else if (action === 'edit') {
      setEditingId(row.id);
      setFormData({
        customer_id: customers.find(c => c.name === row.owner)?.id || "",
        registration_number: row.number || "",
        brand: row.brand || "",
        model: row.model || "",
        year: row.year || "",
        fuel_type: row.fuel || "Petrol"
      });
      setIsModalOpen(true);
    } else if (action === 'delete') {
      setVehicles(vehicles.filter(v => v.id !== row.id));
    }
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ customer_id: "", registration_number: "", brand: "", model: "", year: "", fuel_type: "Petrol" });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    if (editingId) {
      setVehicles(vehicles.map(v => v.id === editingId ? {
        ...v,
        owner: customers.find(c => c.id == formData.customer_id)?.name || v.owner,
        number: formData.registration_number,
        brand: formData.brand,
        model: formData.model,
        year: formData.year,
        fuel: formData.fuel_type
      } : v));
      setIsModalOpen(false);
      setSubmitting(false);
      return;
    }

    try {
      const res = await api.post("/vehicles", formData);
      if (res.status === 200 || res.status === 201) {
        setIsModalOpen(false);
        setFormData({ customer_id: "", registration_number: "", brand: "", model: "", year: "", fuel_type: "Petrol" });
        fetchVehicles();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Vehicles</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage registered vehicles.</p>
        </div>
        <button onClick={openAddModal} className="btn-primary">Add Vehicle</button>
      </div>

      <div className="card p-0 overflow-hidden border-none shadow-sm bg-transparent dark:bg-transparent">
        <div className="p-4 bg-surface-light dark:bg-surface-dark border border-b-0 border-slate-200 dark:border-slate-800 rounded-t-lg flex gap-4">
          <input type="text" placeholder="Search vehicles..." className="input-field max-w-sm" />
          <select className="input-field max-w-[150px]">
            <option value="">All Brands</option>
          </select>
        </div>
        {loading ? (
          <div className="h-64 flex items-center justify-center text-slate-500">Loading vehicles...</div>
        ) : (
          <Table
            columns={columns}
            data={vehicles}
            actions={['view', 'edit', 'delete']}
            onAction={handleAction}
          />
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? "Edit Vehicle" : "Add New Vehicle"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Owner (Customer)</label>
            <select required className="input-field" value={formData.customer_id} onChange={e => setFormData({ ...formData, customer_id: e.target.value })}>
              <option value="" disabled>Select a customer</option>
              {customers.map(c => (
                <option key={c.id} value={c.id}>{c.name} ({c.phone})</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Registration Number</label>
            <input required type="text" placeholder="e.g. MH-01-AB-1234" className="input-field uppercase" value={formData.registration_number} onChange={e => setFormData({ ...formData, registration_number: e.target.value })} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Brand</label>
              <input required type="text" className="input-field" value={formData.brand} onChange={e => setFormData({ ...formData, brand: e.target.value })} />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Model</label>
              <input required type="text" className="input-field" value={formData.model} onChange={e => setFormData({ ...formData, model: e.target.value })} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Year</label>
              <input required type="number" min="1990" max={new Date().getFullYear()} className="input-field" value={formData.year} onChange={e => setFormData({ ...formData, year: e.target.value })} />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Fuel Type</label>
              <select required className="input-field" value={formData.fuel_type} onChange={e => setFormData({ ...formData, fuel_type: e.target.value })}>
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="EV">EV</option>
                <option value="CNG">CNG</option>
              </select>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-slate-200 dark:border-slate-800">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors">Cancel</button>
            <button type="submit" disabled={submitting} className="btn-primary">{submitting ? "Saving..." : (editingId ? "Save Changes" : "Save Vehicle")}</button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title="Vehicle Details">
        {selectedVehicle && (
          <div className="space-y-4">
            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-500 text-sm">Vehicle ID</span>
                <span className="font-medium text-slate-900 dark:text-white">#{selectedVehicle.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 text-sm">Registration</span>
                <span className="font-bold text-slate-900 dark:text-white uppercase">{selectedVehicle.number}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 text-sm">Brand & Model</span>
                <span className="font-medium text-slate-900 dark:text-white">{selectedVehicle.brand} {selectedVehicle.model}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 text-sm">Year & Fuel</span>
                <span className="font-medium text-slate-900 dark:text-white">{selectedVehicle.year} - {selectedVehicle.fuel}</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 dark:border-slate-700 pt-3 mt-3">
                <span className="text-slate-500 text-sm">Owner</span>
                <span className="font-medium text-slate-900 dark:text-white">{selectedVehicle.owner}</span>
              </div>
            </div>
            <div className="pt-2 flex justify-end">
              <button onClick={() => setIsViewModalOpen(false)} className="btn-primary">Close</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
  };

const closeModal = () => {
  setIsModalOpen(false);
  setEditingId(null);
};

if (isLoading) return <div className="p-8 text-center text-gray-500">Loading Vehicles...</div>;
if (isError) return <div className="p-8 text-center text-red-500">Failed to load Vehicles.</div>;

const vehicles = data?.data || [];
const customers = customersData?.data || [];

return (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
    <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Vehicle Directory</h2>
      <button onClick={openAddModal} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
        + Add Vehicle
      </button>
    </div>

    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50 dark:bg-gray-900/50">
            <th className="p-4 text-sm font-medium text-gray-500 dark:text-gray-400 border-b dark:border-gray-700">Reg No.</th>
            <th className="p-4 text-sm font-medium text-gray-500 dark:text-gray-400 border-b dark:border-gray-700">Vehicle</th>
            <th className="p-4 text-sm font-medium text-gray-500 dark:text-gray-400 border-b dark:border-gray-700">Customer</th>
            <th className="p-4 text-sm font-medium text-gray-500 dark:text-gray-400 border-b dark:border-gray-700">Fuel/Year</th>
            <th className="p-4 text-sm font-medium text-gray-500 dark:text-gray-400 border-b dark:border-gray-700">Added On</th>
            <th className="p-4 text-sm font-medium text-gray-500 dark:text-gray-400 border-b dark:border-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {vehicles.length === 0 ? (
            <tr>
              <td colSpan="6" className="p-8 text-center text-gray-500 dark:text-gray-400">
                No vehicles registered yet.
              </td>
            </tr>
          ) : (
            vehicles.map((vehicle) => (
              <tr key={vehicle.id} className="border-b border-gray-50 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                <td className="p-4 text-sm font-bold text-gray-900 dark:text-white uppercase">
                  {vehicle.vehicleNumber}
                </td>
                <td className="p-4 text-sm text-gray-900 dark:text-white">
                  {vehicle.brand} {vehicle.model}
                </td>
                <td className="p-4 text-sm text-gray-600 dark:text-gray-300">
                  {vehicle.customer?.name} <br />
                  <span className="text-xs text-gray-400">{vehicle.customer?.mobile}</span>
                </td>
                <td className="p-4 text-sm text-gray-600 dark:text-gray-300">
                  {vehicle.fuelType || 'N/A'} <br />
                  <span className="text-xs text-gray-400">{vehicle.year || 'N/A'}</span>
                </td>
                <td className="p-4 text-sm text-gray-600 dark:text-gray-300">
                  {new Date(vehicle.createdAt).toLocaleDateString()}
                </td>
                <td className="p-4 text-sm">
                  <button onClick={() => openEditModal(vehicle)} className="text-blue-600 hover:text-blue-800 font-medium mr-3">Edit</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>

    <Modal isOpen={isModalOpen} onClose={closeModal} title={editingId ? "Edit Vehicle" : "Add New Vehicle"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Customer</label>
          <select required name="customerId" value={formData.customerId} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            <option value="">Select Customer</option>
            {customers.map(c => (
              <option key={c.id} value={c.id}>{c.name} ({c.mobile})</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Registration Number</label>
            <input required type="text" name="vehicleNumber" value={formData.vehicleNumber} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white uppercase" placeholder="MH-12-AB-1234" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Brand</label>
            <input required type="text" name="brand" value={formData.brand} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Model</label>
            <input required type="text" name="model" value={formData.model} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fuel Type</label>
            <select name="fuelType" value={formData.fuelType} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
              <option value="Petrol">Petrol</option>
              <option value="Diesel">Diesel</option>
              <option value="CNG">CNG</option>
              <option value="Electric">Electric</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Manufacturing Year</label>
            <input required type="number" name="year" value={formData.year} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t dark:border-gray-700">
          <button type="button" onClick={closeModal} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">Cancel</button>
          <button type="submit" disabled={mutation.isPending} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50">
            {mutation.isPending ? 'Saving...' : 'Save Vehicle'}
          </button>
        </div>
      </form>
    </Modal>
  </div>
);
};

export default Vehicles;
