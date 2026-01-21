import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface UserProfile {
  id: string;
  role: 'cliente' | 'admin';
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
  refreshProfile: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile from profiles table
  const fetchProfile = async (userId: string, forceRefresh = false) => {
    try {
      console.log('🔍 [AUTH] Fetching profile for user:', userId);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('id, role, full_name, avatar_url, created_at')
        .eq('id', userId)
        .single();

      console.log('📦 [AUTH] Query result - data:', data);
      console.log('📦 [AUTH] Query result - error:', error);

      if (error) {
        console.error('❌ [AUTH] Error fetching profile:', error);
        throw error;
      }

      if (!data) {
        console.error('❌ [AUTH] No profile data returned');
        return;
      }
      
      const profileData = data as UserProfile;
      console.log('✅ [AUTH] Profile fetched successfully:', profileData);
      console.log('📋 [AUTH] Role from DB:', profileData.role);
      console.log('👑 [AUTH] Is Admin:', profileData.role === 'admin');
      
      setProfile(profileData);
      console.log('💾 [AUTH] Profile set in state');
    } catch (error) {
      console.error('❌ [AUTH] Error in fetchProfile:', error);
      setProfile(null);
    }
  };

  // Función pública para refrescar el perfil manualmente
  const refreshProfile = async () => {
    if (user) {
      console.log('🔄 [AUTH] Refreshing profile...');
      await fetchProfile(user.id, true); // Force refresh
    }
  };

  // Initialize auth state
  useEffect(() => {
    console.log('🚀 [AUTH] Initializing auth state...');
    
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('📦 [AUTH] Session:', session ? 'Exists' : 'None');
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        console.log('👤 [AUTH] User found, fetching profile...');
        fetchProfile(session.user.id, true); // Force refresh on init
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔔 [AUTH] Auth state changed:', event);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          console.log('👤 [AUTH] User changed, fetching profile...');
          await fetchProfile(session.user.id, true); // Force refresh on auth change
        } else {
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Sign in with email + password
  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast.success('¡Bienvenido!', {
        description: 'Has iniciado sesión correctamente',
      });
    } catch (error) {
      const authError = error as AuthError;
      toast.error('Error al iniciar sesión', {
        description: authError.message === 'Invalid login credentials'
          ? 'Email o contraseña incorrectos'
          : authError.message,
      });
      throw error;
    }
  };

  // Sign up with email + password
  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) throw error;

      toast.success('¡Registro exitoso!', {
        description: 'Verifica tu email para confirmar tu cuenta',
      });
    } catch (error) {
      const authError = error as AuthError;
      toast.error('Error al registrarse', {
        description: authError.message,
      });
      throw error;
    }
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });

      if (error) throw error;
    } catch (error) {
      const authError = error as AuthError;
      toast.error('Error con Google', {
        description: authError.message,
      });
      throw error;
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      // Limpiar estado local primero
      setUser(null);
      setProfile(null);
      setSession(null);
      
      // Cerrar sesión en Supabase
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      // Limpiar cache y localStorage
      localStorage.removeItem('supabase.auth.token');
      sessionStorage.clear();

      toast.success('Sesión cerrada', {
        description: 'Hasta pronto',
      });
      
      // Forzar recarga de la página para limpiar todo el estado
      setTimeout(() => {
        window.location.href = '/';
      }, 500);
    } catch (error) {
      const authError = error as AuthError;
      toast.error('Error al cerrar sesión', {
        description: authError.message,
      });
      throw error;
    }
  };

  // Reset password - envía email de recuperación
  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      toast.success('Email enviado', {
        description: 'Revisa tu bandeja de entrada para resetear tu contraseña',
      });
    } catch (error) {
      const authError = error as AuthError;
      toast.error('Error al enviar email', {
        description: authError.message,
      });
      throw error;
    }
  };

  // Update password - para cuando el usuario tiene el token de recuperación
  const updatePassword = async (newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      toast.success('Contraseña actualizada', {
        description: 'Tu contraseña ha sido cambiada exitosamente',
      });
    } catch (error) {
      const authError = error as AuthError;
      toast.error('Error al actualizar contraseña', {
        description: authError.message,
      });
      throw error;
    }
  };

  const isAdmin = profile?.role === 'admin';

  const value = {
    user,
    profile,
    session,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    resetPassword,
    updatePassword,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
