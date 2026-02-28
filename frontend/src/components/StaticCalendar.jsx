import React from 'react';

const StaticCalendar = () => {
    // Generate simple array for days 1-31
    const days = Array.from({length: 31}, (_, i) => i + 1);
    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    return (
        <div className="calendar-widget">
            <div className="calendar-header">
                {dayNames.map(day => <div key={day} className="cal-day-name">{day}</div>)}
            </div>
            <div className="calendar-grid">
                {/* Empty slots for visual offset */}
                <div className="cal-day empty"></div>
                <div className="cal-day empty"></div>
                {days.map(day => (
                    <div key={day} className={`cal-day ${day === 15 ? 'active' : ''}`}>
                        {day}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StaticCalendar;
