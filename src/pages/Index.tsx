import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { PerfumeCard } from "@/components/PerfumeCard";
import { ArrowRight, Sparkles, Shield, Truck, Instagram } from "lucide-react";
import { Link } from "react-router-dom";
import auraLogo from "@/assets/aura-logo.png";
import perfume1 from "@/assets/perfume-1.jpg";
import perfume2 from "@/assets/perfume-2.jpg";
import perfume3 from "@/assets/perfume-3.jpg";
import perfume4 from "@/assets/perfume-4.jpg";

const featuredPerfumes = [
  {
    id: "1",
    name: "Oud Al Layl",
    brand: "Lattafa",
    type: "Árabe" as const,
    price: 45000,
    imageUrl: perfume2,
    inStock: true,
    featured: true,
  },
  {
    id: "2",
    name: "Aventus",
    brand: "Creed",
    type: "Nicho" as const,
    price: 120000,
    imageUrl: perfume1,
    inStock: false,
  },
  {
    id: "3",
    name: "Bleu de Chanel",
    brand: "Chanel",
    type: "Diseñador" as const,
    price: 85000,
    imageUrl: perfume3,
    inStock: true,
  },
  {
    id: "4",
    name: "Amber Oud",
    brand: "Al Haramain",
    type: "Árabe" as const,
    price: 38000,
    imageUrl: perfume4,
    inStock: true,
  },
];

const features = [
  {
    icon: Sparkles,
    title: "Fragancias Exclusivas",
    description: "Perfumes importados de las mejores casas del mundo",
  },
  {
    icon: Shield,
    title: "100% Originales",
    description: "Garantía de autenticidad en cada producto",
  },
  {
    icon: Truck,
    title: "Envío Nacional",
    description: "Llegamos a todo el país con embalaje premium",
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-hero">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-44 md:pb-32 overflow-hidden">
        {/* Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
        
        <div className="container relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto"
          >
            {/* Logo */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="inline-block mb-8"
            >
              <img
                src={auraLogo}
                alt="ESENCIA"
                className="w-28 h-28 md:w-36 md:h-36 rounded-full shadow-float mx-auto"
              />
            </motion.div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-foreground mb-6">
              Descubre tu <span className="text-gradient-gold">esencia</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-xl mx-auto">
              Fragancias exclusivas de las mejores casas del mundo. 
              Perfumes árabes, de diseñador y nicho.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button variant="gold" size="xl" asChild>
                <Link to="/catalogo">
                  Ver Catálogo
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button variant="gold-outline" size="lg" asChild>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                  <Instagram className="w-5 h-5" />
                  Síguenos en Instagram
                </a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 border-t border-b border-border/30">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 mb-4">
                  <feature.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Catalog */}
      <section className="py-20 md:py-28">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
              Fragancias Destacadas
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Nuestra selección de perfumes más exclusivos
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredPerfumes.map((perfume) => (
              <PerfumeCard key={perfume.id} {...perfume} />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Button variant="gold-outline" size="lg" asChild>
              <Link to="/catalogo">
                Ver todo el catálogo
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-gold opacity-5" />
        <div className="container relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
              ¿Buscás un perfume en particular?
            </h2>
            <p className="text-muted-foreground mb-8">
              Escribinos por WhatsApp o Instagram y te ayudamos a encontrar tu fragancia ideal
            </p>
            <Button variant="gold" size="xl" asChild>
              <a href="https://wa.me/5491112345678" target="_blank" rel="noopener noreferrer">
                Contactanos
                <ArrowRight className="w-5 h-5" />
              </a>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t border-border/30">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img src={auraLogo} alt="AURA" className="w-8 h-8 rounded-full" />
              <span className="font-serif text-lg font-semibold">AURA</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2026 AURA. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
