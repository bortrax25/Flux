import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Expense, ExpenseCategory } from '../types';
import { CATEGORY_COLORS } from '../constants';

interface InsightsProps {
  expenses: Expense[];
}

const Insights: React.FC<InsightsProps> = ({ expenses }) => {
  // Aggregate data for chart
  const dataMap = expenses.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
    return acc;
  }, {} as Record<string, number>);

  const data = Object.keys(dataMap).map(key => ({
    name: key,
    value: dataMap[key]
  })).filter(d => d.value > 0);

  const totalSpent = expenses.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="min-h-screen bg-flux-900 px-6 pt-12 pb-32 overflow-y-auto">
      <h1 className="text-2xl font-bold mb-2">Consumption DNA</h1>
      <p className="text-gray-400 text-sm mb-8">Visualize where your energy goes.</p>

      {/* Main Chart */}
      <div className="h-64 w-full relative mb-8">
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
                 <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.name as ExpenseCategory] || '#555'} />
               ))}
             </Pie>
             <Tooltip 
                contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', borderRadius: '12px' }}
                itemStyle={{ color: '#fff' }}
                formatter={(value: number) => [`S/ ${value.toFixed(2)}`, '']}
             />
           </PieChart>
         </ResponsiveContainer>
         {/* Center Text */}
         <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
           <div className="text-center">
             <span className="block text-xs text-gray-500 uppercase">Total</span>
             <span className="block text-xl font-bold text-white">S/ {totalSpent.toFixed(0)}</span>
           </div>
         </div>
      </div>

      {/* Breakdown List */}
      <div className="space-y-4">
        {data.map((item) => (
          <div key={item.name} className="flex items-center justify-between glass-panel p-4 rounded-xl">
             <div className="flex items-center gap-3">
               <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: CATEGORY_COLORS[item.name as ExpenseCategory] }}
               ></div>
               <span className="font-medium text-white">{item.name}</span>
             </div>
             <div className="text-right">
               <span className="block font-bold">S/ {item.value.toFixed(2)}</span>
               <span className="text-xs text-gray-500">{((item.value / totalSpent) * 100).toFixed(0)}%</span>
             </div>
          </div>
        ))}
      </div>

      {expenses.length === 0 && (
         <div className="text-center py-12 text-gray-500">
           No data available. Start scanning to see your insights.
         </div>
      )}
    </div>
  );
};

export default Insights;