import React from 'react';
import { Package, Shirt, Camera, Sofa, Tag, Map } from 'lucide-react';

const BiggestExpenses = () => {
    const expenses = [
        { name: 'PharmaPlus', category: 'Health', icon: <Package size={20} />, color: '#e91e63' },
        { name: 'Hortman Shoes', category: 'Shoes', icon: <Shirt size={20} />, color: '#2196f3' },
        { name: 'Canon Camera', category: 'Device', icon: <Camera size={20} />, color: '#4caf50' },
        { name: 'Home Loan', category: 'Finance', icon: <Sofa size={20} />, color: '#ff9800' },
        { name: 'Grocery Cart', category: 'Groceries', icon: <Tag size={20} />, color: '#00bcd4' },
    ];

    return (
        <div className="biggest-expenses-container">
            {expenses.map((exp, index) => (
                <div key={index} className="biggest-expense-card">
                    <div className="cat-icon-sm" style={{color: exp.color}}>
                        {exp.icon}
                    </div>
                    <h5>{exp.name}</h5>
                    <p>{exp.category}</p>
                </div>
            ))}
        </div>
    );
};

export default BiggestExpenses;
