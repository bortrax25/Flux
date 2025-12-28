import React from 'react';
import LiquidGauge from '../components/LiquidGauge';
import BrandCard from '../components/BrandCard';
import { Expense, BrandAsset, UserState } from '../types';
import { ChevronRight, Zap } from 'lucide-react';

interface HomeProps {
  expenses: Expense[];
  brands: BrandAsset[];
  userState: UserState;
}

const Home: React.FC<HomeProps> = ({ expenses, brands, userState }) => {
  // Calculate today's spent
  const today = new Date().setHours(0,0,0,0);
  const spentToday = expenses
    .filter(e => e.timestamp >= today)
    .reduce((acc, curr) => acc + curr.amount, 0);

  const percentage = (spentToday / userState.dailyLimit) * 100;
  const activeBrands = brands.filter(b => b.active).slice(0, 2); // Show top 2 active brands

  return (
    <div className="relative h-screen flex flex-col bg-flux-900">
      
      {/* Liquid Background */}
      <LiquidGauge value={percentage} />

      <div className="relative z-10 flex-1 flex flex-col px-6 pt-12 pb-32 overflow-y-auto no-scrollbar">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-sm font-medium text-gray-400 uppercase tracking-widest">Daily Flux</h1>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold text-white tracking-tighter">
                S/ {spentToday.toFixed(2)}
              </span>
              <span className="text-sm text-gray-500 font-medium">
                / {userState.dailyLimit}
              </span>
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${userState.subscriptionActive ? 'bg-flux-500/20 text-flux-400 border border-flux-500/30' : 'bg-gray-800 text-gray-500'}`}>
            <Zap size={12} fill="currentColor" />
            <span>{userState.subscriptionActive ? 'PRO' : 'FREE'}</span>
          </div>
        </div>

        {/* Message based on usage */}
        <div className="mb-12">
          <p className="text-2xl font-light text-white/90 leading-tight">
            {percentage < 30 ? "You're flowing well today." : 
             percentage < 70 ? "Energy levels rising." : 
             "Reaching capacity. Slow down."}
          </p>
        </div>

        {/* Recent Activity (Mini) */}
        <div className="mb-8">
            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Recent Flow</h2>
            <div className="space-y-3">
              {expenses.slice(0, 3).map(expense => (
                <div key={expense.id} className="flex justify-between items-center p-3 glass-panel rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-flux-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]"></div>
                    <span className="text-sm font-medium">{expense.item}</span>
                  </div>
                  <span className="text-sm font-bold text-white">-{expense.amount.toFixed(2)}</span>
                </div>
              ))}
              {expenses.length === 0 && (
                <div className="text-gray-600 text-sm italic">No activity yet. Scan something.</div>
              )}
            </div>
        </div>

        {/* Brand Assets Preview */}
        <div>
           <div className="flex justify-between items-end mb-4">
             <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Active Assets</h2>
             <button className="text-xs text-white/60 flex items-center hover:text-white">
               View All <ChevronRight size={12} />
             </button>
           </div>
           <div className="grid grid-cols-2 gap-4">
             {activeBrands.map(brand => (
               <BrandCard key={brand.id} brand={brand} />
             ))}
           </div>
        </div>

      </div>
    </div>
  );
};

export default Home;