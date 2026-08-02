import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axiosConfig';

export default function InvoicePrint() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/invoices/${id}`)
      .then((res) => {
        if (res.data.success) {
          setInvoice(res.data.data);
          // Wait for DOM to render, then open print dialog
          setTimeout(() => {
            window.print();
          }, 500);
        } else {
          setError(res.data.message || 'Invoice not found');
        }
      })
      .catch((err) => {
        setError('Failed to load invoice');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Loading Invoice...</div>;
  }

  if (error || !invoice) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold text-red-500 mb-4">{error}</h2>
        <button 
          onClick={() => navigate('/admin/invoices')}
          className="px-4 py-2 bg-slate-200 rounded-lg text-slate-700"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black p-8 print:p-0">
      <div className="max-w-4xl mx-auto border border-gray-200 print:border-none p-10 print:p-0 rounded-xl">
        
        {/* Header */}
        <div className="flex justify-between items-start mb-12">
          <div>
            <h1 className="text-4xl font-extrabold text-blue-600 mb-2">HYUNDAI</h1>
            <p className="text-gray-500 text-sm">Professional Car Servicing</p>
            <p className="text-gray-500 text-sm mt-1">123 Auto Hub, Mumbai, MH 400001</p>
            <p className="text-gray-500 text-sm">+91 9699938509 | support@hyundai.com</p>
          </div>
          <div className="text-right">
            <h2 className="text-3xl font-bold text-gray-800 uppercase tracking-widest mb-2">Invoice</h2>
            <p className="text-gray-600 font-semibold text-lg">{invoice.invoiceNumber}</p>
            <p className="text-gray-500 text-sm mt-1">Date: {new Date(invoice.createdAt).toLocaleDateString()}</p>
            <p className="text-gray-500 text-sm">Job Card: {invoice.jobNumber}</p>
          </div>
        </div>

        {/* Customer & Vehicle Info */}
        <div className="grid grid-cols-2 gap-8 mb-12">
          <div className="p-6 bg-gray-50 rounded-xl border border-gray-100">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Billed To</h3>
            <p className="font-bold text-gray-800 text-lg">{invoice.customerName}</p>
            {invoice.customerPhone && <p className="text-gray-600 mt-1">{invoice.customerPhone}</p>}
            {invoice.customerEmail && <p className="text-gray-600">{invoice.customerEmail}</p>}
            {invoice.customerAddress && <p className="text-gray-600 mt-1">{invoice.customerAddress}</p>}
          </div>
          
          <div className="p-6 bg-gray-50 rounded-xl border border-gray-100">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Vehicle Details</h3>
            <p className="font-bold text-gray-800 text-lg">{invoice.vehicleBrand} {invoice.vehicleModel}</p>
            <p className="text-gray-600 mt-1 text-lg font-mono tracking-widest">{invoice.vehicleNumber}</p>
          </div>
        </div>

        {/* Line Items */}
        <div className="mb-12">
          <h3 className="text-lg font-bold text-gray-800 uppercase tracking-wider mb-6">Order Summary</h3>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="py-3 text-gray-600 font-semibold uppercase text-sm">Description</th>
                <th className="py-3 text-right text-gray-600 font-semibold uppercase text-sm">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="py-4 text-gray-800 font-medium">
                  {invoice.serviceType || 'General Car Service'}
                </td>
                <td className="py-4 text-right text-gray-800 font-medium">
                  ₹{invoice.totalAmount?.toLocaleString()}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="flex justify-end">
          <div className="w-64">
            <div className="flex justify-between py-2 text-gray-600">
              <span>Subtotal</span>
              <span>₹{invoice.totalAmount?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-2 text-gray-600 border-b border-gray-200">
              <span>Tax (0%)</span>
              <span>₹0</span>
            </div>
            <div className="flex justify-between py-3 text-xl font-bold text-gray-900">
              <span>Total</span>
              <span>₹{invoice.totalAmount?.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-24 pt-8 border-t border-gray-200 text-center text-gray-500 text-sm">
          <p className="mb-2">Thank you for choosing Hyundai. Drive safe!</p>
          <p>This is a computer generated invoice and does not require a physical signature.</p>
        </div>
      </div>
      
      {/* Hide print button when printing */}
      <div className="fixed bottom-8 right-8 print:hidden">
        <button 
          onClick={() => window.print()} 
          className="px-6 py-3 bg-blue-600 text-white rounded-full shadow-lg font-bold hover:bg-blue-700 transition-colors"
        >
          Print Invoice
        </button>
      </div>
    </div>
  );
}
