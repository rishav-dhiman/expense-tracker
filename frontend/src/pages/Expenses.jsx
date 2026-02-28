import React, { useState, useEffect } from 'react';
import { Download, Trash2, Plus } from 'lucide-react';
import api from '../utils/api';
import * as XLSX from 'xlsx';

const Expenses = () => {
    const [expenses, setExpenses] = useState([]);
    const [formData, setFormData] = useState({ title: '', amount: '', category: 'Groceries', date: '', description: '' });

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

    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(expenses.map(exp => ({
            Title: exp.title,
            Amount: exp.amount,
            Category: exp.category,
            Date: new Date(exp.date).toLocaleDateString(),
            Description: exp.description
        })));
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Expenses");
        XLSX.writeFile(workbook, "Expense_Report.xlsx");
    };

    return (
        <div className="data-page">
            <div className="page-header">
                <h2>Manage Expenses</h2>
                <button onClick={exportToExcel} className="export-btn">
                    <Download size={18} /> Export Excel
                </button>
            </div>

            <div className="data-layout">
                <div className="form-container">
                    <h3>Add New Expense</h3>
                    <form onSubmit={handleAdd}>
                        <input type="text" placeholder="Expense Title" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                        <input type="number" placeholder="Amount" required value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} />
                        <input type="date" required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
                        <select required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                            <option value="Groceries">Groceries</option>
                            <option value="Health">Health</option>
                            <option value="Takeaways">Takeaways</option>
                            <option value="Clothing">Clothing</option>
                            <option value="Travelling">Travelling</option>
                            <option value="Other">Other</option>
                        </select>
                        <textarea placeholder="Add a Reference" required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
                        <button type="submit" className="add-btn expense-btn"><Plus size={18}/> Add Expense</button>
                    </form>
                </div>

                <div className="list-container">
                    {expenses.length === 0 ? <p className="no-data">No Expenses added yet.</p> : null}
                    {expenses.map(expense => (
                        <div key={expense._id} className="data-card group">
                            <div className="data-info">
                                <h4>{expense.title}</h4>
                                <div className="data-meta">
                                    <span>${expense.amount}</span>
                                    <span>{new Date(expense.date).toLocaleDateString()}</span>
                                    <span>{expense.category}</span>
                                    <span>{expense.description}</span>
                                </div>
                            </div>
                            <button onClick={() => handleDelete(expense._id)} className="delete-hover-btn">
                                <Trash2 size={18} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Expenses;
