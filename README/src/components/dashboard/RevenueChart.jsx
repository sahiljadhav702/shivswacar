import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, AreaChart, CartesianGrid, XAxis, YAxis, Area } from 'recharts';

import { useState, useEffect } from 'react';

export default function RevenueChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/reports")
      .then(res => res.json())
      .then(json => {
        if (json.monthlyRevenue) {
           const formatted = json.monthlyRevenue.map(item => ({
             name: item.month,
             revenue: Number(item.revenue) || 0
           }));
           setData(formatted);
        }
      })
      .catch(err => console.error("Error fetching revenue chart data:", err));
  }, []);

  return (
    <div className="h-full w-full p-4 flex flex-col">
      <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">Monthly Revenue</h3>
      <div className="flex-1 w-full min-h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0F62FE" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#0F62FE" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} tickFormatter={(val) => `₹${val/1000}k`} dx={-10} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1E1E1E', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}
              itemStyle={{ color: '#0F62FE' }}
              formatter={(value) => [`₹${value}`, 'Revenue']}
            />
            <Area type="monotone" dataKey="revenue" stroke="#0F62FE" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
