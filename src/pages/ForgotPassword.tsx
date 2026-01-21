import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/Header';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await resetPassword(email);
      setEmailSent(true);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-dark">
      <Header />
      
      <div className="container mx-auto px-4 pt-32 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto"
        >
          <Card className="bg-aura-night border-aura-smoke/20">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-serif text-aura-gold">
                {emailSent ? '📧 Email Enviado' : '🔑 Recuperar Contraseña'}
              </CardTitle>
              <CardDescription>
                {emailSent 
                  ? 'Revisa tu bandeja de entrada y sigue las instrucciones'
                  : 'Ingresa tu email para recibir instrucciones de recuperación'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {emailSent ? (
                <div className="space-y-4">
                  <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <p className="text-sm text-green-400">
                      ✅ Email enviado a <strong>{email}</strong>
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Si no lo ves, revisa tu carpeta de spam
                    </p>
                  </div>
                  
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/login">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Volver al login
                    </Link>
                  </Button>

                  <Button 
                    variant="ghost" 
                    className="w-full"
                    onClick={() => setEmailSent(false)}
                  >
                    Enviar a otro email
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="tu@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        required
                        autoFocus
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    variant="gold"
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Enviando...' : 'Enviar Email de Recuperación'}
                  </Button>

                  <div className="text-center">
                    <Link 
                      to="/login"
                      className="text-sm text-aura-gold hover:text-aura-gold/80 transition-colors inline-flex items-center gap-1"
                    >
                      <ArrowLeft className="w-3 h-3" />
                      Volver al login
                    </Link>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>

          {/* Información adicional */}
          <div className="mt-6 p-4 bg-aura-night/50 border border-aura-smoke/10 rounded-lg">
            <h3 className="text-sm font-semibold text-aura-gold mb-2">
              💡 ¿No recibes el email?
            </h3>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Verifica que el email esté escrito correctamente</li>
              <li>• Revisa tu carpeta de spam o correo no deseado</li>
              <li>• Espera unos minutos, a veces tarda un poco</li>
              <li>• El link expira en 1 hora</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
