import React from 'react';
import { Outlet } from 'react-router-dom';
import { Leaf } from 'lucide-react';

const AuthLayout: React.FC = () => {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-600 text-white">
            <Leaf className="h-7 w-7" />
          </div>
          <h1 className="text-3xl font-bold text-text-primary mt-4">BiteWise</h1>
          <p className="text-text-secondary">Food Waste Management Platform</p>
        </div>
        <div className="card">
          <Outlet />
        </div>
        <p className="mt-6 text-center text-sm text-text-secondary">
          © {new Date().getFullYear()} BiteWise. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default AuthLayout;
