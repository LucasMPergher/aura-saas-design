# 🗄️ Integración con Supabase

Esta carpeta contiene toda la configuración y utilidades para trabajar con Supabase en Aura SaaS Design.

---

## 📁 Estructura de Archivos

```
src/integrations/supabase/
├── client.ts              # Cliente de Supabase configurado
├── types.ts               # Tipos TypeScript de la base de datos
├── index.ts               # Exports públicos del módulo
├── hooks.example.ts       # Hooks de ejemplo con React Query
└── README.md             # Este archivo
```

---

## 🔧 Archivos del Módulo

### `client.ts`
Cliente de Supabase configurado y listo para usar. Se inicializa con las variables de entorno y valida que existan.

**Uso:**
```tsx
import { supabase } from '@/integrations/supabase';

const { data, error } = await supabase.from('perfumes').select('*');
```

### `types.ts`
Tipos TypeScript de la base de datos. Actualmente contiene un esqueleto base que puedes regenerar automáticamente:

```bash
npx supabase gen types typescript --project-id "tu-project-ref" > src/integrations/supabase/types.ts
```

**Uso:**
```tsx
import type { Database } from '@/integrations/supabase/types';

type Perfume = Database['public']['Tables']['perfumes']['Row'];
```

### `index.ts`
Punto de entrada del módulo. Exporta el cliente y los tipos.

**Uso:**
```tsx
import { supabase } from '@/integrations/supabase';
import type { Database } from '@/integrations/supabase';
```

### `hooks.example.ts`
Colección de custom hooks de ejemplo que integran Supabase con React Query. Incluye patrones para:

- Queries (fetch de datos)
- Mutations (crear, actualizar, eliminar)
- Subscriptions en tiempo real
- Invalidación de cache
- Manejo de errores

**NO es necesario usar estos hooks directamente**. Son ejemplos de referencia que puedes adaptar a tu proyecto.

---

## 🚀 Guía de Uso Rápido

### 1. Fetch de Datos (SELECT)

```tsx
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase';

function usePerfumes() {
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

// En tu componente
function MiComponente() {
  const { data, isLoading, error } = usePerfumes();
  
  if (isLoading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return <div>{data?.map(p => p.name)}</div>;
}
```

### 2. Insertar Datos (INSERT)

```tsx
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase';

function useCreatePerfume() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (newPerfume) => {
      const { data, error } = await supabase
        .from('perfumes')
        .insert([newPerfume])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      // Invalidar cache para refrescar lista
      queryClient.invalidateQueries({ queryKey: ['perfumes'] });
    },
  });
}

// En tu componente
function MiComponente() {
  const createPerfume = useCreatePerfume();
  
  const handleCreate = async () => {
    await createPerfume.mutateAsync({
      name: 'Oud Royal',
      brand: 'Aura',
      price: 299.99,
      type: 'Árabe',
    });
  };
  
  return <button onClick={handleCreate}>Crear</button>;
}
```

### 3. Actualizar Datos (UPDATE)

```tsx
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase';

function useUpdatePerfume() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updates }) => {
      const { data, error } = await supabase
        .from('perfumes')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['perfumes'] });
    },
  });
}
```

### 4. Eliminar Datos (DELETE)

```tsx
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase';

function useDeletePerfume() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('perfumes')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['perfumes'] });
    },
  });
}
```

### 5. Filtros y Búsqueda

```tsx
// Filtrar por tipo
const { data } = await supabase
  .from('perfumes')
  .select('*')
  .eq('type', 'Árabe');

// Búsqueda por texto
const { data } = await supabase
  .from('perfumes')
  .select('*')
  .ilike('name', '%oud%');

// Múltiples filtros
const { data } = await supabase
  .from('perfumes')
  .select('*')
  .eq('is_featured', true)
  .eq('in_stock', true)
  .gte('price', 100)
  .lte('price', 500);

// Ordenar
const { data } = await supabase
  .from('perfumes')
  .select('*')
  .order('price', { ascending: false });

// Paginación
const { data } = await supabase
  .from('perfumes')
  .select('*')
  .range(0, 9); // Primeros 10 resultados
```

### 6. Relaciones (JOIN)

```tsx
// Traer pedidos con sus items y perfumes
const { data } = await supabase
  .from('orders')
  .select(`
    *,
    order_items (
      *,
      perfumes (
        name,
        brand,
        price
      )
    )
  `)
  .eq('id', orderId);
```

### 7. Real-time Subscriptions

```tsx
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase';

function useRealtimePerfumes() {
  const queryClient = useQueryClient();
  
  useEffect(() => {
    const channel = supabase
      .channel('perfumes-changes')
      .on(
        'postgres_changes',
        {
          event: '*', // INSERT, UPDATE, DELETE
          schema: 'public',
          table: 'perfumes',
        },
        () => {
          // Refrescar datos cuando hay cambios
          queryClient.invalidateQueries({ queryKey: ['perfumes'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);
}
```

---

## 🔐 Variables de Entorno Requeridas

El cliente valida que estas variables existan al inicializarse:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Si faltan, el cliente lanzará un error descriptivo.

---

## 📊 Regenerar Tipos TypeScript

Después de cambiar el schema de la base de datos:

```bash
# Instalar CLI de Supabase (opcional, global)
npm install -g supabase

# Generar tipos
npx supabase gen types typescript \
  --project-id "tu-project-ref" \
  --schema public \
  > src/integrations/supabase/types.ts
```

Obtén tu `project-ref` de la URL del dashboard: `https://supabase.com/dashboard/project/[project-ref]`

---

## 🎯 Mejores Prácticas

### 1. Siempre Usar React Query
No hagas queries directas en componentes. Usa React Query para:
- Cache automático
- Refetching inteligente
- Estados de loading/error
- Invalidación de cache

### 2. Manejo de Errores
```tsx
try {
  const { data, error } = await supabase.from('perfumes').select('*');
  if (error) throw error;
  return data;
} catch (error) {
  console.error('Error:', error);
  throw error; // React Query manejará el error
}
```

### 3. Invalidación de Cache
Siempre invalida el cache después de mutaciones:

```tsx
onSuccess: () => {
  queryClient.invalidateQueries({ queryKey: ['perfumes'] });
}
```

### 4. Type Safety
Usa los tipos generados:

```tsx
import type { Database } from '@/integrations/supabase/types';

type Perfume = Database['public']['Tables']['perfumes']['Row'];
type NewPerfume = Database['public']['Tables']['perfumes']['Insert'];
type UpdatePerfume = Database['public']['Tables']['perfumes']['Update'];
```

### 5. Optimistic Updates (Opcional)
Para mejor UX, actualiza el cache antes de la respuesta del servidor:

```tsx
onMutate: async (newPerfume) => {
  await queryClient.cancelQueries({ queryKey: ['perfumes'] });
  
  const previousPerfumes = queryClient.getQueryData(['perfumes']);
  
  queryClient.setQueryData(['perfumes'], (old) => [...old, newPerfume]);
  
  return { previousPerfumes };
},
onError: (err, newPerfume, context) => {
  queryClient.setQueryData(['perfumes'], context.previousPerfumes);
},
```

---

## 🐛 Debugging

### Ver queries en la consola
```tsx
import { supabase } from '@/integrations/supabase';

// Habilitar logs (solo desarrollo)
if (import.meta.env.DEV) {
  console.log('Supabase client:', supabase);
}
```

### React Query DevTools
Agrega las devtools en desarrollo:

```tsx
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// En tu App.tsx
<QueryClientProvider client={queryClient}>
  <App />
  <ReactQueryDevtools initialIsOpen={false} />
</QueryClientProvider>
```

---

## 📚 Recursos

- [Supabase Docs](https://supabase.com/docs)
- [Supabase JS Client](https://supabase.com/docs/reference/javascript)
- [React Query Docs](https://tanstack.com/query)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)

---

## 🆘 Ayuda

Si tienes problemas:

1. Verifica que `.env.local` existe y tiene las credenciales correctas
2. Reinicia el servidor después de cambiar variables de entorno
3. Verifica que las tablas existen en Supabase (Table Editor)
4. Verifica que RLS está configurado correctamente
5. Consulta [CHECKLIST_SUPABASE.md](../../CHECKLIST_SUPABASE.md) para troubleshooting

---

**Última actualización**: 20 de enero de 2026
