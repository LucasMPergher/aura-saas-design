import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, ShoppingCart, MessageCircle, Truck, Shield, Package } from "lucide-react";
import { getPerfumeById } from "@/lib/perfumes-data";
import { useCart } from "@/contexts/CartContext";

const PerfumeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const perfume = id ? getPerfumeById(id) : null;

  if (!perfume) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-32 pb-20">
          <div className="container text-center">
            <h1 className="text-3xl font-serif font-bold text-foreground mb-4">
              Perfume no encontrado
            </h1>
            <Button variant="gold" asChild>
              <Link to="/catalogo">Volver al catálogo</Link>
            </Button>
          </div>
        </main>
      </div>
    );
  }

  const handleWhatsApp = () => {
    const message = `Hola! Me interesa ${perfume.name} de ${perfume.brand}`;
    const phone = "5491234567890"; // Reemplazar con número real
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, "_blank");
  };

  const handleAddToCart = () => {
    if (perfume) {
      addToCart(perfume);
      navigate("/carrito");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-20 md:pt-32">
        <div className="container">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-6"
          >
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="gap-2 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver
            </Button>
          </motion.div>

          {/* Main Content - 2 Columns */}
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Left Column - Image */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="bg-aura-night border-aura-smoke/20 overflow-hidden">
                <CardContent className="p-0">
                  <div className="aspect-[3/4] relative">
                    <img
                      src={perfume.imageUrl}
                      alt={perfume.name}
                      className="w-full h-full object-cover"
                    />
                    {perfume.inStock && (
                      <Badge
                        variant="stock"
                        className="absolute top-4 right-4"
                      >
                        En stock
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Right Column - Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              {/* Header Info */}
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Badge
                    variant={
                      perfume.type === "Árabe"
                        ? "gold"
                        : perfume.type === "Diseñador"
                        ? "secondary"
                        : "outline"
                    }
                  >
                    {perfume.type}
                  </Badge>
                  {!perfume.inStock && (
                    <Badge variant="pending">A pedido</Badge>
                  )}
                </div>
                <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-2">
                  {perfume.name}
                </h1>
                <p className="text-xl text-muted-foreground">{perfume.brand}</p>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-aura-gold">
                  ${perfume.price.toLocaleString()}
                </span>
                <span className="text-muted-foreground">ARS</span>
              </div>

              {/* Volume & Concentration */}
              {(perfume.volume || perfume.concentration) && (
                <div className="flex gap-4 text-sm text-muted-foreground">
                  {perfume.volume && (
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4" />
                      <span>{perfume.volume}</span>
                    </div>
                  )}
                  {perfume.concentration && (
                    <span>• {perfume.concentration}</span>
                  )}
                </div>
              )}

              <Separator className="bg-aura-smoke/20" />

              {/* Description */}
              {perfume.description && (
                <div>
                  <h2 className="text-sm font-medium text-aura-gold mb-2 uppercase tracking-wide">
                    Descripción
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {perfume.description}
                  </p>
                </div>
              )}

              {/* Olfactory Notes */}
              {perfume.notes && (
                <div>
                  <h2 className="text-sm font-medium text-aura-gold mb-3 uppercase tracking-wide">
                    Notas Olfativas
                  </h2>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-foreground mb-1">Salida</p>
                      <p className="text-sm text-muted-foreground">
                        {perfume.notes.top.join(", ")}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground mb-1">Corazón</p>
                      <p className="text-sm text-muted-foreground">
                        {perfume.notes.heart.join(", ")}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground mb-1">Fondo</p>
                      <p className="text-sm text-muted-foreground">
                        {perfume.notes.base.join(", ")}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <Separator className="bg-aura-smoke/20" />

              {/* CTA Buttons */}
              <div className="space-y-3">
                <Button
                  variant="gold"
                  size="lg"
                  className="w-full gap-2"
                  onClick={handleAddToCart}
                  disabled={!perfume.inStock}
                >
                  <ShoppingCart className="w-5 h-5" />
                  {perfume.inStock ? "Comprar ahora" : "Sin stock"}
                </Button>
                <Button
                  variant="gold-outline"
                  size="lg"
                  className="w-full gap-2"
                  onClick={handleWhatsApp}
                >
                  <MessageCircle className="w-5 h-5" />
                  Consultar por WhatsApp
                </Button>
              </div>

              {/* Shipping & Guarantees */}
              <Card className="bg-aura-night/50 border-aura-smoke/20">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <Truck className="w-5 h-5 text-aura-gold shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Envío a todo el país</p>
                      <p className="text-xs text-muted-foreground">Entrega en 3-5 días hábiles</p>
                    </div>
                  </div>
                  <Separator className="bg-aura-smoke/20" />
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-aura-gold shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-foreground">100% original</p>
                      <p className="text-xs text-muted-foreground">Garantía de autenticidad</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PerfumeDetail;
