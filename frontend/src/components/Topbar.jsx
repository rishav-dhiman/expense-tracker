import React from 'react';
import { Search, Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Topbar = () => {
  const { user } = useAuth();

  return (
    <div className="topbar">
      <div className="search-bar">
        <Search size={18} className="search-icon" />
        <input type="text" placeholder="Search..." />
      </div>
      <div className="top-nav-links">
        <span>Overview</span>
        <span>Finance</span>
        <span>Calendar</span>
        <span>Events</span>
      </div>
      <div className="user-profile">
        <Bell size={20} className="bell-icon" />
        <div className="avatar">
           {user?.name?.charAt(0) || 'U'}
        </div>
      </div>
    </div>
  );
};

export default Topbar;
