import React from 'react';
import { Outlet } from 'react-router-dom';
import Topbar from './Topbar';

const MainLayout = () => {
  return (
    <div className="flex w-full h-screen bg-white overflow-hidden relative">
      {/* Foreground Content */}
      <div className="relative z-10 w-full h-full flex flex-col max-w-[1400px] mx-auto">
        <Topbar />
        <div className="flex-1 overflow-y-auto w-full custom-scrollbar">
            <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
