import React from 'react';
import { Card } from '@/components/ui/card';

const PaymentResult = () => {
  return (
    <div className="min-h-screen pt-32 pb-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold text-sky-900 mb-8">Resultado del Pago</h1>
        <Card className="p-8">
          <p className="text-center text-gray-600">Página de resultado en desarrollo...</p>
        </Card>
      </div>
    </div>
  );
};

export default PaymentResult;
