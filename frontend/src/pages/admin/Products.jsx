import React from 'react';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const AdminProducts = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" />;
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 bg-gray-50">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold text-sky-900 mb-8">Gestión de Productos</h1>
        <Card className="p-8">
          <p className="text-center text-gray-600">Gestión de productos en desarrollo...</p>
        </Card>
      </div>
    </div>
  );
};

export default AdminProducts;
