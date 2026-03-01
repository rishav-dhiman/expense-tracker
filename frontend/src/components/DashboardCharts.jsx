import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { DollarSign, Shield, ShieldAlert, CircleDollarSign } from 'lucide-react';

const DashboardCharts = ({ incomes, expenses }) => {

  const totalIncome = incomes.reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpense = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const balance = totalIncome - totalExpense;

  const monthlyData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = new Date().getMonth();
    
    const last6Months = [];
    for (let i = 5; i >= 0; i--) {
        let d = new Date();
        d.setMonth(currentMonth - i);
        last6Months.push({ name: months[d.getMonth()], value: 0, monthNum: d.getMonth(), year: d.getFullYear() });
    }

    expenses.forEach(exp => {
        const d = new Date(exp.date);
        const match = last6Months.find(m => m.monthNum === d.getMonth() && m.year === d.getFullYear());
        if (match) match.value += exp.amount;
    });
    
    return last6Months;
  }, [expenses]);

  const currentMonthName = monthlyData.length > 0 ? monthlyData[monthlyData.length - 1].name : '';

  const donutData = useMemo(() => {
     const spent = totalExpense;
     const remaining = Math.max(0, totalIncome - spent);
     return [
       { name: 'Spent', value: spent },
       { name: 'Remaining', value: remaining }
     ];
  }, [totalIncome, totalExpense]);

  const hasDataForPie = totalIncome > 0 || totalExpense > 0;
  const safePieData = hasDataForPie ? donutData : [{ name: 'Empty', value: 1 }];

  const CustomBar = (props) => {
    const { fill, x, y, width, height, name } = props;
    const isCurrent = name === currentMonthName;
    return <rect x={x} y={y} width={width} height={height} fill={isCurrent ? '#007bff' : '#007bff'} opacity={isCurrent ? 1 : 0.6} rx={4} ry={4} />;
  };

  return (
    <div className="flex flex-col lg:flex-row h-full w-full">
      
      <div className="flex-[2] flex flex-col pr-8 lg:border-r border-dashed border-gray-200 min-w-0">
        
        <div className="flex justify-between items-center mb-8 px-4">
          
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center mb-2 relative text-[#ff4d4f]">
              <Shield size={22} fill="currentColor" strokeWidth={0} />
              <DollarSign size={11} strokeWidth={4} color="white" className="absolute top-[8px]" />
            </div>
            <h4 className="text-[17px] font-bold text-gray-900 tracking-tight leading-none mb-1">
              ₹ - {totalExpense.toLocaleString()}
            </h4>
            <p className="text-[11px] font-semibold text-[#ff4d4f]">Expenses</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center mb-2 relative text-[#3498db]">
              <Shield size={22} fill="currentColor" strokeWidth={0} />
              <DollarSign size={11} strokeWidth={4} color="white" className="absolute top-[8px]" />
            </div>
            <h4 className="text-[17px] font-bold text-gray-900 tracking-tight leading-none mb-1">
              ₹ {balance.toLocaleString()}
            </h4>
            <p className="text-[11px] font-semibold text-[#3498db]">Expense & Revenues</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center mb-2 relative text-[#2ecc71]">
               <Shield size={22} fill="currentColor" strokeWidth={0} />
               <DollarSign size={11} strokeWidth={4} color="white" className="absolute top-[8px]" />
            </div>
            <h4 className="text-[17px] font-bold text-gray-900 tracking-tight leading-none mb-1">
              ₹ {totalIncome.toLocaleString()}
            </h4>
            <p className="text-[11px] font-semibold text-[#2ecc71]">Revenues</p>
          </div>
          
        </div>

        <div className="flex-1 w-full min-w-0 h-[220px]">
          <ResponsiveContainer width="99%" height="100%" minHeight={220} minWidth={0}>
            <BarChart data={monthlyData} margin={{top: 10, right: 10, left: -20, bottom: 0}}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#a0a0a0', fontSize: 10, fontWeight: 500}} dy={10} />
              <Tooltip cursor={{fill: 'transparent'}} formatter={(value) => `₹${value}`} contentStyle={{borderRadius: '10px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.1)'}} />
              <Bar dataKey="value" barSize={12} radius={[4, 4, 4, 4]} fill="#007bff" />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>

      <div className="flex-1 flex flex-col pl-8 min-w-0 relative">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Budget</h3>
        
        <div className="relative flex-1 w-full min-h-[200px] flex items-center justify-center">
            <ResponsiveContainer width="99%" height="100%" minHeight={200} minWidth={0}>
            <PieChart>
                <Pie
                data={safePieData}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={95}
                fill="#f4f4f5"
                paddingAngle={0}
                cornerRadius={40}
                dataKey="value"
                stroke="none"
                >
                <Cell key="cell-0" fill={hasDataForPie ? '#ff8a65' : '#f4f4f5'} />
                <Cell key="cell-1" fill="#f4f4f5" />
                </Pie>
            </PieChart>
            </ResponsiveContainer>
            
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-4">
                <span className="font-bold text-[22px] text-gray-900 leading-none mb-1">
                  ₹{totalExpense.toLocaleString()}
                </span>
                <span className="text-[12px] text-[#fd7e14] font-semibold">Spent</span>
            </div>
        </div>

        <div className="flex justify-between w-full mt-4 px-2">
            <div className="flex flex-col">
                <h4 className="text-[15px] font-bold text-gray-900 mb-1 leading-none">₹{totalIncome.toLocaleString()}</h4>
                <p className="text-[10px] font-semibold text-gray-400 capitalize tracking-wide">Monthly Limit</p>
            </div>
            <div className="flex flex-col items-end">
                <h4 className="text-[15px] font-bold text-gray-900 mb-1 leading-none">₹{Math.max(0, totalIncome - totalExpense).toLocaleString()}</h4>
                <p className="text-[10px] font-semibold text-gray-400 capitalize tracking-wide">Remaining</p>
            </div>
        </div>
      </div>

    </div>
  );
};

export default DashboardCharts;
