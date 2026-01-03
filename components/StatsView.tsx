
import React, { useMemo } from 'react';
import { WashSession } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface StatsViewProps {
  sessions: WashSession[];
  onBack: () => void;
}

const StatsView: React.FC<StatsViewProps> = ({ sessions, onBack }) => {
  const chartData = useMemo(() => {
    // Group earnings by day for the last 7 days
    const last7Days: any[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayStr = date.toDateString();
      const dayLabel = date.toLocaleDateString([], { weekday: 'short' });
      
      const daySessions = sessions.filter(s => new Date(s.date).toDateString() === dayStr);
      const dayEarnings = daySessions.reduce((sum, s) => sum + s.earnings, 0);
      
      last7Days.push({
        name: dayLabel,
        earnings: dayEarnings,
        count: daySessions.length
      });
    }
    return last7Days;
  }, [sessions]);

  const totalEarnings = sessions.reduce((sum, s) => sum + s.earnings, 0);
  const averageEarnings = sessions.length > 0 ? totalEarnings / sessions.length : 0;
  const totalMinutes = sessions.reduce((sum, s) => sum + s.duration, 0) / 60;
  const earningsPerHour = totalMinutes > 0 ? (totalEarnings / (totalMinutes / 60)) : 0;

  return (
    <div className="space-y-6 animate-in slide-in-from-right duration-300">
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-blue-400 transition-colors">
          <i className="fa-solid fa-chevron-left"></i>
        </button>
        <h2 className="text-xl font-bold">Business Overview</h2>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {/* Main Chart */}
        <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">Last 7 Days Revenue</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 12 }} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 12 }}
                  tickFormatter={(val) => `$${val}`}
                />
                <Tooltip 
                  cursor={{ fill: '#1e293b' }}
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px' }}
                  itemStyle={{ color: '#60a5fa', fontWeight: 'bold' }}
                />
                <Bar dataKey="earnings" radius={[6, 6, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.earnings > 0 ? '#3b82f6' : '#334155'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Detailed Stats Cards */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800">
            <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center mb-3">
              <i className="fa-solid fa-sack-dollar text-green-500 text-xs"></i>
            </div>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">Average / Wash</p>
            <p className="text-xl font-bold text-slate-100">${averageEarnings.toFixed(2)}</p>
          </div>
          
          <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800">
            <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center mb-3">
              <i className="fa-solid fa-clock text-blue-500 text-xs"></i>
            </div>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">Earnings / Hour</p>
            <p className="text-xl font-bold text-slate-100">${earningsPerHour.toFixed(2)}</p>
          </div>
        </div>

        <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Efficiency Metrics</h3>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-400">Total Work Time</span>
              <span className="text-sm font-bold text-slate-200">{Math.floor(totalMinutes / 60)}h {Math.round(totalMinutes % 60)}m</span>
            </div>
            <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
               <div className="h-full bg-blue-500 w-3/4"></div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-400">Wash Sessions</span>
              <span className="text-sm font-bold text-slate-200">{sessions.length} units</span>
            </div>
          </div>
        </div>

        {/* Full History Trigger */}
        <button className="w-full bg-slate-800/30 hover:bg-slate-800/50 py-4 rounded-2xl text-slate-400 text-xs font-bold uppercase tracking-widest border border-dashed border-slate-800 transition-colors">
          Download PDF Report
        </button>
      </div>
    </div>
  );
};

export default StatsView;
