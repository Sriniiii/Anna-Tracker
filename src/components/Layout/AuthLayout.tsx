import React from 'react';
import { Outlet } from 'react-router-dom';
import { Leaf } from 'lucide-react';

const AuthLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-500 mb-4">
            <Leaf className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">BiteWise</h1>
          <p className="text-gray-600">Food Waste Management Platform</p>
        </div>
        <div className="card">
          <Outlet />
        </div>
        <p className="mt-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} BiteWise. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default AuthLayout;
