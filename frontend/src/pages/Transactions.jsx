import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RecentCategories from '../components/RecentCategories';
import api from '../utils/api';

const Transactions = () => {
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [investments, setInvestments] = useState([]);
  const [savings, setSavings] = useState([]);
  const [loading, setLoading] = useState(true);
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
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="p-10 text-center text-gray-500">Loading Transactions...</div>;

  return (
    <div className="w-full min-h-screen px-8 lg:px-12 py-10 flex flex-col mx-auto max-w-[1000px]">
      

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-[28px] font-[800] tracking-tight text-black mb-1">All Transactions</h1>
          <p className="text-[13px] font-medium text-gray-400">Complete history of your financial activity</p>
        </div>
      </div>

      <div className="w-full">
         <RecentCategories incomes={incomes} expenses={expenses} investments={investments} savings={savings} hideHeader={true} limit={null} />
      </div>

    </div>
  );
};

export default Transactions;
