import React from 'react';

const DashboardMetrics = () => {
  return (
    <div className="metrics-summary">
      <div className="metric-item">
        <div className="shield-icon"></div>
        <h4>€ -24.500</h4>
        <p className="metric-label expenses">Expenses</p>
      </div>
      <div className="metric-item">
        <div className="info-icon"></div>
        <h4>€ 12.500</h4>
        <p className="metric-label exp-rev">Expenses & Revenues</p>
      </div>
      <div className="metric-item">
        <div className="check-icon"></div>
        <h4>€ 14.455</h4>
        <p className="metric-label revenues">Revenues</p>
      </div>
    </div>
  );
};

export default DashboardMetrics;
