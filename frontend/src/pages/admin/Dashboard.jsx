import React from 'react';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const AdminDashboard = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" />;
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 bg-gray-50">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold text-sky-900 mb-8">Dashboard</h1>
        <Card className="p-8">
          <p className="text-center text-gray-600">Dashboard en desarrollo...</p>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
