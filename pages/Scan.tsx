import React, { useState, useRef, useEffect } from 'react';
import { Camera, Check, X, Loader2, Sparkles } from 'lucide-react';
import { analyzeImage, fileToGenerativePart } from '../services/geminiService';
import { Expense, ExpenseCategory, ExpenseType, BrandAsset } from '../types';
import { useNavigate } from 'react-router-dom';

interface ScanProps {
  onAddExpense: (expense: Omit<Expense, 'id' | 'timestamp'>) => void;
  brands: BrandAsset[];
}

const Scan: React.FC<ScanProps> = ({ onAddExpense, brands }) => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzedData, setAnalyzedData] = useState<any>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Trigger file input on mount to simulate "Opening Camera" immediately
  useEffect(() => {
    // A small delay to allow transition animation
    const timer = setTimeout(() => {
      if (!imagePreview && !isAnalyzing) {
        fileInputRef.current?.click();
      }
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      if (!imagePreview) navigate('/'); // Go back if canceled
      return;
    }

    try {
      const base64Data = await fileToGenerativePart(file);
      setImagePreview(`data:${file.type};base64,${base64Data}`);
      setIsAnalyzing(true);
      
      const result = await analyzeImage(base64Data);
      setAnalyzedData(result);
      
    } catch (error) {
      console.error("Scanning error", error);
      alert("Could not analyze image. Try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleConfirm = () => {
    if (analyzedData) {
      onAddExpense({
        category: analyzedData.category,
        type: analyzedData.type,
        amount: analyzedData.amount,
        item: analyzedData.item,
        imageUrl: imagePreview || undefined,
        brand: analyzedData.item // Simplification for MVP
      });
      navigate('/');
    }
  };

  // Find if a brand matches for a potential discount visual
  const matchedBrand = analyzedData && brands.find(b => 
    analyzedData.item.toLowerCase().includes(b.name.toLowerCase()) && b.active
  );

  return (
    <div className="h-screen bg-black flex flex-col relative">
      <input 
        type="file" 
        accept="image/*" 
        capture="environment" 
        ref={fileInputRef} 
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Analysis Loading State */}
      {isAnalyzing && (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-6">
          <div className="relative">
            <div className="absolute inset-0 bg-flux-500/20 blur-xl rounded-full animate-pulse"></div>
            <Loader2 className="relative z-10 w-16 h-16 text-flux-400 animate-spin" />
          </div>
          <h2 className="text-xl font-light text-white">Analyzing visual patterns...</h2>
          <p className="text-sm text-gray-500">Detecting product, price, and category.</p>
        </div>
      )}

      {/* Result State */}
      {!isAnalyzing && analyzedData && (
        <div className="flex-1 flex flex-col p-6 pt-12 animate-in fade-in slide-in-from-bottom-10 duration-500">
           {/* Image Preview Background (Blurred) */}
           <div className="absolute inset-0 z-0 opacity-20">
             <img src={imagePreview!} alt="Scan" className="w-full h-full object-cover blur-md" />
           </div>
           
           <div className="relative z-10 flex flex-col h-full justify-between">
             <div className="space-y-6">
               <div className="flex justify-between items-start">
                  <h1 className="text-3xl font-bold text-white tracking-tight">{analyzedData.item}</h1>
                  <span className="px-3 py-1 bg-white/10 backdrop-blur rounded-full text-xs font-medium border border-white/20">
                    {analyzedData.category}
                  </span>
               </div>

               {/* Price Display */}
               <div className="glass-panel p-6 rounded-2xl flex flex-col items-center justify-center space-y-2">
                  <span className="text-gray-400 text-xs uppercase tracking-widest">Estimated Amount</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold text-white">S/ {analyzedData.amount.toFixed(2)}</span>
                  </div>
                  
                  {matchedBrand && (
                    <div className="mt-4 flex items-center gap-2 text-flux-400 bg-flux-900/50 px-3 py-1 rounded-full">
                       <Sparkles size={14} />
                       <span className="text-xs font-bold">{matchedBrand.name} Member: -{matchedBrand.discountPercentage}% applied next visit</span>
                    </div>
                  )}
               </div>

               <div className="grid grid-cols-2 gap-4">
                 <div className="glass-panel p-4 rounded-xl">
                   <span className="block text-[10px] text-gray-500 uppercase mb-1">Type</span>
                   <span className="font-semibold text-lg">{analyzedData.type}</span>
                 </div>
                 <div className="glass-panel p-4 rounded-xl">
                   <span className="block text-[10px] text-gray-500 uppercase mb-1">Confidence</span>
                   <span className="font-semibold text-lg">High</span>
                 </div>
               </div>
             </div>

             <div className="space-y-3 pb-8">
               <button 
                onClick={handleConfirm}
                className="w-full bg-white text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-100 transition"
               >
                 <Check size={20} /> Confirm Expense
               </button>
               <button 
                onClick={() => navigate('/')}
                className="w-full bg-transparent border border-white/10 text-gray-400 font-medium py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-white/5 transition"
               >
                 <X size={20} /> Discard
               </button>
             </div>
           </div>
        </div>
      )}

      {/* Initial/Fallback State */}
      {!isAnalyzing && !analyzedData && (
        <div className="flex-1 flex items-center justify-center">
             <button onClick={() => fileInputRef.current?.click()} className="text-white underline">Tap to Scan</button>
        </div>
      )}
    </div>
  );
};

export default Scan;