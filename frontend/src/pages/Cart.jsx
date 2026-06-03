import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { formatCurrency } from '@/utils/api';

const Cart = () => {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();

  if (cart.length === 0) {
    return (
      <div className="min-h-screen pt-48 pb-20 px-4 bg-gradient-to-b from-white to-sky-50">
        <div className="container mx-auto max-w-4xl text-center">
          <ShoppingBag className="w-16 h-16 md:w-24 md:h-24 mx-auto mb-6 text-gray-300" />
          <h1 className="text-2xl md:text-3xl font-bold text-sky-900 mb-4">Tu carrito está vacío</h1>
          <p className="text-gray-600 mb-8">Agrega productos para continuar</p>
          <Button onClick={() => navigate('/productos')} className="bg-sky-600 hover:bg-sky-700">
            Ver Productos
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-48 pb-20 px-4 bg-gradient-to-b from-white to-sky-50">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-2xl md:text-4xl font-bold text-sky-900 mb-6">Carrito de Compras</h1>

        <div className="space-y-4">
          {cart.map((item) => (
            <Card key={item.id} className="border-sky-100">
              <CardContent className="p-4">
                <div className="flex flex-col space-y-4">
                  {/* Row 1: Image + Title + Delete */}
                  <div className="flex items-start gap-3">
                    <img 
                      src={item.image_url || item.image} 
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base md:text-lg font-bold text-sky-900 line-clamp-2">{item.name}</h3>
                      <p className="text-sm text-gray-600">{formatCurrency(item.price)}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-700 flex-shrink-0"
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  </div>

                  {/* Row 2: Quantity Controls + Total */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                        className="w-16 h-8 text-center"
                        min="1"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="text-right">
                      <p className="text-lg md:text-xl font-bold text-amber-600">
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Summary Card */}
        <Card className="mt-6 border-sky-100">
          <CardHeader>
            <CardTitle className="text-xl md:text-2xl text-sky-900">Resumen del Pedido</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 mb-6">
              <div className="flex justify-between text-base md:text-lg">
                <span>Subtotal:</span>
                <span className="font-bold">{formatCurrency(getCartTotal())}</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between text-xl md:text-2xl font-bold text-sky-900">
                  <span>Total:</span>
                  <span>{formatCurrency(getCartTotal())}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-3">
              <Button
                variant="outline"
                onClick={clearCart}
                className="flex-1 order-2 md:order-1"
              >
                Vaciar Carrito
              </Button>
              <Button
                onClick={() => navigate('/checkout')}
                className="flex-1 bg-amber-500 hover:bg-amber-600 order-1 md:order-2"
              >
                Proceder al Pago
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Cart;
