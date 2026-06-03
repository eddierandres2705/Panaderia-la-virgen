import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';
import api, { formatCurrency } from '@/utils/api';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Error al cargar productos');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    toast.success(`${product.name} agregado al carrito`);
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-4">
        <div className="container mx-auto text-center">
          <p className="text-xl">Cargando productos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 bg-gradient-to-b from-white to-sky-50">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-sky-900 mb-4">
            Nuestros Productos
          </h1>
          <div className="w-24 h-1 bg-amber-500 mx-auto mb-6"></div>
          <p className="text-gray-600 text-lg">Productos frescos horneados con amor</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <Card key={product.id} className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden border-sky-100">
              <div className="overflow-hidden h-48">
                <img 
                  src={product.image_url} 
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge className="bg-sky-100 text-sky-700">{product.category}</Badge>
                  {product.featured && (
                    <Badge className="bg-amber-100 text-amber-700">Destacado</Badge>
                  )}
                </div>
                <CardTitle className="text-xl text-sky-900">{product.name}</CardTitle>
                <CardDescription className="text-gray-600">{product.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-amber-600 mb-4">
                  {formatCurrency(product.price)}
                </p>
                {product.available ? (
                  <Button 
                    onClick={() => handleAddToCart(product)}
                    className="w-full bg-sky-600 hover:bg-sky-700 transition-colors"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Agregar al Carrito
                  </Button>
                ) : (
                  <Button disabled className="w-full">
                    No Disponible
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Products;
