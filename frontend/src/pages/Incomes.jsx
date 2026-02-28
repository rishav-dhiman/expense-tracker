import React, { useState, useEffect } from 'react';
import { Download, Trash2, Plus } from 'lucide-react';
import api from '../utils/api';
import * as XLSX from 'xlsx';

const Incomes = () => {
    const [incomes, setIncomes] = useState([]);
    const [formData, setFormData] = useState({ title: '', amount: '', category: 'Salary', date: '', description: '' });

    useEffect(() => {
        fetchIncomes();
    }, []);

    const fetchIncomes = async () => {
        try {
            const res = await api.get('/incomes');
            setIncomes(res.data.data);
        } catch (error) {
            console.error("Error fetching incomes", error);
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            await api.post('/incomes', { ...formData, amount: Number(formData.amount) });
            setFormData({ title: '', amount: '', category: 'Salary', date: '', description: '' });
            fetchIncomes();
        } catch (error) {
            console.error("Error adding income", error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/incomes/${id}`);
            fetchIncomes();
        } catch (error) {
            console.error("Error deleting income", error);
        }
    };

    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(incomes.map(inc => ({
            Title: inc.title,
            Amount: inc.amount,
            Category: inc.category,
            Date: new Date(inc.date).toLocaleDateString(),
            Description: inc.description
        })));
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Incomes");
        XLSX.writeFile(workbook, "Income_Report.xlsx");
    };

    return (
        <div className="data-page">
            <div className="page-header">
                <h2>Manage Incomes</h2>
                <button onClick={exportToExcel} className="export-btn">
                    <Download size={18} /> Export Excel
                </button>
            </div>

            <div className="data-layout">
                <div className="form-container">
                    <h3>Add New Income</h3>
                    <form onSubmit={handleAdd}>
                        <input type="text" placeholder="Salary Title" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                        <input type="number" placeholder="Amount" required value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} />
                        <input type="date" required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
                        <select required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                            <option value="Salary">Salary</option>
                            <option value="Freelancing">Freelancing</option>
                            <option value="Investments">Investments</option>
                            <option value="Bank">Bank Interest</option>
                            <option value="Other">Other</option>
                        </select>
                        <textarea placeholder="Add a Reference" required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
                        <button type="submit" className="add-btn"><Plus size={18}/> Add Income</button>
                    </form>
                </div>

                <div className="list-container">
                    {incomes.length === 0 ? <p className="no-data">No Incomes added yet.</p> : null}
                    {incomes.map(income => (
                        <div key={income._id} className="data-card group">
                            <div className="data-info">
                                <h4>{income.title}</h4>
                                <div className="data-meta">
                                    <span>${income.amount}</span>
                                    <span>{new Date(income.date).toLocaleDateString()}</span>
                                    <span>{income.category}</span>
                                    <span>{income.description}</span>
                                </div>
                            </div>
                            <button onClick={() => handleDelete(income._id)} className="delete-hover-btn">
                                <Trash2 size={18} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Incomes;
