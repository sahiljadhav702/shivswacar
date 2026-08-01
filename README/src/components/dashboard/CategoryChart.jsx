import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, AreaChart, CartesianGrid, XAxis, YAxis, Area } from 'recharts';

import { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';

const COLORS = ['#0F62FE', '#FF6B00', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#3B82F6', '#14B8A6'];

export default function CategoryChart() {
  const [data, setData] = useState([{ name: 'No Data', value: 1 }]);

  useEffect(() => {
    api.get("/dashboard/categories").then(res => { const json = res.data;
        if (Array.isArray(json) && json.length > 0) {
          setData(json);
        }
      })
      .catch(console.error);
  }, []);

  return (
    <div className="h-full w-full p-4 flex flex-col">
      <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">Service Categories</h3>
      <div className="flex-1 w-full min-h-[250px] flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ backgroundColor: '#1E1E1E', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}
            />
            <Legend verticalAlign="bottom" height={36} iconType="circle" />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
