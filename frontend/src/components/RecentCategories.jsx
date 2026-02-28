import React from 'react';
import { Package, Shirt, Camera, Sofa, Tag, Map } from 'lucide-react';

const RecentCategories = () => {
    const categories = [
        { name: 'Home Loan', amount: 368.00, date: '19 April', icon: <Sofa size={24} />, color: '#9b59b6' },
        { name: 'Earphone', amount: 250.00, date: '21 April', icon: <Package size={24} />, color: '#fd7e14' },
        { name: 'Camera', amount: 650.00, date: '01 May', icon: <Camera size={24} />, color: '#f1c40f' },
    ];

    return (
        <div className="recent-categories">
            {categories.map((cat, index) => (
                <div key={index} className="category-list-item">
                    <div className="cat-icon-lg" style={{backgroundColor: cat.color}}>
                        {cat.icon}
                    </div>
                    <div className="cat-details">
                        <h4>{cat.name}</h4>
                        <p>{cat.date}</p>
                    </div>
                    <div className="cat-amount">
                        ${cat.amount.toFixed(2)}
                    </div>
                </div>
            ))}
            <button className="add-new-btn">
                <div className="add-icon">+</div>
                <span>Add New</span>
            </button>
        </div>
    );
};

export default RecentCategories;
