import React, { useMemo, useState, useRef, useEffect } from 'react';
import { ShoppingCart, Shirt, Camera, Store, Gift, Truck, HelpCircle, ArrowLeft, ArrowRight, Plus, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const CATEGORY_ICONS = {
  Health: { icon: <Gift size={15} strokeWidth={2.5} /> },
  Clothing: { icon: <Shirt size={15} strokeWidth={2.5} /> },
  Groceries: { icon: <ShoppingCart size={15} strokeWidth={2.5} /> },
  Takeaways: { icon: <Store size={15} strokeWidth={2.5} /> },
  Travelling: { icon: <Truck size={15} strokeWidth={2.5} /> },
  Education: { icon: <Camera size={15} strokeWidth={2.5} /> },
  Salary: { icon: <ArrowLeft size={15} strokeWidth={2.5} /> },
  EmergencyFund: { icon: <Store size={15} strokeWidth={2.5} /> },
  Stocks: { icon: <ShoppingCart size={15} strokeWidth={2.5} /> },
  Other: { icon: <HelpCircle size={15} strokeWidth={2.5} /> },
};

const RecentCategories = ({ incomes = [], expenses = [], investments = [], savings = [], hideHeader, limit, onDeleteSuccess }) => {
    const navigate = useNavigate();
    const [openMenuId, setOpenMenuId] = useState(null);
    const menuRef = useRef(null);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setOpenMenuId(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const allItems = useMemo(() => {
        const all = [
            ...incomes.map(i => ({...i, type: 'income'})),
            ...expenses.map(e => ({...e, type: 'expense'})),
            ...investments.map(i => ({...i, type: 'investment'})),
            ...savings.map(s => ({...s, type: 'saving'}))
        ];

        // Helper to convert arbitrary date strings to reliable timestamps
        const parseDateString = (dateStr) => {
            if (!dateStr) return 0;
            // Native ISO
            let d = new Date(dateStr);
            if (!isNaN(d.getTime())) return d.getTime();
            
            // Handle DD/MM/YYYY
            const parts = dateStr.split('/');
            if (parts.length === 3) {
                 d = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
                 if (!isNaN(d.getTime())) return d.getTime();
            }
            return 0;
        };

        return all.sort((a, b) => {
            const timeA = parseDateString(a.date);
            const timeB = parseDateString(b.date);
            const diff = timeB - timeA;
            
            if (diff === 0) {
                // Fallback to strict DB creation timestamp if user dates match
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            }
            return diff;
        });
    }, [incomes, expenses, investments, savings]);

    const handleDelete = async (e, id, type) => {
        e.stopPropagation();
        try {
            await api.delete(`/${type}s/${id}`);
            setOpenMenuId(null);
            if (onDeleteSuccess) {
                onDeleteSuccess();
            }
        } catch (error) {
            console.error('Error deleting transaction:', error);
        }
    };

    const recent = limit ? allItems.slice(0, limit) : allItems;

    if(recent.length === 0) return <p className="text-gray-400 text-sm mb-4">No transactions yet.</p>

    return (
        <div className="flex flex-col w-full">
            {recent.map((item) => {
                const rawCategory = item.category ? item.category.replace(/\s+/g, '') : 'Other';
                const mapKey = CATEGORY_ICONS[rawCategory] || CATEGORY_ICONS['Other'];
                
                const isExpense = item.type === 'expense';
                const sign = isExpense ? '-' : '+';
                
                let textColor = 'text-black';
                let iconColor = '#e74c3c';
                let polyline = <polyline points="19 12 12 5 5 12"></polyline>;

                if (item.type === 'income') {
                    textColor = 'text-[#2ecc71]';
                    iconColor = '#2ecc71';
                    polyline = <polyline points="19 12 12 19 5 12"></polyline>;
                } else if (item.type === 'investment') {
                    textColor = 'text-[#3498db]';
                    iconColor = '#3498db';
                    polyline = <polyline points="19 12 12 19 5 12"></polyline>;
                } else if (item.type === 'saving') {
                    textColor = 'text-[#f1c40f]';
                    iconColor = '#f1c40f';
                    polyline = <polyline points="19 12 12 19 5 12"></polyline>;
                }

                return (
                <div key={item._id} className="flex items-center justify-between py-4 border-b border-gray-100 group cursor-default hover:bg-gray-50/50 transition-colors mx-[-16px] px-[16px]">
                    
                    <div className="flex items-center gap-6 w-1/3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                            {polyline}
                            <line x1="12" y1="19" x2="12" y2="5"></line>
                        </svg>
                        <h4 className="text-[14px] font-[600] text-black m-0 leading-none">{item.title}</h4>
                    </div>

                    <div className="flex items-center w-1/3 justify-start">
                        <div className="flex items-center gap-2 border border-gray-200 px-3 py-1.5 rounded-full bg-white shadow-sm shadow-gray-100/50">
                            <span className="text-gray-500">{mapKey.icon}</span>
                            <span className="text-[12px] font-semibold text-gray-700">{item.category}</span>
                        </div>
                    </div>

                    <div className="flex items-center justify-end w-1/3 gap-4 relative" ref={openMenuId === item._id ? menuRef : null}>
                        <div className={`font-[700] text-[15px] ${textColor}`}>
                            {sign}₹{item.amount.toLocaleString(undefined, {minimumFractionDigits: 2})}
                        </div>
                        
                        {openMenuId === item._id ? (
                            <button 
                                onClick={(e) => handleDelete(e, item._id, item.type)}
                                className="px-2.5 py-1.5 rounded-lg text-red-600 bg-red-50 hover:bg-red-100 transition-colors flex items-center gap-1.5 cursor-pointer border border-red-100 shadow-sm"
                            >
                                <Trash2 size={14} strokeWidth={2.5} />
                                <span className="text-[12px] font-[700]">Delete</span>
                            </button>
                        ) : (
                            <div 
                               onClick={(e) => { e.stopPropagation(); setOpenMenuId(item._id); }}
                               className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-black transition-all cursor-pointer p-1.5 rounded-md hover:bg-gray-100"
                            >
                                 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
                            </div>
                        )}
                    </div>
                </div>
            )})}
            
            {(limit && allItems.length > limit) && (
                <button 
                  onClick={() => navigate('/transactions')}
                  className="mt-6 text-[13px] font-[700] text-gray-500 hover:text-black transition-colors self-start flex items-center gap-1 group"
                >
                    Load More 
                    <ArrowRight size={14} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
                </button>
            )}
        </div>
    );
};

export default RecentCategories;
