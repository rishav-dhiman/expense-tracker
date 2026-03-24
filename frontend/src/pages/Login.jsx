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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 md:p-10 rounded-2xl shadow-lg w-full max-w-[450px]">
        <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">Welcome Back</h2>
        <p className="text-gray-500 text-center mb-8">Login to manage your budget.</p>
        {error && <div className="bg-red-50 text-red-500 p-3 rounded-xl mb-6 text-sm text-center border border-red-100">{error}</div>}
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Email Address</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              className={`w-full p-3.5 border ${fieldErrors.email ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-200 focus:ring-blue-500 focus:border-blue-500'} rounded-xl outline-none focus:ring-1 bg-gray-50 transition-all text-gray-800`}
            />
            {fieldErrors.email && <span className="text-red-500 text-xs">{fieldErrors.email}</span>}
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              className={`w-full p-3.5 border ${fieldErrors.password ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-200 focus:ring-blue-500 focus:border-blue-500'} rounded-xl outline-none focus:ring-1 bg-gray-50 transition-all text-gray-800`}
            />
            {fieldErrors.password && <span className="text-red-500 text-xs">{fieldErrors.password}</span>}
          </div>
          <button type="submit" className="w-full p-3.5 bg-gray-900 text-white rounded-xl font-medium mt-2 hover:bg-gray-800 transition-colors shadow-md">Login</button>
        </form>
        <p className="text-center mt-6 text-sm text-gray-600">Don't have an account? <Link to="/signup" className="text-blue-500 font-semibold hover:underline">Sign Up</Link></p>
      </div>
    </div>
  );
};

export default Login;
