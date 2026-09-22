import React from 'react';
import { Outlet } from 'react-router-dom';

export const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-center items-center py-10 px-4">
      <div className="w-full max-w-md">
        <Outlet />
      </div>
    </div>
  );
};


