const fs = require('fs');
let c = fs.readFileSync('src/pages/admin/Invoices.jsx', 'utf8');

const replacement = `invoices.map((invoice) => (
                <tr key={invoice.id} className="premium-tr">
                  <td className="premium-td font-bold text-slate-900 dark:text-white">
                    {invoice.invoiceNumber || \`INV-\${invoice.id}\`}
                  </td>
                  <td className="premium-td text-slate-700 dark:text-slate-300">
                    {invoice.jobNumber || \`JC-\${invoice.jobCardId}\`}
                  </td>
                  <td className="premium-td font-semibold text-slate-700 dark:text-slate-300">
                    {invoice.customerName || 'N/A'}
                  </td>
                  <td className="premium-td font-semibold text-slate-900 dark:text-white">
                    ₹{invoice.totalAmount}
                  </td>
                  <td className="premium-td">
                    <span className={\`px-2.5 py-1 rounded-full text-xs font-semibold \${getStatusColor(invoice.paymentStatus || 'Unpaid')}\`}>
                      {invoice.paymentStatus || 'Unpaid'}
                    </span>
                  </td>
                  <td className="premium-td">
                    {invoice.createdAt ? new Date(invoice.createdAt).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="premium-td text-right space-x-2">
                    <button 
                      onClick={() => window.open(\`/admin/invoices/\${invoice.id}/print\`, '_self')}
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
              ))`;

c = c.replace(/invoices\.map\(\(invoice\) => \([\s\S]*?\)\)/, replacement);

fs.writeFileSync('src/pages/admin/Invoices.jsx', c);
console.log('Fixed');
