import { motion } from 'framer-motion';
import { Header } from '@/components/Header';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { User, Mail, Calendar, Shield, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Account() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (!user || !profile) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-20 md:pt-32">
        <div className="container max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-2">
              Mi cuenta
            </h1>
            <p className="text-muted-foreground">
              Administrá tu perfil y configuración
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Profile Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="bg-aura-night border-aura-smoke/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5 text-aura-gold" />
                    Información personal
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Nombre completo</p>
                    <p className="text-foreground font-medium">
                      {profile.full_name || 'Sin nombre'}
                    </p>
                  </div>

                  <Separator className="bg-aura-smoke/20" />

                  <div className="flex items-start gap-3">
                    <Mail className="w-4 h-4 text-muted-foreground mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="text-foreground font-medium truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Shield className="w-4 h-4 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground mb-2">Tipo de cuenta</p>
                      <Badge 
                        variant={profile.role === 'admin' ? 'gold' : 'secondary'}
                        className="text-sm"
                      >
                        {profile.role === 'admin' ? '👑 Administrador' : '👤 Cliente'}
                      </Badge>
                      {profile.role === 'admin' && (
                        <p className="text-xs text-aura-gold/60 mt-2">
                          Tenés acceso completo al dashboard y panel de administración
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Calendar className="w-4 h-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Miembro desde</p>
                      <p className="text-foreground">
                        {new Date(profile.created_at).toLocaleDateString('es-AR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Account Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              <Card className="bg-aura-night border-aura-smoke/20">
                <CardHeader>
                  <CardTitle>Acciones</CardTitle>
                  <CardDescription>
                    Administrá tu cuenta y sesión
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {profile.role === 'admin' && (
                    <>
                      <Button
                        variant="gold"
                        className="w-full justify-start"
                        onClick={() => navigate('/dashboard')}
                      >
                        <Shield className="w-4 h-4 mr-2" />
                        Dashboard Admin
                      </Button>
                      
                      <Button
                        variant="gold-outline"
                        className="w-full justify-start"
                        onClick={() => navigate('/admin')}
                      >
                        <Shield className="w-4 h-4 mr-2" />
                        Panel de administración
                      </Button>

                      <Separator className="bg-aura-smoke/20" />
                    </>
                  )}

                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => navigate('/catalogo')}
                  >
                    Ver catálogo
                  </Button>

                  <Separator className="bg-aura-smoke/20" />

                  <Button
                    variant="destructive"
                    className="w-full justify-start"
                    onClick={handleSignOut}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Cerrar sesión
                  </Button>
                </CardContent>
              </Card>

              {/* Account Stats */}
              <Card className="bg-aura-night border-aura-smoke/20">
                <CardHeader>
                  <CardTitle className="text-lg">Estadísticas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 rounded-lg bg-secondary/30">
                      <p className="text-2xl font-bold text-aura-gold">0</p>
                      <p className="text-sm text-muted-foreground">Pedidos</p>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-secondary/30">
                      <p className="text-2xl font-bold text-aura-gold">$0</p>
                      <p className="text-sm text-muted-foreground">Total gastado</p>
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
}
