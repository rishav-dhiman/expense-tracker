import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PublicRoute = () => {
    const { token } = useAuth();
    // If the user has a valid token, redirect them away from public pages (like login/signup) to the dashboard
    return token ? <Navigate to="/" /> : <Outlet />;
};

export default PublicRoute;
