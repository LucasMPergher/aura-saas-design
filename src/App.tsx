import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Catalog from "./pages/Catalog";
import Dashboard from "./pages/Dashboard";
import OrderDetail from "./pages/OrderDetail";
import PerfumeDetail from "./pages/PerfumeDetail";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Account from "./pages/Account";
import Admin from "./pages/Admin";
import DebugAuth from "./pages/DebugAuth";
import NotFound from "./pages/NotFound";

// ⚡ Configuración optimizada de React Query para mejor performance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutos - los datos se consideran frescos
      gcTime: 10 * 60 * 1000, // 10 minutos - mantener en cache (antes cacheTime)
      retry: 1, // Solo 1 reintento en caso de error
      refetchOnWindowFocus: false, // No refetch al cambiar de pestaña
      refetchOnMount: false, // No refetch al montar si hay cache
    },
  },
});

const App = () => {
  // 🔍 Debug: Verificar conexión con Supabase al iniciar la app
  useEffect(() => {
    const testSupabaseConnection = async () => {
      console.log("🔌 [SUPABASE DEBUG] Iniciando verificación de conexión...");
      
      // Verificar que las variables de entorno existan
      const url = import.meta.env.VITE_SUPABASE_URL;
      const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      console.log("📋 [SUPABASE DEBUG] Variables de entorno:");
      console.log("   VITE_SUPABASE_URL:", url || "❌ NO CONFIGURADA");
      console.log("   VITE_SUPABASE_ANON_KEY:", key ? `✓ Configurada (${key.substring(0, 20)}...)` : "❌ NO CONFIGURADA");
      
      if (!url || !key) {
        console.error("❌ [SUPABASE DEBUG] Faltan variables de entorno!");
        console.log("🔧 [SUPABASE DEBUG] SOLUCIÓN RÁPIDA:");
        console.log("   1. Crea el archivo .env.local en la raíz del proyecto");
        console.log("   2. Copia estas líneas:");
        console.log("      VITE_SUPABASE_URL=https://tu-proyecto.supabase.co");
        console.log("      VITE_SUPABASE_ANON_KEY=tu-anon-key-aqui");
        console.log("   3. Obtén los valores desde: https://supabase.com/dashboard");
        console.log("   4. Reinicia el servidor: npm run dev");
        return;
      }
      
      try {
        // Test simple: intentar hacer una query a la tabla de perfumes
        const { data, error } = await supabase
          .from('perfumes')
          .select('count')
          .limit(1);
        
        if (error) {
          console.error("❌ [SUPABASE DEBUG] Error de conexión:", error.message);
          console.log("💡 [SUPABASE DEBUG] Verifica:");
          console.log("   1. La URL es correcta (ejemplo: https://abc123.supabase.co)");
          console.log("   2. La anon key es válida");
          console.log("   3. La tabla 'perfumes' existe en Supabase");
          console.log("   4. RLS no está bloqueando el acceso anónimo");
          console.log("   5. Reiniciaste el servidor después de crear .env.local");
        } else {
          console.log("✅ [SUPABASE DEBUG] ¡Conexión exitosa!");
          console.log("📊 [SUPABASE DEBUG] URL:", url);
          console.log("🗄️  [SUPABASE DEBUG] Base de datos respondiendo correctamente");
          console.log("🎉 [SUPABASE DEBUG] Listo para empezar a construir!");
        }
      } catch (err) {
        console.error("❌ [SUPABASE DEBUG] Error inesperado:", err);
        console.log("🔍 [SUPABASE DEBUG] Verifica que:");
        console.log("   - El archivo .env.local exista en la raíz del proyecto");
        console.log("   - Las variables VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY estén correctas");
        console.log("   - El servidor se reinició después de crear .env.local");
      }
    };

    testSupabaseConnection();
  }, []);

  return (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <CartProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/catalogo" element={<Catalog />} />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute requireAdmin={true}>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route path="/pedido/:id" element={<OrderDetail />} />
              <Route path="/perfume/:id" element={<PerfumeDetail />} />
              <Route path="/carrito" element={<Cart />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/debug-auth" element={<DebugAuth />} />
              <Route 
                path="/account" 
                element={
                  <ProtectedRoute>
                    <Account />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute requireAdmin={true}>
                    <Admin />
                  </ProtectedRoute>
                } 
              />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
  );
};

export default App;
