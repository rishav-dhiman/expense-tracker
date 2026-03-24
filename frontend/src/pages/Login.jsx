import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to login');
      if (err.response?.data?.error?.message) {
        try {
          const parsedIssues = JSON.parse(err.response.data.error.message);
          const errorsMap = {};
          parsedIssues.forEach(issue => {
            if (issue.path && issue.path[0]) errorsMap[issue.path[0]] = issue.message;
          });
          setFieldErrors(errorsMap);
        } catch (e) {
          setFieldErrors({});
        }
      } else {
        setFieldErrors({});
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 relative flex flex-col items-center justify-center p-4">
      
      {/* Top Left Logo (Absolute) */}
      <div className="absolute top-8 left-8 flex items-center gap-2">
        <div className="w-5 h-5 shrink-0 bg-black rounded-full" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 100%)' }}></div>
        <span className="text-xl font-[800] tracking-tighter text-black">Budget.</span>
      </div>
    
      {/* Center Card */}
      <div className="w-full max-w-[420px] bg-white border border-gray-200 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 md:p-10 flex flex-col items-center">
        <h1 className="text-[28px] font-[700] tracking-[-0.03em] mb-1.5 text-black">Welcome to Budget</h1>
        <p className="text-[13px] text-gray-500 font-medium mb-8 text-center">Expense management designed for individuals</p>
    
        {error && <div className="w-full bg-red-50 text-red-500 p-2.5 rounded-md mb-4 text-[13px] text-center border border-red-100">{error}</div>}
    
        <form onSubmit={handleSubmit} noValidate className="w-full flex flex-col gap-4">
          <div className="flex flex-col w-full text-left">
            <label className="text-[13px] font-[600] text-gray-800 mb-1.5 flex justify-between">Email
               {fieldErrors.email && <span className="text-red-500 font-normal">{fieldErrors.email}</span>}
            </label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              placeholder="Type your email"
              className={`w-full px-3 py-2.5 text-[14px] bg-white border ${fieldErrors.email ? 'border-red-400 ring-1 ring-red-400' : 'border-gray-200'} rounded-md focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 transition-all font-medium placeholder-gray-400`}
            />
          </div>
    
          <div className="flex flex-col w-full text-left">
            <label className="text-[13px] font-[600] text-gray-800 mb-1.5 flex justify-between">Password
               {fieldErrors.password && <span className="text-red-500 font-normal">{fieldErrors.password}</span>}
            </label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              placeholder="Type your password"
              className={`w-full px-3 py-2.5 text-[14px] bg-white border ${fieldErrors.password ? 'border-red-400 ring-1 ring-red-400' : 'border-gray-200'} rounded-md focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 transition-all font-medium placeholder-gray-400`}
            />
          </div>
    
          <button type="submit" className="w-full py-2.5 bg-[#1F1F1F] text-white rounded-md text-[14px] font-[600] tracking-wide mt-2 hover:bg-black transition-colors shadow-sm">
            Continue
          </button>
        </form>
        
        <p className="text-center mt-6 text-[13px] text-gray-500 font-medium">
          Don't have an account? <Link to="/signup" className="text-gray-900 font-[700] hover:underline">Sign up</Link>
        </p>
    
        {/* Absolute Bottom Terms */}
        <div className="absolute bottom-8 w-full text-center px-4">
          <p className="text-[12px] text-gray-500 leading-relaxed font-medium">
            By clicking "Continue"<br/>
            you agree to our <a href="#" className="underline hover:text-gray-800">Terms of Use</a> and <a href="#" className="underline hover:text-gray-800">Privacy policy</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
