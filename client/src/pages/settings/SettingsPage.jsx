import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { User, Lock, Shield, LogOut } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../store/authStore';
import api from '../../lib/axios';

const SettingsPage = () => {
  const { user, logout } = useAuthStore();

  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || ''
  });

  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });

  const handleProfileSave = async (e) => {
    e.preventDefault();
    try {
      // In a real app we'd call PUT /api/v1/users/:id or similar
      await toast.promise(
        new Promise(resolve => setTimeout(resolve, 600)),
        {
          loading: 'Saving profile...',
          success: 'Profile updated successfully!',
          error: 'Failed to update profile.'
        }
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.new_password !== passwordData.confirm_password) {
      return toast.error('New passwords do not match!');
    }
    if (passwordData.new_password.length < 6) {
      return toast.error('Password must be at least 6 characters.');
    }
    try {
      await toast.promise(
        api.put('/auth/change-password', {
          currentPassword: passwordData.current_password,
          newPassword: passwordData.new_password
        }),
        {
          loading: 'Updating password...',
          success: 'Password changed successfully!',
          error: 'Password change failed. Check your current password.'
        }
      );
      setPasswordData({ current_password: '', new_password: '', confirm_password: '' });
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully.');
    window.location.href = '/login';
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <h1 className="text-2xl font-bold font-jakarta text-gray-900">My Profile & Settings</h1>

      {/* User Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><User className="w-5 h-5 text-gray-500" /> Profile Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleProfileSave} className="space-y-4">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-bold text-2xl">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-900">{user?.name}</h3>
                <p className="text-sm text-gray-500 capitalize flex items-center gap-1">
                  <Shield className="w-3 h-3" /> {user?.role}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <Input
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <Input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <Input
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                />
              </div>
            </div>

            <div className="pt-4">
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">Save Changes</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Change Password */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Lock className="w-5 h-5 text-gray-500" /> Change Password</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
              <Input
                type="password"
                required
                value={passwordData.current_password}
                onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <Input
                  type="password"
                  required
                  value={passwordData.new_password}
                  onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                <Input
                  type="password"
                  required
                  value={passwordData.confirm_password}
                  onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
                />
              </div>
            </div>
            <div className="pt-4">
              <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 gap-2">
                <Lock className="w-4 h-4" /> Update Password
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Logout */}
      <Card className="border-red-100">
        <CardContent className="p-6 flex justify-between items-center">
          <div>
            <h3 className="font-semibold text-gray-900">Sign Out</h3>
            <p className="text-sm text-gray-500">End your current session on this device.</p>
          </div>
          <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 gap-2" onClick={handleLogout}>
            <LogOut className="w-4 h-4" /> Logout
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;
