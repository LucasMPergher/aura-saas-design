import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu, X, ShoppingBag, LayoutDashboard, User, LogOut } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import auraLogo from "@/assets/aura-logo.png";

const navItems = [
  { name: "Inicio", path: "/" },
  { name: "Catálogo", path: "/catalogo" },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { getTotalItems } = useCart();
  const { user, profile, signOut } = useAuth();
  const cartItemsCount = getTotalItems();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-card">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 flex-shrink-0">
            <img src={auraLogo} alt="ESENCIA" className="h-10 w-10 md:h-12 md:w-12 rounded-full object-cover" />
            <span className="font-serif text-xl md:text-2xl font-semibold text-foreground">ESENCIA</span>
          </Link>

          {/* Desktop Nav - Centrado */}
          <nav className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`relative text-sm font-medium transition-colors hover:text-primary whitespace-nowrap ${
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
            {/* Dashboard link only for admins */}
            {profile?.role === 'admin' && (
              <Link
                to="/dashboard"
                className={`relative text-sm font-medium transition-colors hover:text-primary whitespace-nowrap flex items-center gap-1 ${
                  location.pathname === '/dashboard' ? "text-primary" : "text-muted-foreground"
                }`}
              >
                👑 Dashboard
                {location.pathname === '/dashboard' && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full"
                  />
                )}
              </Link>
            )}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild className="relative">
              <Link to="/carrito">
                <ShoppingBag className="w-4 h-4" />
                Carrito
                {cartItemsCount > 0 && (
                  <Badge variant="gold" className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                    {cartItemsCount}
                  </Badge>
                )}
              </Link>
            </Button>

            {/* User Menu or Login */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant={profile?.role === 'admin' ? 'gold-outline' : 'outline'} 
                    size="sm" 
                    className="gap-2"
                  >
                    {profile?.role === 'admin' ? '👑' : <User className="w-4 h-4" />}
                    {profile?.full_name?.split(' ')[0] || 'Cuenta'}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {profile?.full_name || 'Usuario'}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                      {profile?.role === 'admin' && (
                        <Badge variant="gold" className="text-[10px] w-fit mt-1">
                          👑 Admin
                        </Badge>
                      )}
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/account" className="cursor-pointer">
                      <User className="w-4 h-4 mr-2" />
                      Perfil
                    </Link>
                  </DropdownMenuItem>
                  {profile?.role === 'admin' && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link to="/dashboard" className="cursor-pointer text-aura-gold">
                          <LayoutDashboard className="w-4 h-4 mr-2" />
                          Dashboard
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/admin" className="cursor-pointer text-aura-gold">
                          <LayoutDashboard className="w-4 h-4 mr-2" />
                          Panel Admin
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut} className="cursor-pointer text-destructive">
                    <LogOut className="w-4 h-4 mr-2" />
                    Cerrar sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/login">
                    Ingresar
                  </Link>
                </Button>
                <Button variant="gold" size="sm" asChild>
                  <Link to="/register">
                    Registrarse
                  </Link>
                </Button>
              </>
            )}
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
            <Button variant="outline" className="mt-2 relative" asChild>
              <Link to="/carrito" onClick={() => setIsOpen(false)}>
                <ShoppingBag className="w-4 h-4 mr-2" />
                Carrito
                {cartItemsCount > 0 && (
                  <Badge variant="gold" className="ml-2">
                    {cartItemsCount}
                  </Badge>
                )}
              </Link>
            </Button>
            {user ? (
              <>
                <Button variant="outline" asChild>
                  <Link to="/account" onClick={() => setIsOpen(false)}>
                    <User className="w-4 h-4 mr-2" />
                    Mi cuenta
                  </Link>
                </Button>
                {profile?.role === 'admin' && (
                  <>
                    <Button variant="outline" asChild>
                      <Link to="/dashboard" onClick={() => setIsOpen(false)}>
                        <LayoutDashboard className="w-4 h-4 mr-2" />
                        Dashboard
                      </Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link to="/admin" onClick={() => setIsOpen(false)}>
                        <LayoutDashboard className="w-4 h-4 mr-2" />
                        Admin
                      </Link>
                    </Button>
                  </>
                )}
                <Button variant="destructive" onClick={() => { signOut(); setIsOpen(false); }}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Cerrar sesión
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" asChild>
                  <Link to="/login" onClick={() => setIsOpen(false)}>
                    Ingresar
                  </Link>
                </Button>
                <Button variant="gold" asChild>
                  <Link to="/register" onClick={() => setIsOpen(false)}>
                    Registrarse
                  </Link>
                </Button>
              </>
            )}
          </nav>
        </motion.div>
      )}
    </header>
  );
}
