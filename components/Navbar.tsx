import React from 'react';
import { Home, PieChart, Wallet, ScanLine } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const NavItem = ({ path, icon: Icon, label }: { path: string, icon: any, label: string }) => (
    <button
      onClick={() => navigate(path)}
      className={`flex flex-col items-center justify-center space-y-1 transition-colors ${isActive(path) ? 'text-flux-400' : 'text-gray-500'}`}
    >
      <Icon size={22} strokeWidth={isActive(path) ? 2.5 : 1.5} />
      <span className="text-[10px] font-medium tracking-wide">{label}</span>
    </button>
  );

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 px-6 pb-6 pt-4">
      <div className="mx-auto max-w-md bg-gray-900/80 backdrop-blur-xl border border-white/5 rounded-3xl shadow-2xl flex justify-between items-center px-8 py-4">
        <NavItem path="/" icon={Home} label="Home" />
        
        {/* Central Scan Button */}
        <button 
          onClick={() => navigate('/scan')}
          className="relative -top-6 bg-white text-black p-5 rounded-full shadow-[0_0_20px_rgba(255,255,255,0.3)] transform transition hover:scale-105 active:scale-95"
        >
          <ScanLine size={24} strokeWidth={2.5} />
        </button>

        <NavItem path="/insights" icon={PieChart} label="Insights" />
      </div>
    </div>
  );
};

export default Navbar;