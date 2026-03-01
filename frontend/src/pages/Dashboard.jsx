import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet, ChevronDown, CalendarDays } from 'lucide-react';
import RecentCategories from '../components/RecentCategories';
import api from '../utils/api';

const Dashboard = () => {
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [investments, setInvestments] = useState([]);
  const [savings, setSavings] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [incRes, expRes, invRes, savRes] = await Promise.all([
          api.get('/incomes'),
          api.get('/expenses'),
          api.get('/investments'),
          api.get('/savings')
        ]);
        setIncomes(incRes.data.data);
        setExpenses(expRes.data.data);
        setInvestments(invRes.data.data);
        setSavings(savRes.data.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filterByYear = (data) => data.filter(item => new Date(item.date).getFullYear() === selectedYear);

  const filteredIncomes = useMemo(() => filterByYear(incomes), [incomes, selectedYear]);
  const filteredExpenses = useMemo(() => filterByYear(expenses), [expenses, selectedYear]);
  const filteredInvestments = useMemo(() => filterByYear(investments), [investments, selectedYear]);
  const filteredSavings = useMemo(() => filterByYear(savings), [savings, selectedYear]);

  if (loading) return <div className="p-10 text-center text-gray-500">Loading Dashboard Data...</div>;

  const totalIncome = filteredIncomes.reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpense = Math.abs(filteredExpenses.reduce((acc, curr) => acc + curr.amount, 0));
  const totalInvestment = filteredInvestments.reduce((acc, curr) => acc + curr.amount, 0);
  const totalSaving = filteredSavings.reduce((acc, curr) => acc + curr.amount, 0);
  const netTotal = totalIncome - totalExpense;

  const outFlow = totalExpense + totalInvestment + totalSaving;
  const expPct = outFlow > 0 ? (totalExpense / outFlow * 100) : 0;
  const invPct = outFlow > 0 ? (totalInvestment / outFlow * 100) : 0;
  const savPct = outFlow > 0 ? (totalSaving / outFlow * 100) : 0;

  const getMonthlyTotal = (data, monthOffset = 0) => {
    const now = new Date();
    const targetDate = new Date(now.getFullYear(), now.getMonth() - monthOffset, 1);
    const targetMonth = targetDate.getMonth();
    const targetYear = targetDate.getFullYear();
    
    return data.filter(item => {
        const itemDate = new Date(item.date);
        return itemDate.getMonth() === targetMonth && itemDate.getFullYear() === targetYear;
    }).reduce((sum, item) => sum + Math.abs(item.amount), 0);
  };

  const calcTrend = (data) => {
      const currentM = getMonthlyTotal(data, 0);
      const lastM = getMonthlyTotal(data, 1);
      if(lastM === 0) return null; // No history to compare
      const pct = ((currentM - lastM) / lastM) * 100;
      return pct.toFixed(0); 
  };

  const incTrend = calcTrend(filteredIncomes);
  const expTrend = calcTrend(filteredExpenses);
  const invTrend = calcTrend(filteredInvestments);
  const savTrend = calcTrend(filteredSavings);

  const renderTrend = (trendStr) => {
      if (trendStr === null) return null;
      const val = parseInt(trendStr);
      const isPositive = val >= 0;
      const colorClass = isPositive ? "text-[#2ecc71]" : "text-[#e74c3c]";
      const arrowIcon = isPositive 
         ? <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
         : <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="17" y1="7" x2="7" y2="17"></line><polyline points="17 17 7 17 7 7"></polyline></svg>;
      
      return (
         <span className={`text-[11px] font-semibold flex items-center gap-1 ${colorClass}`}>
            {arrowIcon} {isPositive ? '+' : ''}{trendStr}% vs last month
         </span>
      );
  };

  const netCurrent = getMonthlyTotal(filteredIncomes, 0) - getMonthlyTotal(filteredExpenses, 0);
  const netLast = getMonthlyTotal(filteredIncomes, 1) - getMonthlyTotal(filteredExpenses, 1);
  let netTrend = null;
  if(netLast !== 0) {
      netTrend = (((netCurrent - netLast) / Math.abs(netLast)) * 100).toFixed(0);
  }

  return (
    <div className="w-full min-h-full px-8 lg:px-12 py-10 flex flex-col mx-auto max-w-[1000px]">
      

      <div className="flex items-center justify-between mb-8 z-20 relative">
        <h1 className="text-3xl font-[800] tracking-tight text-black">Summary</h1>
        
        <div className="relative">
            <button 
                onClick={() => setIsYearDropdownOpen(!isYearDropdownOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 hover:border-black rounded-xl text-[14px] font-[700] text-black transition-all shadow-sm focus:ring-2 focus:ring-black"
            >
                <CalendarDays size={16} className="text-gray-500" />
                {selectedYear}
                <ChevronDown size={16} className={`text-gray-400 transition-transform duration-200 ${isYearDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isYearDropdownOpen && (
                <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsYearDropdownOpen(false)}></div>
                    <div className="absolute right-0 top-[calc(100%+8px)] w-full min-w-[120px] bg-white border border-gray-100 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-1 z-20 flex flex-col transform opacity-100 scale-100 origin-top-right transition-all">
                        {[currentYear - 2, currentYear - 1, currentYear, currentYear + 1, currentYear + 2].map(year => (
                            <button 
                                key={year} 
                                onClick={() => {
                                    setSelectedYear(year);
                                    setIsYearDropdownOpen(false);
                                }}
                                className={`w-full text-left px-4 py-2.5 rounded-lg text-[13px] font-[700] transition-colors ${selectedYear === year ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-50 hover:text-black'}`}
                            >
                                {year}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>

      </div>

      <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-10 gap-8">
        
        <div className="flex flex-col">
          <span className="text-[13px] font-semibold text-gray-500 mb-1">Net Balance</span>
          <div className="flex items-baseline gap-2">
            <h2 className="text-[42px] leading-none font-[700] tracking-tighter text-black">₹{netTotal.toLocaleString(undefined, {minimumFractionDigits: 2})}</h2>
            {renderTrend(netTrend)}
          </div>
        </div>

        <div className="flex flex-col w-full lg:w-[45%]">
          
          <div className="flex justify-between w-full mb-3 text-[11px] font-bold text-gray-400 px-1">
             {expPct > 0 && <span className="text-[#e74c3c]">Exp {expPct.toFixed(0)}%</span>}
             {invPct > 0 && <span className="text-[#3498db]">Inv {invPct.toFixed(0)}%</span>}
             {savPct > 0 && <span className="text-[#f1c40f]">Sav {savPct.toFixed(0)}%</span>}
             {outFlow === 0 && <span>No Outflow Data</span>}
          </div>

          <div className="w-full h-[6px] rounded-full flex overflow-hidden bg-gray-100 gap-[2px]">
             {outFlow > 0 && (
                 <>
                     <div className="h-full bg-[#e74c3c]" style={{ width: `${expPct}%` }}></div>
                     <div className="h-full bg-[#3498db]" style={{ width: `${invPct}%` }}></div>
                     <div className="h-full bg-[#f1c40f]" style={{ width: `${savPct}%` }}></div>
                 </>
             )}
          </div>
        </div>

      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        <div className="flex flex-col border-t border-gray-100 pt-4">
           <span className="text-[12px] font-semibold text-[#2ecc71] mb-1">Income</span>
           <span className="text-[18px] font-[700] tracking-tight text-black mb-1">₹{totalIncome.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
           {renderTrend(incTrend)}
        </div>
        <div className="flex flex-col border-t border-gray-100 pt-4">
           <span className="text-[12px] font-semibold text-[#e74c3c] mb-1">Expenses</span>
           <span className="text-[18px] font-[700] tracking-tight text-black mb-1">₹{totalExpense.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
           {renderTrend(expTrend)}
        </div>
        <div className="flex flex-col border-t border-gray-100 pt-4">
           <span className="text-[12px] font-semibold text-[#3498db] mb-1">Investment</span>
           <span className="text-[18px] font-[700] tracking-tight text-black mb-1">₹{totalInvestment.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
           {renderTrend(invTrend)}
        </div>
        <div className="flex flex-col border-t border-gray-100 pt-4">
           <span className="text-[12px] font-semibold text-[#f1c40f] mb-1">Savings</span>
           <span className="text-[18px] font-[700] tracking-tight text-black mb-1">₹{totalSaving.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
           {renderTrend(savTrend)}
        </div>
      </div>
      
      <div className="flex justify-between items-end mb-8">
        <div onClick={() => navigate('/transactions')} className="cursor-pointer group flex items-center gap-2">
          <h3 className="text-[22px] font-[800] tracking-tight text-black mb-1 group-hover:text-gray-600 transition-colors">Transactions</h3>
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 group-hover:text-black transition-colors group-hover:translate-x-1"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
        </div>
      </div>

      <RecentCategories incomes={filteredIncomes} expenses={filteredExpenses} investments={filteredInvestments} savings={filteredSavings} hideHeader={true} limit={4} />

    </div>
  );
};

export default Dashboard;
