import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Scan from './pages/Scan';
import Insights from './pages/Insights';
import Navbar from './components/Navbar';
import { Expense, BrandAsset, UserState } from './types';
import { INITIAL_BRANDS, MOCK_EXPENSES } from './constants';
import { v4 as uuidv4 } from 'uuid'; // Actually we'll use a simple random id for MVP to save deps

// Simple UUID replacement
const generateId = () => Math.random().toString(36).substr(2, 9);

const AppContent: React.FC = () => {
  const location = useLocation();
  const showNavbar = location.pathname !== '/scan';

  // State
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = localStorage.getItem('flux_expenses');
    return saved ? JSON.parse(saved) : MOCK_EXPENSES;
  });

  const [brands, setBrands] = useState<BrandAsset[]>(INITIAL_BRANDS);
  
  const [userState, setUserState] = useState<UserState>({
    dailyLimit: 100, // 100 Soles daily limit
    subscriptionActive: true // Demo mode: Active
  });

  // Persistence
  useEffect(() => {
    localStorage.setItem('flux_expenses', JSON.stringify(expenses));
  }, [expenses]);

  const addExpense = (newExpenseData: Omit<Expense, 'id' | 'timestamp'>) => {
    const newExpense: Expense = {
      ...newExpenseData,
      id: generateId(),
      timestamp: Date.now()
    };
    setExpenses(prev => [newExpense, ...prev]);
  };

  return (
    <div className="min-h-screen bg-flux-900 text-white font-sans selection:bg-flux-500 selection:text-white">
      <Routes>
        <Route path="/" element={<Home expenses={expenses} brands={brands} userState={userState} />} />
        <Route path="/scan" element={<Scan onAddExpense={addExpense} brands={brands} />} />
        <Route path="/insights" element={<Insights expenses={expenses} />} />
      </Routes>
      
      {showNavbar && <Navbar />}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;