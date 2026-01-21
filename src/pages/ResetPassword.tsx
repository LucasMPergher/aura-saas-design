import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/Header';
import { supabase } from '@/integrations/supabase';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isValidToken, setIsValidToken] = useState(false);
  const { updatePassword } = useAuth();
  const navigate = useNavigate();

  // Verificar si hay un token válido en la URL
  useEffect(() => {
    const checkToken = async () => {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = hashParams.get('access_token');
      const type = hashParams.get('type');

      if (type === 'recovery' && accessToken) {
        setIsValidToken(true);
      } else {
        // No hay token válido, redirigir
        setTimeout(() => navigate('/forgot-password'), 3000);
      }
    };

    checkToken();
  }, [navigate]);

  const passwordRequirements = [
    { label: 'Mínimo 8 caracteres', met: password.length >= 8 },
    { label: 'Las contraseñas coinciden', met: password === confirmPassword && password.length > 0 },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return;
    }

    if (password.length < 8) {
      return;
    }

    setIsLoading(true);

    try {
      await updatePassword(password);
      
      // Esperar un momento y redirigir
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isValidToken) {
    return (
      <div className="min-h-screen bg-gradient-dark">
        <Header />
        <div className="container mx-auto px-4 pt-32 pb-16">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-md mx-auto text-center"
          >
            <Card className="bg-aura-night border-aura-smoke/20">
              <CardHeader>
                <CardTitle className="text-2xl font-serif text-destructive">
                  ❌ Link Inválido o Expirado
                </CardTitle>
                <CardDescription>
                  El link de recuperación no es válido o ya expiró.
                  Serás redirigido a la página de recuperación...
                </CardDescription>
              </CardHeader>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

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
                🔐 Nueva Contraseña
              </CardTitle>
              <CardDescription>
                Ingresa tu nueva contraseña segura
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Nueva Contraseña</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10"
                      required
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                {/* Requisitos de contraseña */}
                <div className="space-y-2 p-3 bg-background/50 rounded-lg">
                  {passwordRequirements.map((req, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                        req.met ? 'bg-green-500' : 'bg-muted'
                      }`}>
                        {req.met && <Check className="w-3 h-3 text-background" />}
                      </div>
                      <span className={req.met ? 'text-green-400' : 'text-muted-foreground'}>
                        {req.label}
                      </span>
                    </div>
                  ))}
                </div>

                <Button
                  type="submit"
                  variant="gold"
                  className="w-full"
                  disabled={isLoading || !passwordRequirements.every(req => req.met)}
                >
                  {isLoading ? 'Actualizando...' : 'Actualizar Contraseña'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Tip de seguridad */}
          <div className="mt-6 p-4 bg-aura-night/50 border border-aura-smoke/10 rounded-lg">
            <h3 className="text-sm font-semibold text-aura-gold mb-2">
              💡 Consejos de seguridad
            </h3>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Usa una combinación de letras, números y símbolos</li>
              <li>• No uses contraseñas que hayas usado antes</li>
              <li>• Considera usar un gestor de contraseñas</li>
              <li>• Guarda esta contraseña en un lugar seguro</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
