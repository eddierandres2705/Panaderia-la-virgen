// Mock data para Panadería de la Virgen

export const products = [
  {
    id: 1,
    name: "Tortas de Cumpleaños",
    description: "Tortas personalizadas para cada celebración. Elige tu sabor favorito y diseño único.",
    category: "Tortas",
    price: 4500000,  // $45.000 COP in centavos
    image: "https://images.unsplash.com/photo-1558636508-e0db3814bd1d?w=800&q=80"
  },
  {
    id: 2,
    name: "Brazo de Reina Frío",
    description: "Un clásico que encanta por su suavidad. Perfecto para compartir en familia.",
    category: "Postres",
    price: 3500000,  // $35.000
    image: "https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=800&q=80"
  },
  {
    id: 3,
    name: "Galletas Artesanales",
    description: "Perfectas para acompañar tu café. Variedad de sabores únicos.",
    category: "Galletas",
    price: 1200000,  // $12.000/docena
    image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=800&q=80"
  },
  {
    id: 4,
    name: "Tartas Especiales",
    description: "Dulces que convierten cualquier día en especial. Para toda ocasión.",
    category: "Tartas",
    price: 3000000,  // $30.000
    image: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=800&q=80"
  },
  {
    id: 5,
    name: "Pan Fresco Diario",
    description: "Variedad de pan recién horneado todos los días. Calidad y sabor garantizados.",
    category: "Pan",
    price: 150000,  // $1.500
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=80"
  },
  {
    id: 6,
    name: "Postres del Día",
    description: "Deliciosos postres frescos preparados diariamente con ingredientes de calidad.",
    category: "Postres",
    price: 800000,  // $8.000
    image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&q=80"
  }
];

export const reviews = [
  {
    id: 1,
    name: "Isabel Rojas",
    rating: 5,
    comment: "Muy TOP, siempre me han dado gusto en mis pedidos de tortas.",
    date: "Hace 2 meses"
  },
  {
    id: 2,
    name: "Jair Cubides",
    rating: 5,
    comment: "Excelente sabor y textura, de las 3 mejores panaderías de Puerto Carreño.",
    date: "Hace 1 mes"
  },
  {
    id: 3,
    name: "Yohnny",
    rating: 4,
    comment: "Variedad de pan de muy buena calidad y sabor, se las recomiendo ☕.",
    date: "Hace 3 semanas"
  },
  {
    id: 4,
    name: "María González",
    rating: 5,
    comment: "Las tortas más deliciosas de Puerto Carreño. El brazo de reina es espectacular.",
    date: "Hace 1 semana"
  },
  {
    id: 5,
    name: "Carlos Méndez",
    rating: 4,
    comment: "Pan fresco todos los días y excelente atención. Muy recomendado.",
    date: "Hace 4 días"
  }
];

export const timeline = [
  {
    year: "2006",
    title: "Nuestros Inicios",
    description: "Abrimos nuestras puertas en el barrio Camilo Cortés con la misión de ofrecer pan fresco y de calidad."
  },
  {
    year: "2010",
    title: "Expansión de Productos",
    description: "Incorporamos tortas personalizadas y postres artesanales a nuestro menú."
  },
  {
    year: "2015",
    title: "Reconocimiento Local",
    description: "Nos consolidamos como una de las panaderías favoritas de Puerto Carreño."
  },
  {
    year: "2020",
    title: "Innovación Constante",
    description: "Implementamos nuevas recetas y métodos de pedido para servir mejor a nuestros clientes."
  },
  {
    year: "2026",
    title: "20 Años de Tradición",
    description: "Celebramos dos décadas horneando momentos felices para las familias de Puerto Carreño."
  }
];

export const contactInfo = {
  address: "Barrio Camilo Cortés, Cl. 22 #11-50, Puerto Carreño, Vichada",
  phone: "321 4218996",
  hours: "Abierto todos los días hasta las 10 p.m.",
  services: ["Consumo en el lugar", "Para llevar"],
  rating: 4.3,
  totalReviews: 112,
  mapUrl: "https://www.google.com/maps?q=Puerto+Carreño,+Vichada"
};
