# 🚀 Guía Rápida: Integración de Supabase en React + Vite + TypeScript

## Stack Tecnológico
- **React 18** + **TypeScript**
- **Vite** (build tool)
- **Supabase** (Backend-as-a-Service)
- **React Query** (@tanstack/react-query) para gestión de estado del servidor
- **shadcn/ui** + **Tailwind CSS** para UI

---

## 📦 Paso 1: Instalación de Dependencias

```bash
npm install @supabase/supabase-js
```

React Query ya debería estar instalado. Si no:
```bash
npm install @tanstack/react-query
```

---

## 🗂️ Paso 2: Estructura de Archivos

Crear la siguiente estructura:

```
src/
└── integrations/
    └── supabase/
        ├── client.ts       # Cliente de Supabase
        ├── types.ts        # Tipos TypeScript de la BD
        └── index.ts        # Exports públicos
```

### `src/integrations/supabase/client.ts`

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env file and ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});
```

### `src/integrations/supabase/types.ts`

```typescript
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      // Se autogenera después
    }
    Views: {}
    Functions: {}
    Enums: {}
  }
}
```

### `src/integrations/supabase/index.ts`

```typescript
export { supabase } from './client';
export type { Database } from './types';
```

---

## ⚙️ Paso 3: Variables de Entorno

### Crear `.env.local` en la raíz del proyecto:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Actualizar `.gitignore`:

```
.env
.env.local
.env.*.local
```

---

## 🗄️ Paso 4: Crear Base de Datos en Supabase

### 4.1 Crear Proyecto
1. Ve a [supabase.com/dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Completa: nombre, contraseña, región
4. Espera 1-2 minutos

### 4.2 Obtener Credenciales
1. Dashboard → Settings → API
2. Copia:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public key** → `VITE_SUPABASE_ANON_KEY`

### 4.3 Crear Tablas
En SQL Editor, ejecuta:

```sql
-- Ejemplo: Tabla de productos
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Política de lectura pública
CREATE POLICY "Lectura pública"
  ON products
  FOR SELECT
  TO anon, authenticated
  USING (true);
```

---

## 🔧 Paso 5: Debug en App Principal

### Agregar debug en `App.tsx`:

```tsx
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase";

const App = () => {
  useEffect(() => {
    const testConnection = async () => {
      console.log("🔌 [SUPABASE DEBUG] Verificando conexión...");
      
      const url = import.meta.env.VITE_SUPABASE_URL;
      const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      console.log("📋 Variables:");
      console.log("   URL:", url || "❌ NO CONFIGURADA");
      console.log("   KEY:", key ? "✓ Configurada" : "❌ NO CONFIGURADA");
      
      if (!url || !key) {
        console.error("❌ Faltan variables de entorno!");
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('products')
          .select('count')
          .limit(1);
        
        if (error) {
          console.error("❌ Error:", error.message);
        } else {
          console.log("✅ Conexión exitosa!");
        }
      } catch (err) {
        console.error("❌ Error inesperado:", err);
      }
    };
    
    testConnection();
  }, []);

  return (
    // Tu app...
  );
};
```

---

## 📊 Paso 6: Uso con React Query

### Hook personalizado de ejemplo:

```tsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase';

// Fetch de datos
export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
}

// Crear producto
export function useCreateProduct() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (newProduct) => {
      const { data, error } = await supabase
        .from('products')
        .insert([newProduct])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

// En tu componente
function MyComponent() {
  const { data: products, isLoading } = useProducts();
  const createProduct = useCreateProduct();
  
  if (isLoading) return <div>Cargando...</div>;
  
  return (
    <div>
      {products?.map(p => <div key={p.id}>{p.name}</div>)}
    </div>
  );
}
```

---

## 🎯 Paso 7: Generar Tipos TypeScript (Opcional pero Recomendado)

Una vez que tengas tablas creadas:

```bash
npx supabase gen types typescript \
  --project-id "tu-project-ref" \
  --schema public \
  > src/integrations/supabase/types.ts
```

Obtén tu `project-ref` de la URL del dashboard.

### Usar los tipos:

```typescript
import type { Database } from '@/integrations/supabase/types';

type Product = Database['public']['Tables']['products']['Row'];
type NewProduct = Database['public']['Tables']['products']['Insert'];
```

---

## 🔐 Paso 8: Row Level Security (RLS)

### Políticas comunes:

```sql
-- Lectura pública
CREATE POLICY "Lectura pública"
  ON mi_tabla
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Solo usuarios autenticados pueden insertar
CREATE POLICY "Insertar autenticado"
  ON mi_tabla
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Usuarios solo ven sus propios datos
CREATE POLICY "Ver propios datos"
  ON mi_tabla
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);
```

---

## ✅ Checklist Final

- [ ] `@supabase/supabase-js` instalado
- [ ] Estructura `src/integrations/supabase/` creada
- [ ] `.env.local` con credenciales configuradas
- [ ] `.gitignore` actualizado
- [ ] Proyecto creado en Supabase
- [ ] Tablas creadas en SQL Editor
- [ ] RLS habilitado y políticas configuradas
- [ ] Debug agregado en App.tsx
- [ ] Servidor reiniciado después de `.env.local`
- [ ] Conexión exitosa verificada en consola

---

## 🐛 Troubleshooting

### Error: "Invalid API key"
→ Verifica que uses la **anon key** (empieza con `eyJhbG...`), no la service_role key

### Error: "Table does not exist"
→ Crea las tablas en SQL Editor de Supabase

### Error: "Permission denied"
→ Verifica que RLS esté configurado con políticas para `anon` o `authenticated`

### Error: Variables no definidas
→ Reinicia el servidor después de crear `.env.local`

### Error: CORS
→ Verifica que la URL sea correcta (debe terminar en `.supabase.co`)

---

## 📚 Recursos

- [Supabase Docs](https://supabase.com/docs)
- [Supabase JS Client](https://supabase.com/docs/reference/javascript)
- [React Query Docs](https://tanstack.com/query)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

---

## 💡 Mejores Prácticas

1. **Siempre usa React Query** - No hagas queries directas en componentes
2. **Habilita RLS** - Nunca dejes tablas sin Row Level Security
3. **Tipos autogenerados** - Regenera tipos después de cambios en schema
4. **Variables de entorno** - Nunca commitees `.env.local`
5. **Invalidación de cache** - Invalida queries después de mutaciones
6. **Error handling** - Siempre verifica `error` en respuestas de Supabase

---

**Tiempo total de setup**: ~15 minutos

**¡Listo para construir!** 🚀
