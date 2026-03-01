import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Plus } from 'lucide-react';
import api from '../utils/api';

const Investments = () => {
    const [investments, setInvestments] = useState([]);
    const [formData, setFormData] = useState({ title: '', amount: '', category: 'Stocks', date: '', description: '' });
    const navigate = useNavigate();

    useEffect(() => {
        fetchInvestments();
    }, []);

    const fetchInvestments = async () => {
        try {
            const res = await api.get('/investments');
            setInvestments(res.data.data);
        } catch (error) {
            console.error("Error fetching investments", error);
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            await api.post('/investments', { ...formData, amount: Number(formData.amount) });
            setFormData({ title: '', amount: '', category: 'Stocks', date: '', description: '' });
            fetchInvestments();
        } catch (error) {
            console.error("Error adding investment", error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/investments/${id}`);
            fetchInvestments();
        } catch (error) {
            console.error("Error deleting investment", error);
        }
    };

    const inputClasses = "w-full p-2.5 border-b border-gray-200 outline-none focus:border-black bg-transparent text-[13px] text-black font-medium transition-colors placeholder:text-gray-400";

    return (
        <div className="w-full min-h-full px-5 lg:px-12 py-10 flex flex-col mx-auto max-w-[1000px]">
            

            <div className="mb-12">
                <h1 className="text-3xl font-[800] tracking-tight text-black">Manage Investments</h1>
            </div>

            <div className="flex flex-col lg:flex-row gap-16">
                
                <div className="w-full lg:min-w-[320px] lg:max-w-[350px]">
                    <h3 className="text-[14px] font-[700] mb-6 text-black uppercase tracking-wider">Add New Investment</h3>
                    <form onSubmit={handleAdd} className="flex flex-col gap-5">
                        <input type="text" placeholder="Investment Title" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className={inputClasses} />
                        <input type="number" placeholder="Amount" required value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} className={inputClasses} />
                        <input type="date" required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className={inputClasses} />
                        <select required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className={`${inputClasses} appearance-none`}>
                            <option value="Stocks">Stocks</option>
                            <option value="Crypto">Crypto</option>
                            <option value="Real Estate">Real Estate</option>
                            <option value="Mutual Funds">Mutual Funds</option>
                            <option value="Other">Other</option>
                        </select>
                        <textarea placeholder="Add a Reference" required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className={`${inputClasses} resize-y min-h-[60px]`}></textarea>
                        
                        <button type="submit" className="flex items-center justify-center gap-2 w-full p-2.5 mt-4 bg-black text-white text-[13px] rounded-lg font-bold transition-colors hover:bg-gray-800">
                            <Plus size={16} strokeWidth={3} /> Submit Investment
                        </button>
                    </form>
                </div>

                <div className="flex-1 flex flex-col">
                    <h3 className="text-[14px] font-[700] mb-6 text-black uppercase tracking-wider">Recent Investments</h3>
                    {investments.length === 0 ? <p className="text-gray-400 italic text-[13px]">No Investments added yet.</p> : null}
                    
                    <div className="flex flex-col">
                        {investments.map(investment => (
                            <div key={investment._id} className="relative py-4 border-b border-gray-100 flex justify-between items-center group overflow-hidden">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-1">
                                        <h4 className="text-[14px] font-[700] text-black leading-none">{investment.title}</h4>
                                        <span className="text-[10px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{investment.category}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-[12px] text-gray-400 font-medium">
                                        <span>{new Date(investment.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>
                                        <span>&middot;</span>
                                        <span className="truncate max-w-[200px]">{investment.description}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="font-[700] text-[15px] text-[#3498db]">+₹{investment.amount.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                                    <button onClick={() => handleDelete(investment._id)} className="text-gray-300 hover:text-red-500 transition-colors p-1" title="Delete">
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

export default Investments;
