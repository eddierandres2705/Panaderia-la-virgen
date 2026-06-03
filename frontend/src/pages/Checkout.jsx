import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';
import api, { formatCurrency } from '@/utils/api';
import { CreditCard, Building2, DollarSign, ArrowRight, MessageCircle } from 'lucide-react';

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, getCartTotal, clearCart } = useCart();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [pseBanks, setPseBanks] = useState([]);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    document_type: 'CC',
    document_number: '',
    delivery_type: 'pickup',
    delivery_date: '',
    notes: '',
    payment_method: 'card'
  });

  React.useEffect(() => {
    if (cart.length === 0) {
      navigate('/carrito');
    }
    fetchPseBanks();
  }, [cart]);

  const fetchPseBanks = async () => {
    try {
      const response = await api.get('/payments/pse/banks');
      setPseBanks(response.data);
    } catch (error) {
      console.error('Error fetching PSE banks:', error);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const createOrder = async () => {
    const orderData = {
      customer: {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        document_type: formData.document_type,
        document_number: formData.document_number
      },
      items: cart.map(item => ({
        product_id: String(item.id),
        product_name: item.name,
        quantity: item.quantity,
        unit_price: item.price,
        subtotal: item.price * item.quantity
      })),
      delivery_type: formData.delivery_type,
      delivery_date: formData.delivery_date || null,
      notes: formData.notes
    };

    const response = await api.post('/orders', orderData);
    return response.data;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (step === 1) {
      setStep(2);
      return;
    }

    setLoading(true);

    try {
      // Create order
      const order = await createOrder();
      
      if (formData.payment_method === 'cash') {
        // Cash payment - just redirect to WhatsApp
        const message = `Hola! Quiero confirmar mi pedido #${order.order_number}\n\nTotal: ${formatCurrency(order.total)}\n\nProductos:\n${cart.map(item => `- ${item.name} x${item.quantity}`).join('\n')}`;
        const whatsappUrl = `https://wa.me/573023981490?text=${encodeURIComponent(message)}`;
        
        clearCart();
        toast.success('Pedido creado exitosamente');
        window.open(whatsappUrl, '_blank');
        navigate('/');
        return;
      }

      // Get acceptance token
      const acceptanceResponse = await api.get('/payments/wompi/acceptance');
      const acceptanceToken = acceptanceResponse.data.acceptance_token;

      // Initialize payment
      if (formData.payment_method === 'card') {
        const paymentResponse = await api.post('/payments/card/init', {
          order_id: order.id,
          customer_email: formData.email,
          customer_name: formData.name,
          acceptance_token: acceptanceToken
        });

        clearCart();
        // Redirect to Wompi checkout
        window.location.href = paymentResponse.data.checkout_url;
        
      } else if (formData.payment_method === 'pse') {
        const paymentResponse = await api.post('/payments/pse/init', {
          order_id: order.id,
          customer_email: formData.email,
          customer_name: formData.name,
          person_type: '0',
          document_type: formData.document_type,
          document_number: formData.document_number,
          bank_code: formData.bank_code,
          acceptance_token: acceptanceToken
        });

        clearCart();
        // Redirect to PSE
        window.location.href = paymentResponse.data.redirect_url;
      }
    } catch (error) {
      console.error('Error processing checkout:', error);
      toast.error('Error al procesar el pago. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-48 pb-20 px-4 bg-gradient-to-b from-white to-sky-50">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold text-sky-900 mb-8">Finalizar Compra</h1>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-8">
          <div className={`flex items-center ${step >= 1 ? 'text-sky-600' : 'text-gray-400'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-sky-600 text-white' : 'bg-gray-300'}`}>
              1
            </div>
            <span className="ml-2 font-medium">Información</span>
          </div>
          <div className="w-24 h-1 bg-gray-300 mx-4"></div>
          <div className={`flex items-center ${step >= 2 ? 'text-sky-600' : 'text-gray-400'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-sky-600 text-white' : 'bg-gray-300'}`}>
              2
            </div>
            <span className="ml-2 font-medium">Pago</span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Información de Contacto</CardTitle>
                <CardDescription>Completa tus datos para continuar</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Nombre Completo *</Label>
                  <Input
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Juan Pérez"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="juan@ejemplo.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Teléfono *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="321 123 4567"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="document_type">Tipo de Documento</Label>
                    <Select value={formData.document_type} onValueChange={(val) => handleInputChange('document_type', val)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CC">Cédula de Ciudadanía</SelectItem>
                        <SelectItem value="CE">Cédula de Extranjería</SelectItem>
                        <SelectItem value="NIT">NIT</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="document_number">Número de Documento</Label>
                    <Input
                      id="document_number"
                      value={formData.document_number}
                      onChange={(e) => handleInputChange('document_number', e.target.value)}
                      placeholder="1234567890"
                    />
                  </div>
                </div>
                <div>
                  <Label>Tipo de Entrega</Label>
                  <RadioGroup value={formData.delivery_type} onValueChange={(val) => handleInputChange('delivery_type', val)}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="pickup" id="pickup" />
                      <Label htmlFor="pickup">Recoger en tienda</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="delivery" id="delivery" />
                      <Label htmlFor="delivery">Entrega a domicilio</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div>
                  <Label htmlFor="notes">Notas del Pedido (Opcional)</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    placeholder="Instrucciones especiales, alergias, etc."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {step === 2 && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Método de Pago</CardTitle>
                <CardDescription>Selecciona cómo deseas pagar</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <RadioGroup value={formData.payment_method} onValueChange={(val) => handleInputChange('payment_method', val)}>
                  <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-sky-50 cursor-pointer">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex items-center cursor-pointer flex-1">
                      <CreditCard className="w-5 h-5 mr-2 text-sky-600" />
                      Tarjeta de Crédito/Débito
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-sky-50 cursor-pointer">
                    <RadioGroupItem value="pse" id="pse" />
                    <Label htmlFor="pse" className="flex items-center cursor-pointer flex-1">
                      <Building2 className="w-5 h-5 mr-2 text-sky-600" />
                      PSE (Débito a cuenta)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-sky-50 cursor-pointer">
                    <RadioGroupItem value="cash" id="cash" />
                    <Label htmlFor="cash" className="flex items-center cursor-pointer flex-1">
                      <DollarSign className="w-5 h-5 mr-2 text-amber-600" />
                      Pago en Efectivo (Contraentrega)
                    </Label>
                  </div>
                </RadioGroup>

                {formData.payment_method === 'pse' && (
                  <div>
                    <Label htmlFor="bank_code">Selecciona tu Banco</Label>
                    <Select value={formData.bank_code} onValueChange={(val) => handleInputChange('bank_code', val)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Elige un banco" />
                      </SelectTrigger>
                      <SelectContent>
                        {pseBanks.map((bank) => (
                          <SelectItem key={bank.financial_institution_code} value={bank.financial_institution_code}>
                            {bank.financial_institution_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Order Summary */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Resumen del Pedido</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <span>{item.name} x{item.quantity}</span>
                    <span className="font-medium">{formatCurrency(item.price * item.quantity)}</span>
                  </div>
                ))}
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between text-xl font-bold text-sky-900">
                    <span>Total:</span>
                    <span>{formatCurrency(getCartTotal())}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            {step === 2 && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(1)}
                className="flex-1"
              >
                Volver
              </Button>
            )}
            <Button
              type="submit"
              disabled={loading || (step === 2 && formData.payment_method === 'pse' && !formData.bank_code)}
              className="flex-1 bg-amber-500 hover:bg-amber-600"
            >
              {loading ? 'Procesando...' : step === 1 ? 'Continuar' : 'Proceder al Pago'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
