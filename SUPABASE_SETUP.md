# 🔧 Configuración de Supabase para Aura SaaS Design

Esta guía te ayudará a conectar tu proyecto con Supabase paso a paso.

---

## 📋 Pasos de Configuración

### 1. Crear Proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com) y crea una cuenta (si no tienes una)
2. Click en **"New Project"**
3. Completa los datos:
   - **Name**: `aura-saas-design` (o el nombre que prefieras)
   - **Database Password**: Genera una contraseña segura (guárdala)
   - **Region**: Selecciona la región más cercana a tus usuarios
   - **Pricing Plan**: Free tier es suficiente para empezar
4. Click en **"Create new project"** (tarda 1-2 minutos)

---

### 2. Obtener las Credenciales

Una vez que el proyecto esté listo:

1. Ve a **Project Settings** (ícono de engranaje en el sidebar)
2. Click en **"API"** en el menú lateral
3. Encontrarás dos valores importantes:

   **Project URL**
   ```
   https://tuprojectref.supabase.co
   ```

   **anon/public key** (en la sección "Project API keys")
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

⚠️ **IMPORTANTE**: 
- Usa la key `anon` (pública), NO la `service_role` key (secreta)
- La `service_role` key solo se usa en el backend/servidor

---

### 3. Configurar Variables de Entorno

1. **Crea el archivo `.env.local`** en la raíz del proyecto:

```bash
# En la raíz del proyecto (mismo nivel que package.json)
touch .env.local
```

2. **Copia las credenciales** en `.env.local`:

```env
VITE_SUPABASE_URL=https://tuprojectref.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

3. **Verifica** que `.env.local` esté en `.gitignore` (ya está configurado)

---

### 4. Instalar Dependencias

Ejecuta en la terminal:

```bash
npm install @supabase/supabase-js
```

---

### 5. Probar la Conexión

Reinicia el servidor de desarrollo:

```bash
npm run dev
```

Para verificar que funciona, puedes agregar este código temporal en cualquier componente:

```tsx
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase';

// Dentro de tu componente:
useEffect(() => {
  const testConnection = async () => {
    const { data, error } = await supabase.from('_test').select('*');
    if (error) {
      console.log('✅ Supabase conectado correctamente');
    }
  };
  testConnection();
}, []);
```

Si ves el mensaje en la consola, ¡la conexión funciona!

---

## 🗄️ Crear la Base de Datos

### Opción 1: SQL Editor (Recomendado)

1. En el dashboard de Supabase, ve a **SQL Editor**
2. Click en **"New query"**
3. Crea tu primera tabla, por ejemplo:

```sql
-- Tabla de perfumes
CREATE TABLE perfumes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  type TEXT CHECK (type IN ('Árabe', 'Diseñador', 'Nicho')),
  price DECIMAL(10, 2) NOT NULL,
  description TEXT,
  image_url TEXT,
  is_featured BOOLEAN DEFAULT false,
  in_stock BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Habilitar Row Level Security
ALTER TABLE perfumes ENABLE ROW LEVEL SECURITY;

-- Política para lectura pública
CREATE POLICY "Perfumes son públicos"
  ON perfumes
  FOR SELECT
  TO anon
  USING (true);

-- Tabla de pedidos
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  status TEXT CHECK (status IN ('pending', 'processing', 'completed', 'cancelled')) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Tabla de items de pedido
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  perfume_id UUID REFERENCES perfumes(id),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para updated_at
CREATE TRIGGER update_perfumes_updated_at
  BEFORE UPDATE ON perfumes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

4. Click en **"Run"** (o Ctrl/Cmd + Enter)

### Opción 2: Table Editor (Visual)

1. Ve a **Table Editor**
2. Click en **"New table"**
3. Define las columnas visualmente
4. Habilita **RLS** (Row Level Security) en las opciones

---

## 📊 Autogenerar Tipos TypeScript

Una vez que tengas tablas creadas, genera los tipos automáticamente:

1. Instala el CLI de Supabase (opcional):

```bash
npm install -g supabase
```

2. Genera los tipos:

```bash
npx supabase gen types typescript --project-id "tu-project-ref" --schema public > src/integrations/supabase/types.ts
```

Reemplaza `tu-project-ref` con el ID de tu proyecto (lo encuentras en la URL del dashboard).

Esto sobrescribirá el archivo `types.ts` con los tipos reales de tu base de datos.

---

## 🔐 Configurar Row Level Security (RLS)

### Políticas Básicas

**Lectura pública** (para catálogo de productos):
```sql
CREATE POLICY "Permitir lectura pública"
  ON perfumes
  FOR SELECT
  TO anon, authenticated
  USING (true);
```

**Solo admins pueden insertar** (para dashboard):
```sql
-- Primero, agregar columna de rol a auth.users si no existe
ALTER TABLE auth.users ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';

-- Política de inserción
CREATE POLICY "Solo admins pueden insertar"
  ON perfumes
  FOR INSERT
  TO authenticated
  WITH CHECK (
    (SELECT role FROM auth.users WHERE id = auth.uid()) = 'admin'
  );
```

**Usuarios pueden ver sus propios pedidos**:
```sql
CREATE POLICY "Usuarios ven sus pedidos"
  ON orders
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);
```

---

## 🚀 Uso en el Proyecto

### Ejemplo: Fetch de Perfumes

```tsx
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase';

export function usePerfumes() {
  return useQuery({
    queryKey: ['perfumes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('perfumes')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
}
```

### Ejemplo: Crear Pedido

```tsx
const createOrder = async (orderData: any) => {
  const { data, error } = await supabase
    .from('orders')
    .insert([orderData])
    .select()
    .single();
  
  if (error) throw error;
  return data;
};
```

### Ejemplo: Suscripción en Tiempo Real

```tsx
useEffect(() => {
  const channel = supabase
    .channel('orders-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'orders',
      },
      (payload) => {
        console.log('Cambio en pedidos:', payload);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, []);
```

---

## 📦 Storage (Opcional)

Para subir imágenes de perfumes:

1. En Supabase Dashboard → **Storage**
2. Click en **"New bucket"**
3. Nombre: `perfume-images`
4. **Public bucket**: ✅ (para imágenes públicas)
5. Click en **"Create bucket"**

### Política de Storage:

```sql
-- Permitir lectura pública
CREATE POLICY "Imágenes públicas"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'perfume-images');

-- Solo admins pueden subir
CREATE POLICY "Solo admins suben imágenes"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'perfume-images' AND
    (SELECT role FROM auth.users WHERE id = auth.uid()) = 'admin'
  );
```

### Subir imagen desde código:

```tsx
const uploadImage = async (file: File) => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random()}.${fileExt}`;
  const filePath = `${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('perfume-images')
    .upload(filePath, file);

  if (uploadError) throw uploadError;

  // Obtener URL pública
  const { data } = supabase.storage
    .from('perfume-images')
    .getPublicUrl(filePath);

  return data.publicUrl;
};
```

---

## 🔍 Debugging

### Ver logs de Supabase:

```tsx
import { supabase } from '@/integrations/supabase';

// Habilitar logs detallados
supabase.realtime.setAuth('token-de-prueba');
```

### Verificar políticas RLS:

En SQL Editor:
```sql
-- Ver políticas de una tabla
SELECT * FROM pg_policies WHERE tablename = 'perfumes';

-- Deshabilitar RLS temporalmente (solo para testing)
ALTER TABLE perfumes DISABLE ROW LEVEL SECURITY;
```

⚠️ **Nunca deshabilites RLS en producción**

---

## 📚 Recursos Adicionales

- [Supabase Docs](https://supabase.com/docs)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Realtime Subscriptions](https://supabase.com/docs/guides/realtime)
- [Storage Guide](https://supabase.com/docs/guides/storage)

---

## ✅ Checklist Final

- [ ] Proyecto creado en Supabase
- [ ] Variables de entorno configuradas en `.env.local`
- [ ] Dependencia `@supabase/supabase-js` instalada
- [ ] Conexión probada exitosamente
- [ ] Tablas creadas en SQL Editor
- [ ] RLS habilitado y políticas configuradas
- [ ] Tipos TypeScript generados (opcional pero recomendado)
- [ ] Storage bucket creado (si necesitas imágenes)

---

**¡Listo!** Tu proyecto Aura SaaS Design ahora está conectado a Supabase. 🎉
