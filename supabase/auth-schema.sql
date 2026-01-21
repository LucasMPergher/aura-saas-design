-- ============================================
-- AURA SAAS - AUTH SCHEMA
-- Sistema de autenticación con roles
-- ============================================

-- 1. Crear tabla profiles (perfil de usuario)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'cliente' CHECK (role IN ('cliente', 'admin')),
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 2. Habilitar Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 3. Políticas de acceso
-- Los usuarios pueden leer su propio perfil
CREATE POLICY "Usuarios pueden ver su perfil"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Los usuarios pueden actualizar su propio perfil
CREATE POLICY "Usuarios pueden actualizar su perfil"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Los admins pueden ver todos los perfiles
CREATE POLICY "Admins pueden ver todos los perfiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 4. Función para crear perfil automáticamente al registrarse
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    'cliente' -- Rol por defecto
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Trigger para ejecutar la función al crear usuario
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 6. Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_profile_updated ON profiles;
CREATE TRIGGER on_profile_updated
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- 7. Crear un usuario admin de ejemplo (CAMBIAR DESPUÉS)
-- NOTA: Primero debes registrar un usuario normalmente, luego ejecutar:
-- UPDATE profiles SET role = 'admin' WHERE id = 'tu-user-id-aqui';

-- 8. Índices para performance
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON profiles(created_at);

-- ============================================
-- VERIFICACIÓN
-- ============================================
-- Para verificar que todo funciona:
-- SELECT * FROM profiles;
-- SELECT * FROM auth.users;
