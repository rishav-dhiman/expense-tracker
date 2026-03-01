import React from 'react';

const StaticCalendar = () => {
    const days = Array.from({length: 30}, (_, i) => i + 1);
    const dayNames = ['Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun'];

    // Map of dates to their under-dot colors matching the reference
    // Red: 9, 13
    // Green: 11, 14, 23
    // Blue: 26
    const dots = {
        9: 'bg-[#ff4d4f]',
        13: 'bg-[#ff4d4f]',
        11: 'bg-[#28c76f]',
        14: 'bg-[#28c76f]',
        23: 'bg-[#28c76f]',
        26: 'bg-[#00cfe8]'
    };

    return (
        <div className="w-full mt-1">
            {/* Headers */}
            <div className="grid grid-cols-7 mb-3 pb-1">
                {dayNames.map(day => (
                    <div key={day} className="text-gray-400 text-[11px] font-semibold text-center">
                        {day}
                    </div>
                ))}
            </div>
            
            {/* Grid */}
            <div className="grid grid-cols-7 gap-y-4">
                {/* 31st of previous month */}
                <div className="flex flex-col items-center justify-start text-sm font-semibold text-gray-300 relative h-6">
                    31
                </div>
                
                {days.map(day => {
                    const dotColor = dots[day];
                    return (
                        <div key={day} className="flex flex-col items-center justify-start text-[14px] font-bold text-gray-800 relative h-6 cursor-pointer hover:text-blue-500 transition-colors">
                            {day}
                            {dotColor && (
                                <span className={`absolute -bottom-2 w-1 h-1 rounded-full ${dotColor}`}></span>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default StaticCalendar;
