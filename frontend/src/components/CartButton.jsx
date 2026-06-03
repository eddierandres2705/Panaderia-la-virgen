import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const CartButton = () => {
  const navigate = useNavigate();
  const { getCartCount } = useCart();
  const count = getCartCount();

  return (
    <Button
      variant="outline"
      className="relative"
      onClick={() => navigate('/carrito')}
    >
      <ShoppingCart className="w-5 h-5" />
      {count > 0 && (
        <Badge className="absolute -top-2 -right-2 bg-amber-500 text-white px-2 py-0.5">
          {count}
        </Badge>
      )}
    </Button>
  );
};

export default CartButton;
