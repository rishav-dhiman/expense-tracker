import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { Save, Lock, User, CheckCircle2 } from 'lucide-react';

const Account = () => {
    const { user, loadUser } = useAuth();
    
    // Profile State
    const [name, setName] = useState(user?.name || '');
    const [profileLoading, setProfileLoading] = useState(false);
    const [profileSuccess, setProfileSuccess] = useState('');
    const [profileError, setProfileError] = useState('');

    // Password State
    const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [passLoading, setPassLoading] = useState(false);
    const [passSuccess, setPassSuccess] = useState('');
    const [passError, setPassError] = useState('');

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setProfileLoading(true);
        setProfileSuccess('');
        setProfileError('');
        
        try {
            await api.put('/auth/updatedetails', { name, email: user.email });
            await loadUser(); // Refresh user context
            setProfileSuccess('Profile updated successfully!');
        } catch (error) {
            setProfileError(error.response?.data?.error || 'Failed to update profile');
        } finally {
            setProfileLoading(false);
        }
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        setPassLoading(true);
        setPassSuccess('');
        setPassError('');

        if (passwords.newPassword !== passwords.confirmPassword) {
            setPassError('New passwords do not match');
            setPassLoading(false);
            return;
        }

        try {
            await api.put('/auth/updatepassword', {
                currentPassword: passwords.currentPassword,
                newPassword: passwords.newPassword
            });
            setPassSuccess('Password updated successfully!');
            setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            setPassError(error.response?.data?.error || 'Failed to update password');
        } finally {
            setPassLoading(false);
        }
    };

    const inputClasses = "w-full p-3 border border-gray-200 outline-none focus:border-black focus:ring-1 focus:ring-black rounded-xl bg-gray-50/50 text-[14px] text-black font-medium transition-all placeholder:text-gray-400";

    return (
        <div className="w-full min-h-full px-8 lg:px-12 py-10 flex flex-col mx-auto max-w-[800px]">
            <div className="mb-10 text-center">
                <h1 className="text-3xl font-[800] tracking-tight text-black mb-2">Account Settings</h1>
                <p className="text-gray-500 font-medium text-[14px]">Manage your profile and security preferences</p>
            </div>

            <div className="flex flex-col gap-8">
                
                {/* Profile Information Card */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2bg-blue-50 text-blue-600 rounded-lg">
                            <User size={20} strokeWidth={2.5} />
                        </div>
                        <h2 className="text-[18px] font-[800] text-black tracking-tight">Profile Information</h2>
                    </div>

                    <form onSubmit={handleProfileUpdate} className="flex flex-col gap-5">
                       {profileSuccess && <div className="p-3 bg-green-50 text-green-700 text-[13px] font-bold rounded-xl border border-green-100 flex items-center gap-2"><CheckCircle2 size={16}/> {profileSuccess}</div>}
                       {profileError && <div className="p-3 bg-red-50 text-red-600 text-[13px] font-bold rounded-xl border border-red-100">{profileError}</div>}
                       
                        <div className="space-y-1">
                            <label className="text-[12px] font-[700] text-gray-500 uppercase tracking-wider ml-1">Full Name</label>
                            <input 
                                type="text" required 
                                value={name} onChange={e => setName(e.target.value)} 
                                className={inputClasses} 
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[12px] font-[700] text-gray-400 uppercase tracking-wider ml-1">Email (Read Only)</label>
                            <input 
                                type="email" disabled 
                                value={user?.email || ''} 
                                className={`${inputClasses} opacity-60 cursor-not-allowed`} 
                            />
                        </div>

                        <button disabled={profileLoading} type="submit" className="self-end flex items-center justify-center gap-2 px-6 py-3 mt-2 bg-black text-white text-[13px] rounded-xl font-bold transition-all hover:bg-gray-800 disabled:opacity-50">
                            <Save size={16} strokeWidth={2.5} /> {profileLoading ? 'Saving...' : 'Save Profile'}
                        </button>
                    </form>
                </div>

                {/* Security Card */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                            <Lock size={20} strokeWidth={2.5} />
                        </div>
                        <h2 className="text-[18px] font-[800] text-black tracking-tight">Security</h2>
                    </div>

                    <form onSubmit={handlePasswordUpdate} className="flex flex-col gap-5">
                        {passSuccess && <div className="p-3 bg-green-50 text-green-700 text-[13px] font-bold rounded-xl border border-green-100 flex items-center gap-2"><CheckCircle2 size={16}/> {passSuccess}</div>}
                        {passError && <div className="p-3 bg-red-50 text-red-600 text-[13px] font-bold rounded-xl border border-red-100">{passError}</div>}
                        
                        <div className="space-y-1">
                            <label className="text-[12px] font-[700] text-gray-500 uppercase tracking-wider ml-1">Current Password</label>
                            <input 
                                type="password" required 
                                value={passwords.currentPassword} 
                                onChange={e => setPasswords({...passwords, currentPassword: e.target.value})} 
                                className={inputClasses} 
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-1">
                                <label className="text-[12px] font-[700] text-gray-500 uppercase tracking-wider ml-1">New Password</label>
                                <input 
                                    type="password" required minLength={6}
                                    value={passwords.newPassword} 
                                    onChange={e => setPasswords({...passwords, newPassword: e.target.value})} 
                                    className={inputClasses} 
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[12px] font-[700] text-gray-500 uppercase tracking-wider ml-1">Confirm New Password</label>
                                <input 
                                    type="password" required minLength={6}
                                    value={passwords.confirmPassword} 
                                    onChange={e => setPasswords({...passwords, confirmPassword: e.target.value})} 
                                    className={inputClasses} 
                                />
                            </div>
                        </div>

                        <button disabled={passLoading} type="submit" className="self-end flex items-center justify-center gap-2 px-6 py-3 mt-2 bg-black text-white text-[13px] rounded-xl font-bold transition-all hover:bg-gray-800 disabled:opacity-50">
                            <Lock size={16} strokeWidth={2.5} /> {passLoading ? 'Updating...' : 'Update Password'}
                        </button>
                    </form>
                </div>
                
            </div>
        </div>
    );
};

export default Account;
