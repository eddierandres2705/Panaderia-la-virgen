import React, { useState } from 'react';
import { Star, MapPin, Phone, Clock, Award, ShoppingBag, ChevronRight, CheckCircle2, ShoppingCart } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { products, reviews, timeline, contactInfo } from '@/mock';
import { useCart } from '@/contexts/CartContext';
import { toast as sonnerToast } from 'sonner';

const Home = () => {
  const { addToCart } = useCart();
  const [orderForm, setOrderForm] = useState({
    name: '',
    phone: '',
    product: '',
    message: ''
  });

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    sonnerToast.success(`${product.name} agregado al carrito`);
  };

  const handleOrderSubmit = (e) => {
    e.preventDefault();
    // Guardar en localStorage (mock)
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const newOrder = {
      ...orderForm,
      id: Date.now(),
      date: new Date().toISOString()
    };
    orders.push(newOrder);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    sonnerToast.success('¡Pedido recibido!', {
      description: 'Nos pondremos en contacto contigo pronto.',
    });
    
    setOrderForm({ name: '', phone: '', product: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-sky-50">
      {/* Hero Section */}
      <section id="hero" className="pt-48 pb-20 px-4">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-sky-900 mb-6 leading-tight">
              20 años horneando
              <span className="block text-amber-500">momentos felices</span>
              <span className="block text-4xl md:text-5xl mt-2">en Puerto Carreño</span>
            </h1>
            <Badge className="bg-amber-100 text-amber-700 border-amber-300 mb-6 text-sm px-4 py-2">
              <Award className="w-4 h-4 mr-2 inline" />
              4.3 ⭐ • 112+ Reseñas Positivas
            </Badge>
            <p className="text-xl text-gray-700 mb-8 leading-relaxed max-w-2xl mx-auto">
              Panadería de la Virgen es tradición, sabor y calidad. Reconocidos como una de las mejores panaderías de Puerto Carreño.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                onClick={() => document.getElementById('order').scrollIntoView({ behavior: 'smooth' })}
                className="bg-amber-500 hover:bg-amber-600 text-white text-lg px-8 py-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
              >
                <ShoppingBag className="w-5 h-5 mr-2" />
                Haz tu pedido ahora
              </Button>
              <a href="tel:3214218996">
                <Button variant="outline" className="border-sky-600 text-sky-600 hover:bg-sky-50 text-lg px-8 py-6 transition-all duration-300">
                  <Phone className="w-5 h-5 mr-2" />
                  Llámanos
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-12 px-4 bg-white">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { icon: Award, label: '20 Años', sublabel: 'de Experiencia' },
              { icon: Star, label: '4.3 Estrellas', sublabel: '112+ Reseñas' },
              { icon: CheckCircle2, label: 'Calidad', sublabel: 'Garantizada' },
              { icon: Clock, label: 'Abierto', sublabel: 'Hasta las 10PM' }
            ].map((item, idx) => (
              <Card key={idx} className="text-center hover:shadow-lg transition-shadow duration-300 border-sky-100">
                <CardContent className="pt-6">
                  <item.icon className="w-12 h-12 mx-auto mb-3 text-amber-500" />
                  <p className="text-2xl font-bold text-sky-900">{item.label}</p>
                  <p className="text-gray-600 text-sm">{item.sublabel}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-sky-900 mb-4">
                Pasión por el pan desde hace dos décadas
              </h2>
              <div className="w-24 h-1 bg-amber-500 mx-auto mb-6"></div>
            </div>
            <Card className="shadow-xl border-sky-100">
              <CardContent className="p-8">
                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                  Desde <span className="font-bold text-amber-600">2006</span>, hemos acompañado a las familias del barrio Camilo Cortés con pan fresco, tortas artesanales y postres únicos.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Nuestra misión es simple: <span className="font-bold text-sky-700">ofrecer productos de calidad que hagan de cada ocasión un recuerdo especial</span>.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-sky-900 mb-4">
              Productos Destacados
            </h2>
            <div className="w-24 h-1 bg-amber-500 mx-auto mb-6"></div>
            <p className="text-gray-600 text-lg">Deliciosos productos horneados con amor</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <Card key={product.id} className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden border-sky-100">
                <div className="overflow-hidden h-48">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <CardHeader>
                  <Badge className="w-fit mb-2 bg-sky-100 text-sky-700">{product.category}</Badge>
                  <CardTitle className="text-xl text-sky-900">{product.name}</CardTitle>
                  <CardDescription className="text-gray-600">{product.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-amber-600 mb-4">{product.price}</p>
                  <Button 
                    onClick={() => handleAddToCart(product)}
                    className="w-full bg-sky-600 hover:bg-sky-700 transition-colors"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Agregar al Carrito
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section id="reviews" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-sky-900 mb-4">
              La voz de quienes nos prefieren
            </h2>
            <div className="w-24 h-1 bg-amber-500 mx-auto mb-6"></div>
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 fill-amber-500 text-amber-500" />
                ))}
              </div>
              <span className="text-xl font-bold text-sky-900">{contactInfo.rating}</span>
              <span className="text-gray-600">({contactInfo.totalReviews}+ reseñas)</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {reviews.map((review) => (
              <Card key={review.id} className="hover:shadow-lg transition-shadow duration-300 border-sky-100">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <CardTitle className="text-lg text-sky-900">{review.name}</CardTitle>
                    <Badge className="bg-amber-100 text-amber-700">{review.date}</Badge>
                  </div>
                  <div className="flex gap-1">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />
                    ))}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 italic">"{review.comment}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-sky-900 mb-4">
              20 Años Contigo
            </h2>
            <div className="w-24 h-1 bg-amber-500 mx-auto mb-6"></div>
            <p className="text-gray-600 text-lg">Nuestra historia de crecimiento y dedicación</p>
          </div>
          <div className="max-w-4xl mx-auto">
            {timeline.map((item, idx) => (
              <div key={idx} className="flex gap-6 mb-8 group">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg group-hover:scale-110 transition-transform duration-300">
                    {item.year.slice(-2)}
                  </div>
                  {idx < timeline.length - 1 && (
                    <div className="w-1 h-full bg-sky-200 mt-2"></div>
                  )}
                </div>
                <Card className="flex-1 mb-4 hover:shadow-lg transition-shadow duration-300 border-sky-100">
                  <CardHeader>
                    <Badge className="w-fit mb-2 bg-sky-100 text-sky-700">{item.year}</Badge>
                    <CardTitle className="text-xl text-sky-900">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">{item.description}</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Order Section */}
      <section id="order" className="py-20 px-4 bg-gradient-to-br from-sky-600 to-sky-800 text-white">
        <div className="container mx-auto">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Haz tu pedido en segundos
            </h2>
            <p className="text-xl text-sky-100">
              ¿Quieres sorprender a alguien con una torta especial o simplemente disfrutar de pan fresco? Haz tu pedido ahora.
            </p>
          </div>
          <Card className="max-w-2xl mx-auto shadow-2xl">
            <CardHeader>
              <CardTitle className="text-2xl text-sky-900">Formulario de Pedido</CardTitle>
              <CardDescription>Completa tus datos y nos pondremos en contacto contigo</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleOrderSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nombre completo</label>
                  <Input 
                    required
                    value={orderForm.name}
                    onChange={(e) => setOrderForm({...orderForm, name: e.target.value})}
                    placeholder="Tu nombre"
                    className="transition-all duration-200 focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
                  <Input 
                    required
                    type="tel"
                    value={orderForm.phone}
                    onChange={(e) => setOrderForm({...orderForm, phone: e.target.value})}
                    placeholder="321 123 4567"
                    className="transition-all duration-200 focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Producto deseado</label>
                  <Input 
                    required
                    value={orderForm.product}
                    onChange={(e) => setOrderForm({...orderForm, product: e.target.value})}
                    placeholder="Ej: Torta de cumpleaños"
                    className="transition-all duration-200 focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mensaje (opcional)</label>
                  <Textarea 
                    value={orderForm.message}
                    onChange={(e) => setOrderForm({...orderForm, message: e.target.value})}
                    placeholder="Detalles adicionales sobre tu pedido..."
                    rows={4}
                    className="transition-all duration-200 focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <Button 
                  type="submit"
                  className="w-full bg-amber-500 hover:bg-amber-600 text-white text-lg py-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  Encargar Torta Personalizada
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-sky-900 mb-4">
              Ubicación y Contacto
            </h2>
            <div className="w-24 h-1 bg-amber-500 mx-auto mb-6"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Card className="shadow-lg border-sky-100">
              <CardHeader>
                <CardTitle className="text-2xl text-sky-900">Encuéntranos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-6 h-6 text-amber-500 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900">Dirección</p>
                    <p className="text-gray-600">{contactInfo.address}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-6 h-6 text-amber-500 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900">Teléfono</p>
                    <a href="tel:3214218996" className="text-sky-600 hover:text-sky-700">{contactInfo.phone}</a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-6 h-6 text-amber-500 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900">Horario</p>
                    <p className="text-gray-600">{contactInfo.hours}</p>
                  </div>
                </div>
                <div className="pt-4">
                  <p className="font-medium text-gray-900 mb-2">Servicios disponibles:</p>
                  <div className="flex flex-wrap gap-2">
                    {contactInfo.services.map((service, idx) => (
                      <Badge key={idx} className="bg-sky-100 text-sky-700">{service}</Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-lg border-sky-100">
              <CardContent className="p-0">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.8173!2d-67.4856!3d6.1892!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMTEnMjEuMSJOIDY3wrAyOScwOC4yIlc!5e0!3m2!1sen!2sco!4v1234567890"
                  width="100%"
                  height="400"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  className="rounded-lg"
                ></iframe>
              </CardContent>
            </Card>
          </div>
          <div className="text-center mt-8">
            <a href={contactInfo.mapUrl} target="_blank" rel="noopener noreferrer">
              <Button className="bg-sky-600 hover:bg-sky-700">
                <MapPin className="w-4 h-4 mr-2" />
                Cómo llegar
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
