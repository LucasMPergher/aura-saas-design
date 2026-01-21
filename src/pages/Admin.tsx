import { motion } from 'framer-motion';
import { Header } from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Settings, Users, Package } from 'lucide-react';

export default function Admin() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-20 md:pt-32">
        <div className="container max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-2">
              <Shield className="w-8 h-8 text-aura-gold" />
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground">
                Panel de Administración
              </h1>
            </div>
            <p className="text-muted-foreground">
              Gestión completa del sistema AURA
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Placeholder Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="bg-aura-night border-aura-smoke/20 hover:border-aura-gold/50 transition-colors">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-aura-gold" />
                    Usuarios
                  </CardTitle>
                  <CardDescription>
                    Administrar clientes y permisos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Funcionalidad próximamente...
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="bg-aura-night border-aura-smoke/20 hover:border-aura-gold/50 transition-colors">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="w-5 h-5 text-aura-gold" />
                    Productos
                  </CardTitle>
                  <CardDescription>
                    Gestionar catálogo de perfumes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Funcionalidad próximamente...
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="bg-aura-night border-aura-smoke/20 hover:border-aura-gold/50 transition-colors">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5 text-aura-gold" />
                    Configuración
                  </CardTitle>
                  <CardDescription>
                    Ajustes del sistema
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Funcionalidad próximamente...
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
