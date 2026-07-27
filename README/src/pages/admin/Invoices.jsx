import { FileText } from 'lucide-react';
import { Edit } from 'lucide-react';
import { Trash2 } from 'lucide-react';

import { useQuery } from '@tanstack/react-query';
import api from '../../api/axiosConfig';

const Invoices = () => {
  const { data: invoicesData, isLoading } = useQuery({
    queryKey: ['invoices'],
    queryFn: () => api.get('/invoices')
  });

  if (isLoading) return <div className="p-8 text-center text-gray-500">Loading Invoices...</div>;

  const invoices = invoicesData?.data || [];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Paid': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500';
      case 'Unpaid': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500';
      case 'Partial': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this invoice? This will also delete the associated booking.')) {
      try {
        await api.delete(`/bookings/${id}`);
        window.location.reload();
      } catch (err) {
        alert('Failed to delete invoice');
      }
    }
  };

  return (
    <div className="glass-panel rounded-2xl overflow-hidden animate-fade-in">
      <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-white/50 dark:bg-slate-900/50">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Invoices & Billing</h2>
      </div>

      <div className="premium-table-container rounded-none border-x-0 border-b-0">
        <table className="premium-table">
          <thead>
            <tr>
              <th className="premium-th">Invoice #</th>
              <th className="premium-th">Job Card</th>
              <th className="premium-th">Customer</th>
              <th className="premium-th">Amount</th>
              <th className="premium-th">Status</th>
              <th className="premium-th">Date</th>
              <th className="premium-th text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices.length === 0 ? (
              <tr>
                <td colSpan="7" className="p-8 text-center text-slate-500 dark:text-slate-400">
                  No invoices generated yet.
                </td>
              </tr>
            ) : (
              invoices.map((invoice) => (
                <tr key={invoice.id} className="premium-tr">
                  <td className="premium-td font-bold text-slate-900 dark:text-white">
                    {invoice.invoiceNumber || `INV-${invoice.id}`}
                  </td>
                  <td className="premium-td text-slate-700 dark:text-slate-300">
                    {invoice.jobNumber || `JC-${invoice.jobCardId}`}
                  </td>
                  <td className="premium-td font-semibold text-slate-700 dark:text-slate-300">
                    {invoice.customerName || 'N/A'}
                  </td>
                  <td className="premium-td font-semibold text-slate-900 dark:text-white">
                    ₹{invoice.totalAmount}
                  </td>
                  <td className="premium-td">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusColor(invoice.paymentStatus || 'Unpaid')}`}>
                      {invoice.paymentStatus || 'Unpaid'}
                    </span>
                  </td>
                  <td className="premium-td">
                    {invoice.createdAt ? new Date(invoice.createdAt).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="premium-td text-right space-x-2">
                    <button 
                      onClick={() => window.open(`/admin/invoices/${invoice.id}/print`, '_self')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50 rounded-lg text-sm font-semibold transition-colors"
                      title="View PDF"
                    >
                      <FileText className="w-4 h-4" /> PDF
                    </button>
                    <button 
                      onClick={() => alert('Please use the Bookings page to edit this invoice details.')}
                      className="inline-flex items-center justify-center w-8 h-8 bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 rounded-lg transition-colors"
                      title="Edit Invoice"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(invoice.id)}
                      className="inline-flex items-center justify-center w-8 h-8 bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50 rounded-lg transition-colors"
                      title="Delete Invoice"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Invoices;
