import React from 'react';
import { Wallet, Calendar as CalendarIcon, ChevronDown } from 'lucide-react';
import DashboardMetrics from '../components/DashboardMetrics';
import DashboardCharts from '../components/DashboardCharts';
import BiggestExpenses from '../components/BiggestExpenses';
import RecentCategories from '../components/RecentCategories';
import StaticCalendar from '../components/StaticCalendar';

const Dashboard = () => {
  return (
    <div className="dashboard-grid">
      {/* Main Panel (Left) */}
      <div className="main-panel">
        
        {/* Wallet Header */}
        <div className="panel-header">
          <div className="wallet-info">
            <div className="wallet-icon">
              <Wallet size={24} />
            </div>
            <div className="wallet-text">
              <h3>Home Wallet</h3>
              <p>Manage default wallet</p>
            </div>
          </div>
          <div className="date-selector">
            <CalendarIcon size={16} />
            <span>Calendar</span>
            <ChevronDown size={16} />
          </div>
        </div>

        {/* Metrics & Charts Card */}
        <div className="metrics-card">
          <DashboardMetrics />
          <DashboardCharts />
        </div>

        {/* Categories Section */}
        <div className="categories-card">
            <h3>Categories with Biggest Expense</h3>
            <BiggestExpenses />
        </div>

      </div>

      {/* Side Panel (Right) */}
      <div className="side-panel">
        
        {/* Recent Categories List */}
        <div className="categories-list-box">
          <h3>Categories</h3>
          <RecentCategories />
        </div>

        {/* Calendar Widget */}
        <div className="calendar-box">
          <h3>Calendar</h3>
          <StaticCalendar />
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
