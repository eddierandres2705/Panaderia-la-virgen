import React from 'react';
import { MapPin, Phone, Clock, Facebook, Instagram, Mail } from 'lucide-react';
import Logo from '@/components/Logo';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-sky-900 to-sky-950 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <div className="mb-4">
              <Logo className="h-24 w-auto mx-auto md:mx-0" />
            </div>
            <p className="text-sky-200 text-sm leading-relaxed">
              20 años horneando momentos felices en Puerto Carreño. Calidad, tradición y sabor en cada producto.
            </p>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-amber-400">Contacto</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <p className="text-sky-200 text-sm">
                  Barrio Camilo Cortés<br />
                  Cl. 22 #11-50<br />
                  Puerto Carreño, Vichada
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-amber-400" />
                <a href="tel:3214218996" className="text-sky-200 hover:text-amber-400 transition-colors text-sm">
                  321 4218996
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-amber-400" />
                <p className="text-sky-200 text-sm">Abierto todos los días hasta las 10 p.m.</p>
              </div>
            </div>
          </div>

          {/* Services & Social */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-amber-400">Servicios</h4>
            <ul className="space-y-2 mb-6">
              <li className="text-sky-200 text-sm">• Consumo en el lugar</li>
              <li className="text-sky-200 text-sm">• Para llevar</li>
              <li className="text-sky-200 text-sm">• Pedidos personalizados</li>
              <li className="text-sky-200 text-sm">• Tortas para eventos</li>
            </ul>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-sky-800 hover:bg-amber-500 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-sky-800 hover:bg-amber-500 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="mailto:info@panaderiavirgen.com" className="w-10 h-10 bg-sky-800 hover:bg-amber-500 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-sky-800 mt-8 pt-6 text-center">
          <p className="text-sky-300 text-sm">
            © 2026 Panadería de la Virgen. Todos los derechos reservados.
          </p>
          <p className="text-sky-400 text-xs mt-2">
            "Llevando alegría y sabor a su mesa desde hace 20 años"
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
