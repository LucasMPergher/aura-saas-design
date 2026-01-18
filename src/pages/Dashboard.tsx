import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { StatsCard } from "@/components/StatsCard";
import { OrderRow } from "@/components/OrderRow";
import { AlertItem } from "@/components/AlertItem";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, ShoppingBag, Users, TrendingUp, Plus, Bell } from "lucide-react";
import { Link } from "react-router-dom";

const stats = [
  { title: "Ventas del mes", value: "$1.250.000", change: "+12%", changeType: "positive" as const, icon: DollarSign },
  { title: "Pedidos", value: "47", change: "+8%", changeType: "positive" as const, icon: ShoppingBag },
  { title: "Clientes nuevos", value: "23", change: "+15%", changeType: "positive" as const, icon: Users },
  { title: "Tasa conversión", value: "4.2%", change: "-2%", changeType: "negative" as const, icon: TrendingUp },
];

const recentOrders = [
  { id: "AUR-001", customer: "María González", products: ["Oud Al Layl", "Raghba"], total: 73000, status: "pendiente" as const, date: "Hoy, 14:30" },
  { id: "AUR-002", customer: "Carlos Rodríguez", products: ["Aventus"], total: 120000, status: "pagado" as const, date: "Hoy, 11:15" },
  { id: "AUR-003", customer: "Ana Martínez", products: ["Bleu de Chanel"], total: 85000, status: "enviado" as const, date: "Ayer, 18:45" },
  { id: "AUR-004", customer: "Lucas Fernández", products: ["Amber Oud", "Sultan Al Oud"], total: 90000, status: "entregado" as const, date: "17 Ene" },
];

const alerts = [
  { type: "stock" as const, message: "Stock bajo: Oud Al Layl (2 unidades)", time: "Hace 2 horas" },
  { type: "order" as const, message: "Nuevo pedido de María González", time: "Hace 3 horas" },
  { type: "stock" as const, message: "Sin stock: Aventus - Creed", time: "Hace 5 horas" },
];

const Dashboard = () => {
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
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="font-serif text-xl">Pedidos Recientes</CardTitle>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/pedidos">Ver todos</Link>
                  </Button>
                </CardHeader>
                <CardContent className="space-y-3">
                  {recentOrders.map((order) => (
                    <OrderRow key={order.id} {...order} />
                  ))}
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
