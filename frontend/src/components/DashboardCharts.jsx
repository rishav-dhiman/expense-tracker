import React from 'react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const dataBar = [
  { name: 'Apr', value: 10 },
  { name: 'May', value: 20 },
  { name: 'Jun', value: 25 },
  { name: 'Jul', value: 35 },
  { name: 'Aug', value: 18 },
  { name: 'Sep', value: 25 },
  { name: 'Oct', value: 10 },
];

const dataPie = [
  { name: 'Spent', value: 34500 },
  { name: 'Remaining', value: 3000 },
];
const COLORS = ['#fd7e14', '#f0f0f0'];

const DashboardCharts = () => {
  return (
    <div className="charts-container">
      {/* Bar Chart Section */}
      <div className="bar-chart-wrapper">
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={dataBar}>
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} />
            <Tooltip cursor={{fill: 'transparent'}} />
            <Bar dataKey="value" fill="#3498db" radius={[4, 4, 4, 4]} barSize={12} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Donut Chart Section */}
      <div className="pie-chart-wrapper">
        <div className="pie-chart-header">
           <h3 style={{margin: 0, border: 'none', padding: 0}}>Budget</h3>
        </div>
        <div style={{position: 'relative', height: '180px'}}>
            <ResponsiveContainer width="100%" height="100%">
            <PieChart>
                <Pie
                data={dataPie}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={70}
                fill="#8884d8"
                paddingAngle={0}
                dataKey="value"
                stroke="none"
                >
                {dataPie.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
                </Pie>
            </PieChart>
            </ResponsiveContainer>
            <div className="pie-center-text">
                <span className="amount">$34,500</span>
                <span className="label">Spent</span>
            </div>
        </div>
        <div className="pie-legend">
            <div>
                <h4>$35000</h4>
                <p>Monthly Limit</p>
            </div>
            <div>
                <h4>$3000</h4>
                <p>Remaining</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardCharts;
