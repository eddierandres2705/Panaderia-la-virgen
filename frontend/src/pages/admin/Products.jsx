import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import api, { formatCurrency } from '@/utils/api';
import { toast } from 'sonner';
import { Trash2, Plus } from 'lucide-react';

const AdminProducts = () => {
  const { isAuthenticated } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al cargar productos');
    } finally {
      setLoading(false);
    }
  };

  const toggleAvailability = async (productId, currentStatus) => {
    try {
      await api.put(`/products/${productId}`, { available: !currentStatus });
      toast.success('Actualizado');
      fetchProducts();
    } catch (error) {
      toast.error('Error');
    }
  };

  const deleteProduct = async (productId) => {
    if (!window.confirm('Eliminar producto?')) return;
    try {
      await api.delete(`/products/${productId}`);
      toast.success('Eliminado');
      fetchProducts();
    } catch (error) {
      toast.error('Error');
    }
  };

  if (!isAuthenticated) return <Navigate to="/admin/login" />;
  if (loading) return <div className="min-h-screen pt-32 px-4"><p className="text-center">Cargando...</p></div>;

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 bg-gray-50">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-sky-900">Productos</h1>
          <Button className="bg-sky-600 hover:bg-sky-700">
            <Plus className="w-4 h-4 mr-2" />
            Nuevo
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product.id}>
              <CardHeader>
                <img src={product.image_url} alt={product.name} className="w-full h-48 object-cover rounded-lg mb-4" />
                <div className="flex gap-2 mb-2">
                  <Badge className={product.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                    {product.available ? 'Disponible' : 'No Disponible'}
                  </Badge>
                  {product.featured && <Badge className="bg-amber-100 text-amber-700">Destacado</Badge>}
                </div>
                <CardTitle>{product.name}</CardTitle>
                <p className="text-2xl font-bold text-amber-600">{formatCurrency(product.price)}</p>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">{product.description}</p>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => toggleAvailability(product.id, product.available)} className="flex-1">
                    {product.available ? 'Deshabilitar' : 'Habilitar'}
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => deleteProduct(product.id)} className="text-red-600">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;