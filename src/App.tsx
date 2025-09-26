import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard';
import FoodInventory from './pages/FoodInventory';
import WasteTracking from './pages/WasteTracking';
import Analytics from './pages/Analytics';
import Marketplace from './pages/Marketplace';
import Settings from './pages/Settings';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';
import AuthLayout from './components/Layout/AuthLayout';
import AdminRoute from './components/AdminRoute';
import UserManagement from './pages/UserManagement';

const App: React.FC = () => {
  const { loading, session } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={!session ? <Navigate to="/signin" /> : <Navigate to="/dashboard" />} />

      <Route element={<AuthLayout />}>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
      </Route>
      
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="inventory" element={<FoodInventory />} />
        <Route path="waste-tracking" element={<WasteTracking />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="marketplace" element={<Marketplace />} />
        <Route path="settings" element={<Settings />} />
        <Route 
          path="user-management" 
          element={
            <AdminRoute>
              <UserManagement />
            </AdminRoute>
          } 
        />
      </Route>
    </Routes>
  );
};

export default App;
