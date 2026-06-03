import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import api, { formatCurrency, formatDate } from '@/utils/api';
import { toast } from 'sonner';

const AdminOrders = () => {
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Error al cargar órdenes');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await api.patch(`/orders/${orderId}/status`, { status: newStatus });
      toast.success('Estado actualizado');
      fetchOrders();
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error('Error al actualizar estado');
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending_payment: { label: 'Pago Pendiente', className: 'bg-amber-100 text-amber-700' },
      paid: { label: 'Pagado', className: 'bg-green-100 text-green-700' },
      processing: { label: 'En Proceso', className: 'bg-blue-100 text-blue-700' },
      completed: { label: 'Completado', className: 'bg-green-100 text-green-700' },
      cancelled: { label: 'Cancelado', className: 'bg-red-100 text-red-700' },
      payment_failed: { label: 'Pago Fallido', className: 'bg-red-100 text-red-700' }
    };

    const config = statusConfig[status] || { label: status, className: 'bg-gray-100 text-gray-700' };
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" />;
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-48 pb-20 px-4 bg-gray-50">
        <div className="container mx-auto text-center">
          <p>Cargando órdenes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-48 pb-20 px-4 bg-gray-50">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold text-sky-900 mb-8">Gestión de Órdenes</h1>

        <Card>
          <CardHeader>
            <CardTitle>Órdenes ({orders.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Número</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.order_number}</TableCell>
                    <TableCell>
                      <div>
                        <div>{order.customer.name}</div>
                        <div className="text-sm text-gray-500">{order.customer.phone}</div>
                      </div>
                    </TableCell>
                    <TableCell className="font-bold">{formatCurrency(order.total)}</TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell>{formatDate(order.created_at)}</TableCell>
                    <TableCell>
                      <Select
                        value={order.status}
                        onValueChange={(value) => updateOrderStatus(order.id, value)}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="processing">En Proceso</SelectItem>
                          <SelectItem value="completed">Completado</SelectItem>
                          <SelectItem value="cancelled">Cancelado</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminOrders;
