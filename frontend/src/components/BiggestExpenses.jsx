import React, { useMemo } from 'react';
import { ShoppingCart, Shirt, Camera, Store, Gift, Truck, HelpCircle } from 'lucide-react';

const CATEGORY_ICONS = {
  Groceries: { icon: <ShoppingCart size={24} strokeWidth={2.5} />, color: 'text-[#ff4757]' },
  Clothing: { icon: <Shirt size={24} fill="currentColor" />, color: 'text-[#1e90ff]' },
  Education: { icon: <Camera size={24} fill="currentColor" />, color: 'text-[#2ed573]' },
  Takeaways: { icon: <Store size={24} strokeWidth={2.5} />, color: 'text-[#ffa502]' },
  Health: { icon: <Gift size={24} fill="currentColor" />, color: 'text-[#00d2d3]' },
  Travelling: { icon: <Truck size={24} fill="currentColor" />, color: 'text-[#57606f]' },
  Subscriptions: { icon: <HelpCircle size={24} />, color: 'text-[#7bed9f]' },
  Other: { icon: <HelpCircle size={24} />, color: 'text-gray-400' },
};

const BiggestExpenses = ({ expenses }) => {
    const biggest = useMemo(() => {
        return [...expenses].sort((a,b) => b.amount - a.amount).slice(0, 6);
    }, [expenses]);

    if(biggest.length === 0) return <p className="text-gray-400 text-sm">No expenses yet.</p>

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 w-full">
            {biggest.map((exp) => {
                const mapKey = CATEGORY_ICONS[exp.category] || CATEGORY_ICONS['Other'];
                return (
                <div key={exp._id} className="bg-white rounded-[16px] p-4 pb-3 flex flex-col items-center justify-between min-h-[125px] flex-1 shadow-[0_2px_15px_rgba(0,0,0,0.03)] border border-gray-50 hover:-translate-y-1 transition-transform cursor-pointer group">
                    <div className={`mt-1 w-[46px] h-[46px] flex items-center justify-center ${mapKey.color} bg-opacity-10 rounded-[12px] shrink-0 group-hover:scale-105 transition-transform`}>
                        {mapKey.icon}
                    </div>
                    <div className="w-full text-left truncate mt-3">
                        <p className="text-[10px] font-semibold text-gray-400 truncate w-full mb-0.5 tracking-wide">{exp.title}</p>
                        <p className="font-bold text-[14px] text-gray-800">₹{exp.amount}</p>
                    </div>
                </div>
            )})}
        </div>
    );
};

export default BiggestExpenses;
