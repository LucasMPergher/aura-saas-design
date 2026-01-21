import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { StatsCard } from "@/components/StatsCard";
import { OrderRow } from "@/components/OrderRow";
import { AlertItem } from "@/components/AlertItem";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DollarSign, ShoppingBag, Users, TrendingUp, Plus, Bell, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useOrders } from "@/integrations/supabase/hooks/useOrders";
import { useState } from "react";

interface OrderItem {
  id: string;
  perfume_id: string;
  perfume_name: string;
  perfume_brand: string;
  quantity: number;
  unit_price: number;
  in_stock: boolean;
}

interface Order {
  id: number;
  order_number?: number;
  customer_name?: string;
  customer_phone?: string;
  total_amount: number;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled" | "pendiente" | "pagado" | "enviado" | "entregado";
  created_at: string;
  order_items?: OrderItem[];
}

const Dashboard = () => {
  const [showBackorders, setShowBackorders] = useState(false);
  
  // Fetch orders from Supabase
  const { 
    data: orders, 
    isLoading, 
    error 
  } = useOrders({ 
    hasBackorder: showBackorders ? true : undefined 
  });

  // Calculate stats from real data
  const totalOrders = orders?.length || 0;
  const totalRevenue = orders?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0;
  const backorderCount = orders?.filter(order => 
    order.order_items?.some((item: OrderItem) => !item.in_stock)
  ).length || 0;

  const stats = [
    { 
      title: "Ventas del mes", 
      value: `$${totalRevenue.toLocaleString()}`, 
      change: "+12%", 
      changeType: "positive" as const, 
      icon: DollarSign 
    },
    { 
      title: "Pedidos", 
      value: totalOrders.toString(), 
      change: "+8%", 
      changeType: "positive" as const, 
      icon: ShoppingBag 
    },
    { 
      title: "Productos a pedido", 
      value: backorderCount.toString(), 
      change: showBackorders ? "Filtrado" : "", 
      changeType: "neutral" as const, 
      icon: Bell 
    },
    { 
      title: "Tasa conversión", 
      value: "4.2%", 
      change: "-2%", 
      changeType: "negative" as const, 
      icon: TrendingUp 
    },
  ];

  const alerts = [
    { type: "stock" as const, message: "Stock bajo: Oud Al Layl (2 unidades)", time: "Hace 2 horas" },
    { type: "order" as const, message: "Nuevo pedido recibido", time: "Hace 3 horas" },
    { type: "stock" as const, message: "Sin stock: Aventus - Creed", time: "Hace 5 horas" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-20 md:pt-32">
        <div className="container">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8"
          >
            <div>
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-2">
                Dashboard
              </h1>
              <p className="text-muted-foreground">
                Bienvenido de vuelta. Esto es lo que está pasando hoy.
              </p>
            </div>
            <Button variant="gold" asChild>
              <Link to="/catalogo">
                <Plus className="w-4 h-4" />
                Nuevo Pedido
              </Link>
            </Button>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => (
              <StatsCard key={stat.title} {...stat} delay={index * 0.1} />
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Recent Orders */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="lg:col-span-2"
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <CardTitle className="font-serif text-xl">Pedidos Recientes</CardTitle>
                    <Button
                      variant={showBackorders ? "gold" : "outline"}
                      size="sm"
                      onClick={() => setShowBackorders(!showBackorders)}
                    >
                      <Bell className="w-4 h-4 mr-2" />
                      {showBackorders ? "Todos" : "Solo a pedido"}
                    </Button>
                  </div>
                  {showBackorders && (
                    <Badge variant="gold" className="w-fit">
                      Mostrando solo productos a pedido
                    </Badge>
                  )}
                </CardHeader>
                <CardContent className="space-y-3">
                  {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin text-aura-gold" />
                    </div>
                  ) : error ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>Error al cargar pedidos</p>
                      <p className="text-sm mt-2">Verifica la conexión con Supabase</p>
                    </div>
                  ) : orders && orders.length > 0 ? (
                    orders.slice(0, 6).map((order: Order) => {
                      const hasBackorder = order.order_items?.some((item: OrderItem) => !item.in_stock);
                      const productNames = order.order_items?.map((item: OrderItem) => item.perfume_name) || [];
                      
                      return (
                        <OrderRow
                          key={order.id}
                          id={`#${order.order_number || order.id}`}
                          customer={order.customer_name || "Cliente"}
                          products={productNames}
                          total={order.total_amount}
                          status={order.status}
                          date={new Date(order.created_at).toLocaleDateString('es-AR', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                          hasBackorder={hasBackorder}
                        />
                      );
                    })
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <ShoppingBag className="w-12 h-12 mx-auto mb-3 text-aura-gold/50" />
                      <p>No hay pedidos todavía</p>
                      <p className="text-sm mt-2">
                        {showBackorders 
                          ? "No hay productos a pedido" 
                          : "Los pedidos aparecerán aquí"}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Alerts */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="font-serif text-xl flex items-center gap-2">
                    <Bell className="w-5 h-5 text-primary" />
                    Alertas
                  </CardTitle>
                  <span className="text-xs text-muted-foreground">{alerts.length} nuevas</span>
                </CardHeader>
                <CardContent className="space-y-1">
                  {alerts.map((alert, index) => (
                    <AlertItem key={index} {...alert} />
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};



export default Dashboard;


