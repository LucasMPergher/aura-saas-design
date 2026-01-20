# 🚀 Quick Start - Supabase

## Pasos Rápidos (5 minutos)

### 1. Instalar dependencia ✅
```bash
npm install @supabase/supabase-js
```

### 2. Crear proyecto en Supabase
1. Ve a [supabase.com](https://supabase.com)
2. Crea una cuenta y un nuevo proyecto
3. Espera 1-2 minutos a que el proyecto esté listo

### 3. Copiar credenciales
1. Dashboard → Settings → API
2. Copia **Project URL** y **anon key**

### 4. Configurar variables de entorno
```bash
# Crea el archivo
cp .env.local.example .env.local

# Edita .env.local con tus credenciales
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...tu-key...
```

### 5. Crear tabla de prueba
Ve a SQL Editor en Supabase y ejecuta:

```sql
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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE perfumes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir lectura pública"
  ON perfumes
  FOR SELECT
  TO anon, authenticated
  USING (true);
```

### 6. Reiniciar servidor
```bash
npm run dev
```

### 7. Probar la conexión
Agrega esto en cualquier componente:

```tsx
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase';

useEffect(() => {
  const test = async () => {
    const { data, error } = await supabase.from('perfumes').select('*');
    console.log('Supabase conectado:', data, error);
  };
  test();
}, []);
```

---

## 📂 Archivos Creados

```
src/integrations/supabase/
├── client.ts              # Cliente configurado
├── types.ts               # Tipos TypeScript
├── index.ts               # Exports públicos
└── hooks.example.ts       # Hooks de ejemplo

.env.example               # Template de variables
.env.local.example         # Template con instrucciones
SUPABASE_SETUP.md          # Guía completa (LEE ESTO)
```

---

## 🎯 Siguiente Paso

Lee la guía completa: **[SUPABASE_SETUP.md](SUPABASE_SETUP.md)**

Incluye:
- ✅ Configuración de Row Level Security
- ✅ Políticas de acceso
- ✅ Storage para imágenes
- ✅ Ejemplos de queries complejos
- ✅ Real-time subscriptions
- ✅ Troubleshooting

---

## 💡 Uso Básico

```tsx
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase';

function MyComponent() {
  const { data, isLoading } = useQuery({
    queryKey: ['perfumes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('perfumes')
        .select('*');
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) return <div>Cargando...</div>;
  
  return <div>{data?.map(p => p.name)}</div>;
}
```

---

## 🆘 Problemas Comunes

**Error: "Invalid URL"**
→ Verifica que `.env.local` exista y tenga las URLs correctas

**Error: "Failed to fetch"**
→ Reinicia el servidor después de crear `.env.local`

**Error: "relation does not exist"**
→ Crea la tabla en SQL Editor de Supabase

**Error: "permission denied"**
→ Configura Row Level Security (RLS) policies

---

## 📚 Recursos

- [Supabase Docs](https://supabase.com/docs)
- [React Query Docs](https://tanstack.com/query)
- [Guía completa del proyecto](SUPABASE_SETUP.md)
