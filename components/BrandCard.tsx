import React from 'react';
import { BrandAsset } from '../types';
import { Sparkles, Lock } from 'lucide-react';

interface BrandCardProps {
  brand: BrandAsset;
}

const BrandCard: React.FC<BrandCardProps> = ({ brand }) => {
  return (
    <div className={`relative overflow-hidden rounded-2xl p-4 glass-panel group transition-all duration-300 ${brand.active ? 'hover:scale-[1.02] border-white/10' : 'opacity-50 grayscale'}`}>
      
      <div className="flex justify-between items-start mb-8">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl bg-black/40 backdrop-blur-md`}>
          {brand.logo}
        </div>
        <div className="text-right">
          <span className="block text-2xl font-bold tracking-tight">{brand.discountPercentage}%</span>
          <span className="text-[10px] text-gray-400 uppercase tracking-widest">Discount</span>
        </div>
      </div>

      <div className="space-y-1">
        <h3 className="font-semibold text-lg">{brand.name}</h3>
        <div className="flex items-center gap-2 text-xs text-gray-400">
           {brand.active ? (
             <>
                <Sparkles size={12} className="text-yellow-400" />
                <span>{brand.balance} Coins</span>
             </>
           ) : (
             <>
               <Lock size={12} />
               <span>Locked Asset</span>
             </>
           )}
        </div>
      </div>

      {/* Decorative gradient blob */}
      {brand.active && (
        <div className={`absolute -bottom-6 -right-6 w-24 h-24 rounded-full blur-2xl opacity-20 ${brand.color}`}></div>
      )}
    </div>
  );
};

export default BrandCard;