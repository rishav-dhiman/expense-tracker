import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Wallet, Receipt, LogOut } from 'lucide-react';

const Sidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="logo-icon"></div>
        <h2>Budget</h2>
      </div>
      <nav className="sidebar-nav">
        <ul>
          <li>
            <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')}>
              <LayoutDashboard size={20} />
              <span>Overview</span>
            </NavLink>
          </li>
          {/* We will add Incomes and Expenses routes back soon */}
          <li>
            <NavLink to="/incomes" className={({ isActive }) => (isActive ? 'active' : '')}>
              <Wallet size={20} />
              <span>Incomes</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/expenses" className={({ isActive }) => (isActive ? 'active' : '')}>
              <Receipt size={20} />
              <span>Expenses</span>
            </NavLink>
          </li>
        </ul>
      </nav>
      <div className="sidebar-footer">
        <button onClick={handleLogout} className="logout-btn">
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
