import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Home } from 'lucide-react';

const PaymentResult = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 bg-gradient-to-b from-white to-sky-50">
      <div className="container mx-auto max-w-2xl text-center">
        <Card className="p-12">
          <CheckCircle2 className="w-24 h-24 text-green-500 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-sky-900 mb-4">Pago Procesado</h1>
          <p className="text-gray-600 mb-8">Tu pago está siendo verificado. Recibirás una confirmación pronto.</p>
          <Button onClick={() => navigate('/')} className="bg-sky-600 hover:bg-sky-700">
            <Home className="w-4 h-4 mr-2" />
            Volver al Inicio
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default PaymentResult;