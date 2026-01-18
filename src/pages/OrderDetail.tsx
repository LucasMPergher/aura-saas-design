import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User, MapPin, CreditCard, Truck, Package, Phone, MessageCircle } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import perfume2 from "@/assets/perfume-2.jpg";
import perfume4 from "@/assets/perfume-4.jpg";

const orderData = {
  id: "AUR-001",
  status: "pagado",
  date: "18 Enero 2026, 14:30",
  customer: {
    name: "María González",
    phone: "+54 11 1234-5678",
    instagram: "@maria.gonzalez",
  },
  shipping: {
    address: "Av. Corrientes 1234, CABA",
    method: "Envío express",
    tracking: "AR123456789",
  },
  payment: {
    method: "Transferencia bancaria",
    status: "Confirmado",
    reference: "TRF-2026011801",
  },
  products: [
    { name: "Oud Al Layl", brand: "Lattafa", price: 45000, quantity: 1, imageUrl: perfume2 },
    { name: "Amber Oud", brand: "Al Haramain", price: 38000, quantity: 1, imageUrl: perfume4 },
  ],
  subtotal: 83000,
  shipping_cost: 3500,
  total: 86500,
};

const statusConfig = {
  pendiente: { label: "Pendiente", variant: "pending" as const },
  pagado: { label: "Pagado", variant: "stock" as const },
  enviado: { label: "Enviado", variant: "secondary" as const },
  entregado: { label: "Entregado", variant: "gold" as const },
};

const OrderDetail = () => {
  const { id } = useParams();
  const statusInfo = statusConfig[orderData.status as keyof typeof statusConfig];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-20 md:pt-32">
        <div className="container max-w-4xl">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Button variant="ghost" size="sm" className="mb-6" asChild>
              <Link to="/dashboard">
                <ArrowLeft className="w-4 h-4" />
                Volver al Dashboard
              </Link>
            </Button>
          </motion.div>

          {/* Order Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8"
          >
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl md:text-3xl font-serif font-bold text-foreground">
                  Pedido #{orderData.id}
                </h1>
                <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
              </div>
              <p className="text-muted-foreground">{orderData.date}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <MessageCircle className="w-4 h-4" />
                WhatsApp
              </Button>
              <Button variant="gold" size="sm">
                <Truck className="w-4 h-4" />
                Marcar enviado
              </Button>
            </div>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Customer Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="font-serif text-lg flex items-center gap-2">
                    <User className="w-5 h-5 text-primary" />
                    Cliente
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="font-medium text-foreground">{orderData.customer.name}</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                      <Phone className="w-4 h-4" />
                      {orderData.customer.phone}
                    </p>
                    <p className="text-sm text-primary mt-1">{orderData.customer.instagram}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Shipping Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="font-serif text-lg flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary" />
                    Envío
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-foreground">{orderData.shipping.address}</p>
                  <p className="text-sm text-muted-foreground">{orderData.shipping.method}</p>
                  <p className="text-sm text-primary font-mono">Tracking: {orderData.shipping.tracking}</p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Payment Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="font-serif text-lg flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-primary" />
                    Pago
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between items-center">
                    <p className="text-foreground">{orderData.payment.method}</p>
                    <Badge variant="stock">{orderData.payment.status}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground font-mono">
                    Ref: {orderData.payment.reference}
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="font-serif text-lg flex items-center gap-2">
                    <Package className="w-5 h-5 text-primary" />
                    Resumen
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="text-foreground">${orderData.subtotal.toLocaleString("es-AR")}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Envío</span>
                    <span className="text-foreground">${orderData.shipping_cost.toLocaleString("es-AR")}</span>
                  </div>
                  <div className="border-t border-border pt-3 flex justify-between">
                    <span className="font-semibold text-foreground">Total</span>
                    <span className="font-bold text-xl text-primary">
                      ${orderData.total.toLocaleString("es-AR")}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Products List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-6"
          >
            <Card>
              <CardHeader>
                <CardTitle className="font-serif text-lg">Productos ({orderData.products.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {orderData.products.map((product, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 rounded-xl bg-secondary/30">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground">{product.name}</p>
                      <p className="text-sm text-muted-foreground">{product.brand}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-foreground">
                        ${product.price.toLocaleString("es-AR")}
                      </p>
                      <p className="text-xs text-muted-foreground">x{product.quantity}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default OrderDetail;
