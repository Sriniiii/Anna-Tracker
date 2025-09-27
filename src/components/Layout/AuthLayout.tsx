import React from 'react';
import { Outlet } from 'react-router-dom';
import AnimatedLogo from '../UI/AnimatedLogo';
import LiveCursor from '../UI/LiveCursor';

const AuthLayout: React.FC = () => {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background p-4">
      <LiveCursor />
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center">
          <AnimatedLogo />
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
