import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu, X, ShoppingBag, LayoutDashboard } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import auraLogo from "@/assets/aura-logo.png";

const navItems = [
  { name: "Inicio", path: "/" },
  { name: "Catálogo", path: "/catalogo" },
  { name: "Dashboard", path: "/dashboard" },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-card">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img src={auraLogo} alt="AURA" className="h-10 w-10 md:h-12 md:w-12 rounded-full object-cover" />
            <span className="font-serif text-xl md:text-2xl font-semibold text-foreground">AURA</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`relative text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname === item.path ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {item.name}
                {location.pathname === item.path && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full"
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/dashboard">
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>
            </Button>
            <Button variant="gold" size="sm" asChild>
              <Link to="/catalogo">
                <ShoppingBag className="w-4 h-4" />
                Ver Catálogo
              </Link>
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-foreground"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="md:hidden bg-card border-t border-border"
        >
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`text-base font-medium py-2 ${
                  location.pathname === item.path ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {item.name}
              </Link>
            ))}
            <Button variant="gold" className="mt-2" asChild>
              <Link to="/catalogo" onClick={() => setIsOpen(false)}>
                <ShoppingBag className="w-4 h-4" />
                Ver Catálogo
              </Link>
            </Button>
          </nav>
        </motion.div>
      )}
    </header>
  );
}
