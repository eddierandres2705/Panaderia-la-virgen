import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Phone, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Logo from '@/components/Logo';
import CartButton from '@/components/CartButton';
import { useAuth } from '@/contexts/AuthContext';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  const handleNavClick = (item) => {
    if (item.path) {
      navigate(item.path);
    } else if (item.id) {
      scrollToSection(item.id);
    }
    setIsMobileMenuOpen(false);
  };

  const navItems = [
    { label: 'Inicio', path: '/' },
    { label: 'Productos', path: '/productos' },
    { label: 'Contacto', id: 'contact' }
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-lg' : 'bg-white/95 backdrop-blur-sm'
      }`}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <button 
            onClick={() => navigate('/')}
            className="flex items-center transition-transform duration-300 hover:scale-105 cursor-pointer"
          >
            <Logo className="h-32 w-auto" />
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item, index) => (
              <button
                key={index}
                onClick={() => handleNavClick(item)}
                className="text-gray-700 hover:text-sky-600 font-medium transition-colors duration-200 relative group"
              >
                {item.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-sky-600 group-hover:w-full transition-all duration-300"></span>
              </button>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="flex items-center space-x-2 md:space-x-4">
            {/* Cart button - always visible */}
            <CartButton />
            
            {/* Admin and Phone - desktop only */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(isAuthenticated ? '/admin/dashboard' : '/admin/login')}
              title={isAuthenticated ? "Admin Dashboard" : "Admin Login"}
              className="hidden md:flex"
            >
              <User className="w-5 h-5" />
            </Button>
            <a href="tel:3214218996" className="hidden md:block">
              <Button className="bg-amber-500 hover:bg-amber-600 text-white transition-all duration-300 shadow-md hover:shadow-lg">
                <Phone className="w-4 h-4 mr-2" />
                321 4218996
              </Button>
            </a>
            
            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-gray-700 hover:text-sky-600 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-gray-200 pt-4 animate-in slide-in-from-top duration-300">
            {navItems.map((item, index) => (
              <button
                key={index}
                onClick={() => handleNavClick(item)}
                className="block w-full text-left py-3 px-4 text-gray-700 hover:bg-sky-50 hover:text-sky-600 rounded-lg transition-colors"
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => {
                navigate(isAuthenticated ? '/admin/dashboard' : '/admin/login');
                setIsMobileMenuOpen(false);
              }}
              className="block w-full text-left py-3 px-4 text-gray-700 hover:bg-sky-50 hover:text-sky-600 rounded-lg transition-colors"
            >
              <User className="w-4 h-4 inline mr-2" />
              {isAuthenticated ? 'Admin Dashboard' : 'Admin Login'}
            </button>
            <a href="tel:3214218996" className="block mt-4">
              <Button className="w-full bg-amber-500 hover:bg-amber-600 text-white">
                <Phone className="w-4 h-4 mr-2" />
                Llamar Ahora
              </Button>
            </a>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
