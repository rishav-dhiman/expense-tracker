import React, { useState, useEffect } from 'react';
import { Search, Bell, LogOut, X, User as UserIcon, LayoutDashboard, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';

const Topbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate('/login');
  };

  const navLinkClass = ({ isActive }) => 
    `pb-[6px] transition-all border-b-2 font-bold ${isActive ? 'text-black border-black scale-105' : 'text-gray-400 border-transparent hover:text-black hover:border-gray-300'}`;

  return (
    <>
      <div className="w-full flex items-center justify-between px-8 py-4 bg-white/80 backdrop-blur-md border-b border-gray-100 z-30 sticky top-0">
        
        {/* Left section: Logo & Navigation */}
        <div className="flex items-center gap-10">
          <div onClick={() => navigate('/')} className="flex items-center gap-2 cursor-pointer pt-1 transition-transform hover:scale-105 active:scale-95">
            <div className="w-5 h-5 shrink-0 bg-black rounded-full" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 100%)' }}></div>
            <span className="text-xl font-[800] tracking-tighter text-black">Budget</span>
          </div>
          
          <nav className="hidden lg:flex items-center gap-6 text-[14px] mt-1.5 pt-1">
            <NavLink to="/" className={navLinkClass}>Overview</NavLink>
            <NavLink to="/transactions" className={navLinkClass}>Transactions</NavLink>
            <NavLink to="/incomes" className={navLinkClass}>Incomes</NavLink>
            <NavLink to="/expenses" className={navLinkClass}>Expenses</NavLink>
            <NavLink to="/investments" className={navLinkClass}>Investments</NavLink>
            <NavLink to="/savings" className={navLinkClass}>Savings</NavLink>
          </nav>
        </div>

        {/* Right section: Profile & Mobile Menu Trigger */}
        <div className="flex items-center justify-end gap-5">
          <div onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden flex flex-col justify-center items-center w-8 h-8 cursor-pointer gap-1.5 z-50">
             <div className={`w-5 h-0.5 bg-black rounded-full transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></div>
             <div className={`w-5 h-0.5 bg-black rounded-full transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></div>
             <div className={`w-5 h-0.5 bg-black rounded-full transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></div>
          </div>
          <div onClick={() => setIsMenuOpen(true)} className="w-9 h-9 relative rounded-full overflow-hidden cursor-pointer ring-2 ring-transparent hover:ring-gray-200 transition-all shadow-sm">
             <img src={`https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=111111&color=fff&bold=true`} alt="Profile" className="w-full h-full object-cover grayscale opacity-80 hover:opacity-100 transition-opacity" />
          </div>
        </div>
      </div>

      {/* Slide Menu Overlay Backdrop */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Slide Menu Drawer */}
      <div className={`fixed top-0 right-0 h-full w-[300px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
         
         <div className="flex justify-between items-center p-6 border-b border-gray-100">
            <h2 className="text-[17px] font-[800] text-black tracking-tight">Profile</h2>
            <button onClick={() => setIsMenuOpen(false)} className="p-1 rounded-full text-gray-400 hover:text-black hover:bg-gray-100 transition-colors">
               <X size={20} className="stroke-[2.5px]" />
            </button>
         </div>

         <div className="p-6 flex flex-col items-center border-b border-gray-100">
             <div className="w-20 h-20 rounded-full overflow-hidden mb-4 shadow-md ring-4 ring-gray-50">
                <img src={`https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=111111&color=fff&bold=true`} alt="Profile" className="w-full h-full object-cover grayscale" />
             </div>
             <h3 className="text-[18px] font-[800] text-black leading-tight tracking-tight">{user?.name}</h3>
             <p className="text-[13px] font-medium text-gray-500 mt-1">{user?.email}</p>
         </div>

         <div className="p-6 flex flex-col gap-3">
            <button 
                onClick={() => navigate('/account')} 
                className="flex items-center gap-3 w-full px-4 py-3 bg-white border border-gray-200 hover:border-black rounded-xl transition-all shadow-sm group"
            >
                <div className="text-gray-500 group-hover:text-black transition-colors">
                    <UserIcon size={18} className="stroke-[2.5px]" />
                </div>
                <span className="font-[700] text-[14px] text-black">Account</span>
            </button>
            
            <button 
                onClick={() => navigate('/')} 
                className="flex items-center gap-3 w-full px-4 py-3 bg-white border border-gray-200 hover:border-black rounded-xl transition-all shadow-sm group"
            >
                <div className="text-gray-500 group-hover:text-black transition-colors">
                    <LayoutDashboard size={18} className="stroke-[2.5px]" />
                </div>
                <span className="font-[700] text-[14px] text-black">Dashboard</span>
            </button>
            <div className="flex flex-col gap-2 mt-4 lg:hidden border-t border-gray-100 pt-6">
                 <h4 className="text-[11px] font-[800] uppercase text-gray-400 tracking-wider mb-2 px-1">Menu</h4>
                 <NavLink to="/" className={({isActive}) => `px-4 py-2.5 rounded-xl text-[14px] font-[700] transition-all ${isActive ? 'bg-black text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'}`}>Overview</NavLink>
                 <NavLink to="/transactions" className={({isActive}) => `px-4 py-2.5 rounded-xl text-[14px] font-[700] transition-all ${isActive ? 'bg-black text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'}`}>Transactions</NavLink>
                 <NavLink to="/incomes" className={({isActive}) => `px-4 py-2.5 rounded-xl text-[14px] font-[700] transition-all ${isActive ? 'bg-black text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'}`}>Incomes</NavLink>
                 <NavLink to="/expenses" className={({isActive}) => `px-4 py-2.5 rounded-xl text-[14px] font-[700] transition-all ${isActive ? 'bg-black text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'}`}>Expenses</NavLink>
                 <NavLink to="/investments" className={({isActive}) => `px-4 py-2.5 rounded-xl text-[14px] font-[700] transition-all ${isActive ? 'bg-black text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'}`}>Investments</NavLink>
                 <NavLink to="/savings" className={({isActive}) => `px-4 py-2.5 rounded-xl text-[14px] font-[700] transition-all ${isActive ? 'bg-black text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'}`}>Savings</NavLink>
            </div>
         </div>

         <div className="absolute bottom-6 left-6 right-6">
            <button onClick={handleLogout} className="flex items-center justify-center gap-2 w-full p-3.5 bg-red-50 text-red-600 hover:bg-red-500 hover:text-white rounded-xl font-[700] text-[13px] transition-colors shadow-sm">
               <LogOut size={16} className="stroke-[3px]" /> Log Out
            </button>
         </div>

      </div>
    </>
  );
};

export default Topbar;
