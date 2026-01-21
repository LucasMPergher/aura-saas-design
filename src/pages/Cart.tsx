import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, Trash2, Plus, Minus, MessageCircle, ArrowLeft } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useSaveOrder } from "@/integrations/supabase/hooks/useOrders";
import { toast } from "sonner";

const Cart = () => {
  const navigate = useNavigate();
  const { items, removeFromCart, updateQuantity, getSubtotal, getTotal, clearCart } = useCart();
  const { user } = useAuth();
  const saveOrder = useSaveOrder();

  const handleWhatsAppOrder = async () => {
    if (items.length === 0) return;

    // Verificar autenticación
    if (!user) {
      toast.error("Inicia sesión para continuar", {
        description: "Necesitas una cuenta para realizar pedidos",
      });
      // Guardar la ruta actual para volver después del login
      navigate('/login?redirect=/carrito');
      return;
    }

    try {
      // 1. Guardar pedido en Supabase
      const orderData = {
        total_amount: getTotal(),
        status: 'pending' as const,
        items: items.map(item => ({
          perfume_id: item.id,
          perfume_name: item.name,
          perfume_brand: item.brand,
          quantity: item.quantity,
          unit_price: item.price,
          in_stock: item.inStock,
        })),
      };

      const order = await saveOrder.mutateAsync(orderData);

      // 2. Construir mensaje de WhatsApp
      let message = `🛍️ *Pedido ESENCIA #${order.order_number || order.id}*\n\n`;
      
      items.forEach((item, index) => {
        const status = item.inStock ? "✅ En stock" : "📦 A pedido";
        message += `${index + 1}. *${item.name}*\n`;
        message += `   ${item.brand}\n`;
        message += `   Cantidad: ${item.quantity}\n`;
        message += `   Precio: $${item.price.toLocaleString()}\n`;
        message += `   ${status}\n\n`;
      });

      message += `💰 *Total: $${getTotal().toLocaleString()}*\n\n`;
      
      const hasBackorder = items.some(item => !item.inStock);
      if (hasBackorder) {
        message += "⚠️ Algunos productos están a pedido\n\n";
      }

      message += `📋 Referencia: #${order.order_number || order.id}`;

      // 3. Limpiar carrito
      clearCart();

      // 4. Abrir WhatsApp
      const phone = "5491234567890"; // Reemplazar con número real
      const encodedMessage = encodeURIComponent(message);
      window.open(`https://wa.me/${phone}?text=${encodedMessage}`, "_blank");

      toast.success("Pedido registrado", {
        description: `Tu pedido #${order.order_number || order.id} ha sido guardado exitosamente`,
      });

    } catch (error) {
      console.error("Error al guardar pedido:", error);
      toast.error("Error al procesar el pedido", {
        description: "Por favor intenta nuevamente o contacta por WhatsApp directamente",
      });
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-20 md:pt-32">
          <div className="container max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <div className="mb-6 flex justify-center">
                <div className="rounded-full bg-aura-night p-6">
                  <ShoppingBag className="w-12 h-12 text-aura-gold" />
                </div>
              </div>
              <h1 className="text-3xl font-serif font-bold text-foreground mb-4">
                Tu carrito está vacío
              </h1>
              <p className="text-muted-foreground mb-8">
                Descubrí nuestra colección de fragancias exclusivas
              </p>
              <Button variant="gold" size="lg" asChild>
                <Link to="/catalogo">
                  Explorar catálogo
                </Link>
              </Button>
            </motion.div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-20 md:pt-32">
        <div className="container max-w-5xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Button
              variant="ghost"
              asChild
              className="gap-2 text-muted-foreground hover:text-foreground mb-4"
            >
              <Link to="/catalogo">
                <ArrowLeft className="w-4 h-4" />
                Seguir comprando
              </Link>
            </Button>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground">
              Tu carrito
            </h1>
            <p className="text-muted-foreground mt-2">
              {items.length} {items.length === 1 ? 'producto' : 'productos'}
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Products List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-2 space-y-4"
            >
              {items.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <Card className="bg-aura-night border-aura-smoke/20">
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        {/* Image */}
                        <div className="relative w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-gradient-dark">
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="min-w-0">
                              <h3 className="font-serif font-semibold text-foreground truncate">
                                {item.name}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {item.brand}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="shrink-0 text-muted-foreground hover:text-destructive"
                              onClick={() => removeFromCart(item.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>

                          <div className="flex items-center justify-between gap-4">
                            {/* Quantity Controls */}
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              >
                                <Minus className="w-3 h-3" />
                              </Button>
                              <span className="w-8 text-center font-medium">
                                {item.quantity}
                              </span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              >
                                <Plus className="w-3 h-3" />
                              </Button>
                            </div>

                            {/* Price & Status */}
                            <div className="text-right">
                              <p className="font-semibold text-aura-gold">
                                ${(item.price * item.quantity).toLocaleString()}
                              </p>
                              <Badge
                                variant={item.inStock ? "stock" : "pending"}
                                className="mt-1"
                              >
                                {item.inStock ? "En stock" : "A pedido"}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            {/* Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-1"
            >
              <Card className="bg-aura-night border-aura-smoke/20 sticky top-24">
                <CardContent className="p-6 space-y-4">
                  <h2 className="text-xl font-serif font-bold text-foreground">
                    Resumen
                  </h2>

                  <Separator className="bg-aura-smoke/20" />

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium">${getSubtotal().toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Envío</span>
                      <span className="text-sm text-muted-foreground">A calcular</span>
                    </div>
                  </div>

                  <Separator className="bg-aura-smoke/20" />

                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-foreground">Total</span>
                    <span className="text-2xl font-bold text-aura-gold">
                      ${getTotal().toLocaleString()}
                    </span>
                  </div>

                  <Button
                    variant="gold"
                    size="lg"
                    className="w-full gap-2"
                    onClick={handleWhatsAppOrder}
                    disabled={saveOrder.isPending}
                  >
                    <MessageCircle className="w-5 h-5" />
                    {saveOrder.isPending ? "Procesando..." : "Hacer Pedido"}
                  </Button>

                  {items.some(item => !item.inStock) && (
                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3">
                      <p className="text-xs text-amber-200">
                        ⚠️ Algunos productos están a pedido. Te confirmaremos disponibilidad
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Cart;
