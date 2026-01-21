import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/Header';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase';
import { useState } from 'react';

export default function DebugAuth() {
  const { user, profile, loading, isAdmin, refreshProfile } = useAuth();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [rawProfile, setRawProfile] = useState<any>(null);

  const fetchProfileDirectly = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    setRawProfile({ data, error });
  };

  const handleRefreshProfile = async () => {
    await refreshProfile();
    await fetchProfileDirectly();
  };

  const handleForceLogoutAndClearCache = async () => {
    // Limpiar TODO
    localStorage.clear();
    sessionStorage.clear();
    
    // Cerrar sesión
    await supabase.auth.signOut();
    
    // Recargar
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-gradient-dark">
      <Header />
      
      <div className="container mx-auto px-4 pt-32 pb-16">
        <h1 className="text-3xl font-serif font-bold text-aura-gold mb-8">
          🔍 Debug de Autenticación
        </h1>

        {/* Estado de AuthContext */}
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Estado de AuthContext</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <strong>Loading:</strong> {loading ? '✅ Sí' : '❌ No'}
            </div>
            <div>
              <strong>User:</strong> {user ? '✅ Existe' : '❌ No existe'}
            </div>
            <div>
              <strong>User Email:</strong> {user?.email || 'N/A'}
            </div>
            <div>
              <strong>User ID:</strong> 
              <code className="ml-2 text-xs bg-muted p-1 rounded">{user?.id || 'N/A'}</code>
            </div>
            <div>
              <strong>Profile:</strong> {profile ? '✅ Existe' : '❌ No existe'}
            </div>
            <div>
              <strong>Profile Role:</strong> 
              <Badge variant={profile?.role === 'admin' ? 'gold' : 'secondary'} className="ml-2">
                {profile?.role || 'N/A'}
              </Badge>
            </div>
            <div>
              <strong>Profile Full Name:</strong> {profile?.full_name || 'N/A'}
            </div>
            <div>
              <strong>isAdmin:</strong> {isAdmin ? '✅ TRUE' : '❌ FALSE'}
            </div>
          </CardContent>
        </Card>

        {/* Profile completo */}
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Profile Object (completo)</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted p-4 rounded text-xs overflow-auto">
              {JSON.stringify(profile, null, 2) || 'null'}
            </pre>
          </CardContent>
        </Card>

        {/* User completo */}
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>User Object (completo)</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted p-4 rounded text-xs overflow-auto max-h-96">
              {JSON.stringify(user, null, 2) || 'null'}
            </pre>
          </CardContent>
        </Card>

        {/* Fetch directo */}
        <Card>
          <CardHeader>
            <CardTitle>Fetch Directo a Supabase</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={fetchProfileDirectly} disabled={!user}>
              Fetchear Profile Directamente
            </Button>
            {rawProfile && (
              <div>
                <strong>Resultado:</strong>
                <pre className="bg-muted p-4 rounded text-xs overflow-auto mt-2">
                  {JSON.stringify(rawProfile, null, 2)}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Acciones de debug */}
        <Card className="mt-4 border-aura-gold/50">
          <CardHeader>
            <CardTitle className="text-aura-gold">⚠️ Solución de Problemas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm">
              <p className="font-semibold mb-2">Si isAdmin es FALSE pero en Supabase eres admin:</p>
              <ol className="list-decimal list-inside space-y-1 text-xs">
                <li>Presiona el botón rojo de abajo</li>
                <li>Volverás al login automáticamente</li>
                <li>Inicia sesión nuevamente</li>
                <li>El rol debería cargarse correctamente</li>
              </ol>
            </div>
            
            <Button
              onClick={handleForceLogoutAndClearCache}
              variant="destructive"
              className="w-full"
            >
              🔥 Cerrar Sesión + Limpiar Todo + Reiniciar
            </Button>
          </CardContent>
        </Card>

        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Otras Acciones</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              onClick={handleRefreshProfile}
              variant="gold"
              className="w-full"
              disabled={!user}
            >
              🔄 Refrescar Perfil desde Supabase
            </Button>
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
              className="w-full"
            >
              🔄 Recargar Página
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
