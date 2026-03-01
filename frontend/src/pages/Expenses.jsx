import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Plus } from 'lucide-react';
import api from '../utils/api';

const Expenses = () => {
    const [expenses, setExpenses] = useState([]);
    const [formData, setFormData] = useState({ title: '', amount: '', category: 'Groceries', date: '', description: '' });
    const navigate = useNavigate();

    useEffect(() => {
        fetchExpenses();
    }, []);

    const fetchExpenses = async () => {
        try {
            const res = await api.get('/expenses');
            setExpenses(res.data.data);
        } catch (error) {
            console.error("Error fetching expenses", error);
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            await api.post('/expenses', { ...formData, amount: Number(formData.amount) });
            setFormData({ title: '', amount: '', category: 'Groceries', date: '', description: '' });
            fetchExpenses();
        } catch (error) {
            console.error("Error adding expense", error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/expenses/${id}`);
            fetchExpenses();
        } catch (error) {
            console.error("Error deleting expense", error);
        }
    };

    const inputClasses = "w-full p-2.5 border-b border-gray-200 outline-none focus:border-black bg-transparent text-[13px] text-black font-medium transition-colors placeholder:text-gray-400";

    return (
        <div className="w-full min-h-full px-8 lg:px-12 py-10 flex flex-col mx-auto max-w-[1000px]">
            

            <div className="mb-12">
                <h1 className="text-3xl font-[800] tracking-tight text-black">Manage Expenses</h1>
            </div>

            <div className="flex flex-col lg:flex-row gap-16">
                
                <div className="w-full lg:min-w-[320px] lg:max-w-[350px]">
                    <h3 className="text-[14px] font-[700] mb-6 text-black uppercase tracking-wider">Add New Expense</h3>
                    <form onSubmit={handleAdd} className="flex flex-col gap-5">
                        <input type="text" placeholder="Expense Title" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className={inputClasses} />
                        <input type="number" placeholder="Amount" required value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} className={inputClasses} />
                        <input type="date" required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className={inputClasses} />
                        <select required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className={`${inputClasses} appearance-none`}>
                            <option value="Groceries">Groceries</option>
                            <option value="Health">Health</option>
                            <option value="Takeaways">Takeaways</option>
                            <option value="Clothing">Clothing</option>
                            <option value="Travelling">Travelling</option>
                            <option value="Other">Other</option>
                        </select>
                        <textarea placeholder="Add a Reference" required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className={`${inputClasses} resize-y min-h-[60px]`}></textarea>
                        
                        <button type="submit" className="flex items-center justify-center gap-2 w-full p-2.5 mt-4 bg-black text-white text-[13px] rounded-lg font-bold transition-colors hover:bg-gray-800">
                            <Plus size={16} strokeWidth={3} /> Submit Expense
                        </button>
                    </form>
                </div>

                <div className="flex-1 flex flex-col">
                    <h3 className="text-[14px] font-[700] mb-6 text-black uppercase tracking-wider">Recent Expenses</h3>
                    {expenses.length === 0 ? <p className="text-gray-400 italic text-[13px]">No Expenses added yet.</p> : null}
                    
                    <div className="flex flex-col">
                        {expenses.map(expense => (
                            <div key={expense._id} className="relative py-4 border-b border-gray-100 flex justify-between items-center group overflow-hidden">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-1">
                                        <h4 className="text-[14px] font-[700] text-black leading-none">{expense.title}</h4>
                                        <span className="text-[10px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{expense.category}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-[12px] text-gray-400 font-medium">
                                        <span>{new Date(expense.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>
                                        <span>&middot;</span>
                                        <span className="truncate max-w-[200px]">{expense.description}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="font-[700] text-[15px] text-black">-₹{expense.amount.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                                    <button onClick={() => handleDelete(expense._id)} className="text-gray-300 hover:text-red-500 transition-colors p-1" title="Delete">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Expenses;
