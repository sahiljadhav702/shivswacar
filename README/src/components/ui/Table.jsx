import { Eye } from 'lucide-react';
import { Edit } from 'lucide-react';
import { Trash2 } from 'lucide-react';


export default function Table({ columns, data, actions, onAction }) {
  return (
    <div className="premium-table-container">
      <table className="premium-table">
        <thead>
          <tr>
            {columns.map((col, idx) => (
              <th key={idx} className="premium-th">{col.header}</th>
            ))}
            {actions && <th className="premium-th text-right">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIdx) => (
            <tr key={rowIdx} className="premium-tr">
              {columns.map((col, colIdx) => (
                <td key={colIdx} className="premium-td">
                  {col.cell ? col.cell(row, rowIdx) : row[col.accessor]}
                </td>
              ))}
              {actions && (
                <td className="premium-td text-right">
                  <div className="flex items-center justify-end gap-3">
                    {actions.includes('view') && (
                      <button onClick={() => onAction && onAction('view', row)} className="text-slate-400 hover:text-primary transition-colors" title="View">
                        <Eye className="w-4 h-4" />
                      </button>
                    )}
                    {actions.includes('edit') && (
                      <button onClick={() => onAction && onAction('edit', row)} className="text-slate-400 hover:text-primary-dark transition-colors" title="Edit">
                        <Edit className="w-4 h-4" />
                      </button>
                    )}
                    {actions.includes('delete') && (
                      <button onClick={() => onAction && onAction('delete', row)} className="text-slate-400 hover:text-red-500 transition-colors" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
