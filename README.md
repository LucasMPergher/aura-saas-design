# 🌟 ESENCIA - E-commerce SaaS Premium

**Plataforma SaaS completa para e-commerce de perfumes de lujo** con sistema de autenticación, gestión de pedidos, carrito persistente y panel administrativo. Construida con React 18, TypeScript, Supabase y animaciones cinematográficas.

> 🎯 **Proyecto MVP Funcional** - Demo lista para portafolio  
> 🔗 **Deploy en Vercel**: [Ver demo en vivo](#-deploy-en-vercel)  
> 🗄️ **Backend con Supabase**: Base de datos PostgreSQL + Auth + Row Level Security

---

## 📋 Tabla de Contenidos

- [✨ Características y Funcionalidades](#-características-y-funcionalidades)
- [🏗 Arquitectura del Proyecto](#-arquitectura-del-proyecto)
- [🔐 Sistema de Autenticación](#-sistema-de-autenticación)
- [🗄️ Backend e Integración con Supabase](#️-backend-e-integración-con-supabase)
- [🛡️ Seguridad Web](#️-seguridad-web)
- [🎨 Sistema de Diseño ESENCIA](#-sistema-de-diseño-esencia)
- [🛠 Stack Tecnológico](#-stack-tecnológico)
- [💻 Desarrollo Local](#-desarrollo-local)
- [🚀 Deploy en Vercel](#-deploy-en-vercel)
- [🧪 Testing](#-testing)

---

## ✨ Características y Funcionalidades

### 🛒 **Módulo de E-commerce**

#### **Carrito de Compras Persistente**
- ✅ Agregar/eliminar productos con cantidades dinámicas
- ✅ Persistencia en `localStorage` (sobrevive a recargas de página)
- ✅ Cálculo automático de subtotales y totales
- ✅ Indicadores de stock disponible vs. "a pedido"
- ✅ Badge visual en header con contador de items
- ✅ Validación de productos antes de checkout

**Tecnologías**: React Context API + localStorage + React Query

#### **Sistema de Pedidos**
- ✅ Guardado de pedidos en Supabase con número único autogenerado
- ✅ Captura de items del carrito con precios y cantidades
- ✅ Estados de pedido: `pending`, `confirmed`, `shipped`, `delivered`, `cancelled`
- ✅ Integración con WhatsApp Business (mensaje pre-formateado)
- ✅ Vaciado automático del carrito después de confirmar
- ✅ Toast notifications para feedback visual

**Flujo del pedido**:
1. Usuario agrega productos al carrito
2. Click en "Hacer Pedido" → Verificación de autenticación
3. Si no está logueado → Redirige a `/login?redirect=/carrito`
4. Después de login → Vuelve al carrito automáticamente
5. Pedido se guarda en DB → Genera mensaje WhatsApp → Abre chat
6. Administrador ve el pedido en Dashboard

**Schema DB**:
```sql
orders (
  id, order_number, customer_name, customer_phone, 
  customer_email, total_amount, status, created_at
)

order_items (
  order_id FK, perfume_id, perfume_name, perfume_brand,
  quantity, unit_price, in_stock
)
```

#### **Catálogo de Productos**
- ✅ Grid responsivo con cards animadas (Framer Motion)
- ✅ Filtrado por tipo de perfume (Árabe, Diseñador, Nicho)
- ✅ Indicadores visuales de stock y productos destacados
- ✅ Página de detalle de producto con imágenes y descripción
- ✅ Badges de categoría con colores diferenciados

---

### 🔐 **Módulo de Autenticación y Usuarios**

#### **Sistema de Registro e Inicio de Sesión**
- ✅ **Email + Contraseña** - Registro con nombre completo
- ✅ **Google OAuth (Configurado pero no activado)** - Listo para habilitar en Supabase
- ✅ Validación de formularios (contraseñas coincidentes, min 6 caracteres)
- ✅ Manejo de errores con mensajes legibles
- ✅ Redirección inteligente post-login (vuelve a donde estaba)

**Funcionalidades clave**:
```tsx
// AuthContext provee:
- user: User | null           // Usuario autenticado
- profile: UserProfile | null // Perfil con role
- signIn(email, password)     // Login
- signUp(email, password, fullName) // Registro
- signInWithGoogle()          // OAuth (requiere configuración)
- signOut()                   // Cerrar sesión
- isAdmin: boolean            // Helper para permisos
```

#### **Sistema de Roles**
- ✅ Dos roles: `cliente` (default) y `admin`
- ✅ Asignación automática de rol `cliente` al registrarse (trigger SQL)
- ✅ Rutas protegidas con `<ProtectedRoute>` HOC
- ✅ UI condicional según rol (Header muestra Dashboard solo a admins)

**Rutas protegidas**:
```tsx
/account   → Requiere autenticación
/admin     → Requiere role = 'admin'
/dashboard → Requiere role = 'admin'
```

#### **Página de Cuenta de Usuario**
- ✅ Visualización de perfil (nombre, email, rol, fecha de registro)
- ✅ Badge visual del rol (Administrador / Cliente)
- ✅ Estadísticas de pedidos (placeholder para expansión futura)
- ✅ Acceso rápido a órdenes y panel admin (si es admin)

---

### 📊 **Panel Administrativo (Dashboard)**

#### **Vista General de Métricas**
- ✅ Cards con estadísticas en tiempo real:
  - Ventas del mes (suma de `total_amount`)
  - Total de pedidos
  - Productos "a pedido" (backorders)
  - Tasa de conversión (placeholder)
- ✅ Animaciones de entrada con Framer Motion
- ✅ Indicadores de cambio porcentual (positivo/negativo/neutral)

#### **Gestión de Pedidos**
- ✅ Tabla de pedidos recientes con:
  - Número de pedido único
  - Nombre del cliente
  - Lista de productos
  - Total
  - Estado con badge visual
  - Fecha de creación
- ✅ Filtro toggle para "Solo productos a pedido"
- ✅ Loading states con spinners
- ✅ Badge de alerta roja para backorders
- ✅ Límite de 6 pedidos más recientes (paginación futura)

#### **Sistema de Alertas**
- ✅ Panel lateral con notificaciones:
  - Alertas de stock bajo
  - Nuevos pedidos
  - Productos sin stock
- ✅ Timestamps relativos ("Hace 2 horas")
- ✅ Iconos diferenciados por tipo de alerta

**Queries personalizados**:
```tsx
useOrders({ 
  status: 'pending',      // Filtrar por estado
  hasBackorder: true      // Solo pedidos con productos a pedido
})
```

---

### 🎨 **Módulo de Diseño y UX**

#### **Sistema de Diseño ESENCIA**
- ✅ Paleta de colores custom (`aura-deep`, `aura-night`, `aura-gold`, `aura-smoke`)
- ✅ Tipografía dual: Cormorant Garamond (serif) + Inter (sans)
- ✅ 40+ componentes shadcn/ui customizados
- ✅ Variantes de botones gold con gradientes y glow effects
- ✅ Badges contextuales para tipos de productos y estados

#### **Animaciones Cinematográficas**
- ✅ Fade-in + slide-up en viewport con Framer Motion
- ✅ Hover effects en cards (elevación sutil)
- ✅ Stagger animations para listas
- ✅ Transitions suaves en navegación
- ✅ Loading skeletons y spinners personalizados

#### **Responsive Design**
- ✅ Mobile-first approach
- ✅ Breakpoints: sm, md, lg, xl
- ✅ Header con menú hamburguesa en móvil
- ✅ Grid adaptativo en catálogo (1→2→3→4 columnas)
- ✅ Touch gestures y swipe actions

---

### 🔔 **Módulo de Notificaciones**

#### **Sistema Dual de Toasts**
- ✅ **Sonner** - Toasts elegantes con stack automático
- ✅ **shadcn Toaster** - Notificaciones complejas con acciones
- ✅ Tipos: success, error, warning, info
- ✅ Auto-dismiss configurable
- ✅ Posicionamiento personalizado

**Uso en el proyecto**:
```tsx
// Auth feedback
toast.success("Sesión iniciada correctamente");
toast.error("Email o contraseña incorrectos");

// Pedidos
toast.success("Pedido registrado", {
  description: `Tu pedido #${orderNumber} ha sido guardado`
});
```

---

### 🗺️ **Módulo de Navegación y Rutas**

#### **React Router v6 con Protección**
- ✅ Rutas públicas: `/`, `/catalogo`, `/perfume/:id`
- ✅ Rutas autenticadas: `/account`, `/carrito`
- ✅ Rutas admin: `/dashboard`, `/admin`
- ✅ Página 404 personalizada
- ✅ Redirecciones automáticas según permisos
- ✅ Parámetros de query para flujo de auth (`?redirect=`)

**Header inteligente**:
- Si NO está logueado: Botones "Ingresar" / "Registrarse"
- Si está logueado: Dropdown con nombre, perfil, cerrar sesión
- Admins ven link adicional "Dashboard" en nav
- Badge de carrito siempre visible

---

### 📦 **Módulos Técnicos**

#### **State Management**
- ✅ **React Query** - Server state con cache automático
- ✅ **React Context** - Auth + Cart global state
- ✅ **localStorage** - Persistencia del carrito
- ✅ Query invalidation automática después de mutaciones

#### **Optimización de Performance**
- ✅ Code splitting con React.lazy (preparado para expansión)
- ✅ Memoization de cálculos de carrito
- ✅ Debounce en filtros de catálogo
- ✅ `viewport={{ once: true }}` para animaciones de entrada
- ✅ Stale time configurado en queries (30s para pedidos)

#### **SEO y Meta Tags**
- ✅ Meta tags Open Graph para redes sociales
- ✅ Twitter Cards configurados
- ✅ Favicon personalizado
- ✅ robots.txt para crawlers
- ✅ Títulos dinámicos por página

---

## 🏗 Arquitectura del Proyecto

---

## 🏗 Arquitectura del Proyecto

### Estructura de Directorios Completa

```
aura-saas-design/
├── src/
│   ├── pages/                      # Vistas principales (Routes)
│   │   ├── Index.tsx               # Landing page con hero y productos destacados
│   │   ├── Catalog.tsx             # Catálogo completo con filtros
│   │   ├── PerfumeDetail.tsx       # Detalle de producto individual
│   │   ├── Cart.tsx                # 🛒 Carrito con persistencia + checkout
│   │   ├── Login.tsx               # 🔐 Inicio de sesión (email/google)
│   │   ├── Register.tsx            # 📝 Registro de usuarios
│   │   ├── Account.tsx             # 👤 Perfil de usuario autenticado
│   │   ├── Dashboard.tsx           # 📊 Panel admin - métricas y pedidos
│   │   ├── Admin.tsx               # ⚙️ Panel admin - gestión avanzada
│   │   ├── OrderDetail.tsx         # 📦 Detalle de pedido específico
│   │   └── NotFound.tsx            # 404 personalizada
│   ├── components/
│   │   ├── Header.tsx              # Nav principal con auth state
│   │   ├── PerfumeCard.tsx         # Card de producto con animaciones
│   │   ├── StatsCard.tsx           # Card de métricas animada
│   │   ├── OrderRow.tsx            # Fila de pedido en tabla
│   │   ├── AlertItem.tsx           # Notificación de alerta
│   │   ├── ProtectedRoute.tsx      # 🔒 HOC para rutas protegidas
│   │   └── ui/                     # 40+ componentes shadcn/ui
│   ├── contexts/
│   │   ├── AuthContext.tsx         # 🔐 Estado global de autenticación
│   │   └── CartContext.tsx         # 🛒 Estado global del carrito
│   ├── integrations/
│   │   └── supabase/
│   │       ├── client.ts           # Cliente configurado de Supabase
│   │       ├── types.ts            # Tipos DB autogenerados
│   │       └── hooks/
│   │           └── useOrders.ts    # Hooks personalizados para pedidos
│   ├── hooks/
│   │   ├── use-mobile.tsx          # Detección responsive
│   │   └── use-toast.ts            # Sistema de notificaciones
│   ├── lib/
│   │   └── utils.ts                # Utilidades (cn, formatters)
│   └── assets/
│       └── aura-logo.png           # Logo de ESENCIA
├── supabase/
│   ├── schema.sql                  # 🗄️ Schema completo de DB (7 tablas)
│   └── auth-schema.sql             # 🔐 Schema de autenticación + RLS
├── public/
│   ├── logo.png                    # Favicon
│   └── robots.txt                  # SEO
└── [configuración]
    ├── vite.config.ts              # Configuración Vite + alias @/
    ├── tailwind.config.ts          # Tokens ESENCIA personalizados
    ├── tsconfig.json               # TypeScript relajado
    └── vitest.config.ts            # Testing con Vitest
```

### Patrones de Arquitectura Implementados

#### **1. Composición de Componentes**
```tsx
// Ejemplo: Página con layout reutilizable
<div>
  <Header />                         {/* Nav global con auth */}
  <main className="pt-24">           {/* Offset del fixed header */}
    <ContenidoPrincipal />
  </main>
</div>
```

#### **2. State Management en Capas**
```
UI State (local useState)
    ↓
Context State (Auth, Cart)
    ↓
Server State (React Query)
    ↓
Persistencia (localStorage, Supabase)
```

#### **3. Rutas Protegidas con HOC**
```tsx
// App.tsx
<Route path="/account" element={
  <ProtectedRoute>               {/* Requiere auth */}
    <Account />
  </ProtectedRoute>
} />

<Route path="/admin" element={
  <ProtectedRoute requireAdmin>  {/* Requiere role='admin' */}
    <Admin />
  </ProtectedRoute>
} />
```

**Lógica de ProtectedRoute**:
1. Verifica si `user` existe (AuthContext)
2. Si NO → Redirige a `/login`
3. Si `requireAdmin` → Verifica `profile.role === 'admin'`
4. Si no es admin → Redirige a `/`
5. Muestra spinner mientras carga auth state

#### **4. Alias de Importación**
Configurado en `vite.config.ts`, `tsconfig.json` y `components.json`:
```tsx
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase";
```

---

## 🔐 Sistema de Autenticación

### Funcionalidades Implementadas

| Característica | Estado | Detalles |
|----------------|--------|----------|
| **Email + Contraseña** | ✅ Implementado | Registro y login con validación |
| **Google OAuth** | ⚙️ Configurado | Código listo, requiere activar en Supabase |
| **Roles de Usuario** | ✅ Implementado | `cliente` (default) y `admin` |
| **Row Level Security** | ✅ Implementado | Políticas SQL en Supabase |
| **Perfil de Usuario** | ✅ Implementado | Tabla `profiles` con FK a `auth.users` |
| **Sesión Persistente** | ✅ Implementado | Auto-refresh cada 60 min |
| **Logout Global** | ✅ Implementado | Invalida sesión en todos los dispositivos |

### Arquitectura del Sistema Auth

#### **Base de Datos (Supabase)**

**Tabla `profiles`** (en `supabase/auth-schema.sql`):
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'cliente' 
    CHECK (role IN ('cliente', 'admin')),
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

**Trigger automático** - Crea perfil al registrarse:
```sql
CREATE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    'cliente'  -- Rol por defecto
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

**Políticas RLS** (Row Level Security):
```sql
-- Los usuarios pueden ver su propio perfil
CREATE POLICY "Usuarios pueden ver su perfil"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Los admins pueden ver TODOS los perfiles
CREATE POLICY "Admins pueden ver todos los perfiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

#### **Frontend (React Context)**

**AuthContext** (en `src/contexts/AuthContext.tsx`):
```tsx
interface AuthContextType {
  user: User | null;                // Usuario de Supabase Auth
  profile: UserProfile | null;      // Perfil con role desde DB
  session: Session | null;          // Sesión activa
  loading: boolean;                 // Estado de carga inicial
  signIn: (email, password) => Promise<void>;
  signUp: (email, password, fullName) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  isAdmin: boolean;                 // Helper computed
}
```

**Flujo de autenticación**:
```
1. Usuario envía credenciales
   ↓
2. AuthContext → supabase.auth.signInWithPassword()
   ↓
3. Supabase valida y crea sesión
   ↓
4. AuthContext detecta cambio (onAuthStateChange listener)
   ↓
5. Fetch profile desde tabla profiles
   ↓
6. Actualiza estado local (user, profile, session)
   ↓
7. UI se re-renderiza con estado autenticado
```

### Google OAuth (Configuración Pendiente)

**Código implementado**:
```tsx
const signInWithGoogle = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/`,
    },
  });
  
  if (error) {
    toast.error('Error al iniciar sesión con Google');
    throw error;
  }
};
```

**Para activar**:
1. Ir a [Google Cloud Console](https://console.cloud.google.com)
2. Crear OAuth 2.0 Client ID
3. Agregar authorized redirect URI: `https://tu-proyecto.supabase.co/auth/v1/callback`
4. Copiar Client ID y Client Secret
5. Supabase Dashboard → Authentication → Providers → Google
6. Pegar credenciales y habilitar

### Flujo de Redirección Post-Login

**Problema resuelto**: Usuario agrega productos al carrito → Intenta hacer pedido → Debe loguearse → Pierde el carrito

**Solución implementada**:
```tsx
// Cart.tsx
if (!user) {
  toast.error("Inicia sesión para continuar");
  navigate('/login?redirect=/carrito');  // Guarda destino en query
  return;
}

// Login.tsx
const [searchParams] = useSearchParams();
const redirectTo = searchParams.get('redirect') || '/';

await signIn(email, password);
navigate(redirectTo);  // Vuelve al carrito después del login
```

**Flujo completo**:
```
[Carrito] → Click "Hacer Pedido" → Sin auth
    ↓
[Login] con ?redirect=/carrito → Usuario se loguea
    ↓
[Carrito] → Productos siguen ahí (localStorage)
    ↓
Click "Hacer Pedido" nuevamente → ✅ Procesa pedido
```

---

## 🗄️ Backend e Integración con Supabase

### Stack Completo de Backend

| Componente | Tecnología | Propósito |
|-----------|------------|-----------|
| **Base de Datos** | PostgreSQL 15 | BD relacional con JSON nativo |
| **ORM/Query Builder** | Supabase JS Client | Cliente TypeScript con tipos autogenerados |
| **Authentication** | Supabase Auth | JWT + OAuth providers |
| **Storage** | Supabase Storage | Almacenamiento de archivos (preparado) |
| **Real-time** | Supabase Realtime | WebSockets (preparado para chat) |
| **Edge Functions** | Deno | Serverless functions (preparado) |
| **Row Level Security** | PostgreSQL RLS | Seguridad a nivel de fila |

### Schema de Base de Datos

**Tablas implementadas** (en `supabase/schema.sql`):

#### **1. perfumes** - Productos del catálogo
```sql
CREATE TABLE perfumes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  type TEXT CHECK (type IN ('Árabe', 'Diseñador', 'Nicho')),
  price DECIMAL(10, 2) NOT NULL,
  description TEXT,
  notes_top TEXT[],      -- Array de notas olfativas
  notes_heart TEXT[],
  notes_base TEXT[],
  size_ml INTEGER,
  image_url TEXT,
  is_featured BOOLEAN DEFAULT false,
  in_stock BOOLEAN DEFAULT true,
  stock_quantity INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

#### **2. orders** - Pedidos de clientes
```sql
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  order_number INTEGER UNIQUE,  -- Auto-incrementa con sequence
  customer_name TEXT,
  customer_phone TEXT,
  customer_email TEXT,
  total_amount DECIMAL(10, 2) NOT NULL,
  status TEXT DEFAULT 'pending' 
    CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

#### **3. order_items** - Items de cada pedido
```sql
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  perfume_id UUID REFERENCES perfumes(id),
  perfume_name TEXT NOT NULL,      -- Denormalizado para histórico
  perfume_brand TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  in_stock BOOLEAN DEFAULT true,   -- Estado al momento del pedido
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

#### **4. profiles** - Perfiles de usuario
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'cliente',
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

**Triggers automáticos**:
```sql
-- Genera order_number secuencial
CREATE SEQUENCE order_number_seq START 1000;

CREATE FUNCTION set_order_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.order_number := nextval('order_number_seq');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER before_insert_order
  BEFORE INSERT ON orders
  FOR EACH ROW EXECUTE FUNCTION set_order_number();
```

### Hooks Personalizados de Supabase

**useOrders** (en `src/integrations/supabase/hooks/useOrders.ts`):
```tsx
// Fetch todos los pedidos con items
export function useOrders(filters?: {
  status?: string;
  hasBackorder?: boolean;
}) {
  return useQuery({
    queryKey: ['orders', filters],
    queryFn: async () => {
      let query = supabase
        .from('orders')
        .select(`
          *,
          order_items (
            id, perfume_id, perfume_name, perfume_brand,
            quantity, unit_price, in_stock
          )
        `)
        .order('created_at', { ascending: false });

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }

      const { data, error } = await query;
      if (error) throw error;

      // Filtrar pedidos con backorders
      if (filters?.hasBackorder) {
        return data?.filter(order => 
          order.order_items?.some(item => !item.in_stock)
        ) || [];
      }

      return data || [];
    },
    staleTime: 30 * 1000,  // Cache 30 segundos
  });
}

// Crear pedido con items
export function useSaveOrder() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (orderData: CreateOrderData) => {
      // 1. Insertar orden
      const { data: order, error } = await supabase
        .from('orders')
        .insert([{ ...orderData }])
        .select()
        .single();
      
      if (error) throw error;

      // 2. Insertar items
      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderData.items.map(item => ({
          order_id: order.id,
          ...item
        })));
      
      if (itemsError) throw itemsError;
      return order;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}
```

**Ventajas de este patrón**:
- ✅ Tipos TypeScript automáticos
- ✅ Cache automático con React Query
- ✅ Invalidación selectiva de cache
- ✅ Loading/error states manejados
- ✅ Optimistic updates fáciles

### Configuración de Supabase

**Variables de entorno** (`.env.local`):
```env
VITE_SUPABASE_URL=https://tu-proyecto-ref.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Cliente configurado** (`src/integrations/supabase/client.ts`):
```tsx
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  }
);
```

### Generación de Tipos TypeScript

```bash
# Generar tipos desde el schema de Supabase
npx supabase gen types typescript \
  --project-id "tu-project-ref" \
  > src/integrations/supabase/types.ts
```

**Resultado**:
```tsx
export interface Database {
  public: {
    Tables: {
      perfumes: {
        Row: { id: string; name: string; ... }
        Insert: { name: string; ... }
        Update: { name?: string; ... }
      }
      orders: { ... }
      // ...
    }
  }
}
```

### Seguridad a Nivel de Base de Datos

**Políticas RLS implementadas**:
```sql
-- Perfumes: lectura pública
ALTER TABLE perfumes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lectura pública de perfumes"
  ON perfumes FOR SELECT
  TO anon, authenticated
  USING (true);

-- Orders: solo admins leen todos, usuarios leen propios (futuro)
CREATE POLICY "Admins leen todos los pedidos"
  ON orders FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

---

## 🛡️ Seguridad Web

### ✅ Medidas de Seguridad Implementadas

#### **1. Autenticación y Autorización**

| Medida | Implementación | Riesgo Mitigado |
|--------|----------------|-----------------|
| **JWT con Supabase** | Token HTTP-only cookies | XSS token theft |
| **Row Level Security** | Políticas SQL en PostgreSQL | Acceso no autorizado a datos |
| **Roles de usuario** | Enum `cliente \| admin` | Escalación de privilegios |
| **Protected Routes** | HOC `<ProtectedRoute>` | Acceso a rutas restringidas |
| **HTTPS obligatorio** | Supabase + Vercel SSL | Man-in-the-middle attacks |

**Ejemplo de protección**:
```tsx
// Solo admins pueden acceder
<Route path="/dashboard" element={
  <ProtectedRoute requireAdmin={true}>
    <Dashboard />
  </ProtectedRoute>
} />
```

#### **2. Validación de Datos**

| Dónde | Qué se valida | Cómo |
|-------|---------------|------|
| **Frontend** | Emails, contraseñas, campos requeridos | React Hook Form + Zod (preparado) |
| **Backend (DB)** | Tipos de datos, CHECK constraints | PostgreSQL constraints |
| **Supabase** | Longitud de strings, tipos | Schema enforcement |

**Constraints en DB**:
```sql
-- Validación de tipo de perfume
type TEXT CHECK (type IN ('Árabe', 'Diseñador', 'Nicho'))

-- Validación de rol
role TEXT CHECK (role IN ('cliente', 'admin'))

-- Validación de estado de pedido
status TEXT CHECK (status IN ('pending', 'confirmed', ...))
```

#### **3. Protección contra Ataques Comunes**

| Ataque | Protección | Cómo Funciona |
|--------|-----------|---------------|
| **SQL Injection** | ✅ Protegido | Supabase JS usa prepared statements |
| **XSS (Cross-Site Scripting)** | ✅ Parcialmente | React escapa JSX por defecto, pero revisar `dangerouslySetInnerHTML` |
| **CSRF (Cross-Site Request Forgery)** | ✅ Protegido | Supabase valida tokens en headers |
| **Clickjacking** | ⚠️ Faltante | No hay headers `X-Frame-Options` |
| **DDoS** | ✅ Protegido | Supabase + Vercel rate limiting |

#### **4. Seguridad en el Código**

**✅ Buenas prácticas implementadas**:
- Variables de entorno para secrets (`VITE_SUPABASE_*`)
- No hay API keys en código fuente
- `.env.local` en `.gitignore`
- Supabase anon key (segura para frontend)
- TypeScript para type safety

**Ejemplo seguro**:
```tsx
// ❌ NUNCA hacer esto
const API_KEY = "sk_live_12345...";

// ✅ Usar variables de entorno
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
```

#### **5. Gestión de Sesiones**

```tsx
// AuthContext con auto-refresh
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN') {
    setSession(session);
  }
  if (event === 'SIGNED_OUT') {
    setSession(null);
    setUser(null);
    setProfile(null);
  }
  if (event === 'TOKEN_REFRESHED') {
    setSession(session);
  }
});
```

**Características**:
- ✅ Tokens expiran en 1 hora
- ✅ Refresh automático antes de expirar
- ✅ Logout invalida sesión globalmente
- ✅ Múltiples dispositivos sincronizados

---

### ⚠️ Medidas de Seguridad Faltantes (Para Producción)

#### **1. Headers de Seguridad HTTP**

**❌ NO implementados** (añadir en `vercel.json` o middleware):
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        },
        {
          "key": "Permissions-Policy",
          "value": "geolocation=(), microphone=(), camera=()"
        },
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';"
        }
      ]
    }
  ]
}
```

**Impacto**:
- Previene clickjacking attacks
- Bloquea MIME type sniffing
- Controla qué recursos se pueden cargar (CSP)

#### **2. Rate Limiting en Frontend**

**❌ Faltante**: Limitar intentos de login fallidos

**Solución recomendada**:
```tsx
// Añadir en AuthContext
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_TIME = 15 * 60 * 1000; // 15 minutos

const [loginAttempts, setLoginAttempts] = useState(0);
const [lockedUntil, setLockedUntil] = useState<number | null>(null);

const signIn = async (email: string, password: string) => {
  if (lockedUntil && Date.now() < lockedUntil) {
    throw new Error('Demasiados intentos fallidos. Intenta en 15 minutos.');
  }

  try {
    await supabase.auth.signInWithPassword({ email, password });
    setLoginAttempts(0); // Reset en éxito
  } catch (error) {
    setLoginAttempts(prev => prev + 1);
    if (loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS) {
      setLockedUntil(Date.now() + LOCKOUT_TIME);
    }
    throw error;
  }
};
```

#### **3. Validación de Schemas con Zod**

**❌ Faltante**: Validación exhaustiva de formularios

**Solución recomendada**:
```tsx
import { z } from 'zod';

const registerSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Mínimo 8 caracteres')
    .regex(/[A-Z]/, 'Debe contener mayúscula')
    .regex(/[0-9]/, 'Debe contener número')
    .regex(/[^A-Za-z0-9]/, 'Debe contener símbolo'),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword']
});
```

#### **4. Sanitización de Inputs**

**❌ Faltante**: Limpieza de inputs para XSS

**Solución recomendada**:
```tsx
import DOMPurify from 'dompurify';

// Para contenido HTML generado por usuario
const SafeHTML = ({ html }: { html: string }) => {
  const clean = DOMPurify.sanitize(html);
  return <div dangerouslySetInnerHTML={{ __html: clean }} />;
};
```

#### **5. Monitoreo y Logging**

**❌ Faltante**: Sistema de auditoría

**Solución recomendada**:
```sql
-- Tabla de audit logs
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,  -- 'LOGIN', 'LOGOUT', 'CREATE_ORDER', etc.
  resource TEXT,         -- 'order:123'
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Trigger para registrar cambios en pedidos
CREATE FUNCTION log_order_change()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO audit_logs (user_id, action, resource)
  VALUES (auth.uid(), TG_OP, 'order:' || NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

#### **6. Backup y Recuperación**

**❌ Faltante**: Estrategia de backups

**Recomendaciones**:
- Habilitar Point-in-Time Recovery en Supabase
- Backups diarios automáticos (Supabase Pro plan)
- Exportar datos críticos semanalmente

#### **7. 2FA (Two-Factor Authentication)**

**❌ Faltante**: Autenticación de dos factores

**Implementación futura**:
```tsx
// Supabase soporta TOTP out-of-the-box
const { data, error } = await supabase.auth.mfa.enroll({
  factorType: 'totp',
  friendlyName: 'Mi dispositivo'
});
```

#### **8. Política de Contraseñas Robusta**

**⚠️ Actual**: Min 6 caracteres (básico)

**Recomendado para producción**:
```tsx
const passwordSchema = z.string()
  .min(12, 'Mínimo 12 caracteres')
  .regex(/[A-Z]/, 'Requiere mayúscula')
  .regex(/[a-z]/, 'Requiere minúscula')
  .regex(/[0-9]/, 'Requiere número')
  .regex(/[^A-Za-z0-9]/, 'Requiere símbolo especial')
  .refine(val => !commonPasswords.includes(val), {
    message: 'Contraseña muy común'
  });
```

#### **9. Protección de Datos Sensibles**

**⚠️ Revisar**:
- Encriptar datos sensibles en DB (números de tarjeta, DNI)
- No guardar contraseñas en logs
- Implementar GDPR compliance (derecho al olvido)

```sql
-- Encriptar datos sensibles con pgcrypto
CREATE EXTENSION IF NOT EXISTS pgcrypto;

ALTER TABLE customers ADD COLUMN 
  credit_card_encrypted BYTEA;

-- Insertar encriptado
INSERT INTO customers (credit_card_encrypted)
VALUES (pgp_sym_encrypt('4111-1111-1111-1111', 'mi-clave-secreta'));
```

#### **10. Security Headers adicionales**

```tsx
// middleware.ts (Next.js) o vercel.json
{
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
  "X-XSS-Protection": "1; mode=block",
  "X-DNS-Prefetch-Control": "off",
  "X-Download-Options": "noopen"
}
```

---

### 🎯 Checklist de Seguridad para Producción

| Medida | Estado Actual | Prioridad | Esfuerzo |
|--------|---------------|-----------|----------|
| JWT + HTTPS | ✅ Implementado | - | - |
| RLS en Supabase | ✅ Implementado | - | - |
| Protected Routes | ✅ Implementado | - | - |
| Security Headers HTTP | ❌ Faltante | 🔴 Alta | Bajo |
| Rate Limiting Login | ❌ Faltante | 🔴 Alta | Medio |
| Validación Zod | ❌ Faltante | 🟡 Media | Bajo |
| Sanitización XSS | ❌ Faltante | 🟡 Media | Bajo |
| Audit Logs | ❌ Faltante | 🟡 Media | Alto |
| Backup Strategy | ❌ Faltante | 🔴 Alta | Bajo |
| 2FA | ❌ Faltante | 🟢 Baja | Medio |
| Strong Password Policy | ⚠️ Básica | 🟡 Media | Bajo |
| Data Encryption (DB) | ❌ Faltante | 🟡 Media | Alto |
| CSP Strict | ❌ Faltante | 🟡 Media | Medio |

**Leyenda**:
- 🔴 Alta: Crítico para producción
- 🟡 Media: Recomendado fuertemente
- 🟢 Baja: Nice to have

---

## 🎨 Sistema de Diseño ESENCIA

```
├── src/
│   ├── pages/               # Vistas principales
│   │   ├── Index.tsx        # Landing page con hero y featured products
│   │   ├── Catalog.tsx      # Catálogo completo de perfumes con filtros
│   │   ├── Dashboard.tsx    # Panel administrativo con métricas
│   │   ├── OrderDetail.tsx  # Detalle de pedido (ruta dinámica /pedido/:id)
│   │   └── NotFound.tsx     # Página 404 custom
│   ├── components/          # Componentes de negocio reutilizables
│   │   ├── Header.tsx       # Navegación principal
│   │   ├── PerfumeCard.tsx  # Card de producto con animaciones Framer Motion
│   │   ├── StatsCard.tsx    # Card de métricas del dashboard
│   │   ├── OrderRow.tsx     # Fila de pedido en tablas
│   │   ├── AlertItem.tsx    # Notificación de alerta
│   │   ├── NavLink.tsx      # Link de navegación activo
│   │   └── ui/              # Componentes primitivos shadcn (NO editar manualmente)
│   ├── hooks/
│   │   ├── use-mobile.tsx   # Hook para detección responsive
│   │   └── use-toast.ts     # Hook para notificaciones toast
│   ├── integrations/        # Integraciones con servicios externos
│   │   └── supabase/        # Cliente y tipos de Supabase
│   │       ├── client.ts    # Cliente configurado de Supabase
│   │       ├── types.ts     # Tipos TypeScript autogenerados
│   │       └── index.ts     # Exports públicos
│   ├── lib/
│   │   └── utils.ts         # Utilidad cn() para merge de clases Tailwind
│   └── test/
│       ├── setup.ts         # Configuración Vitest
│       └── example.test.ts  # Tests de ejemplo
├── public/
│   └── robots.txt           # SEO y crawlers
├── .github/
│   └── copilot-instructions.md  # Guía completa para agentes IA
├── .env.example             # Template de variables de entorno
└── SUPABASE_SETUP.md        # Guía de configuración de Supabase
```

### Decisiones de Arquitectura

- **Routing con React Router v6**: Catch-all para 404, rutas dinámicas para detalles
- **Alias de importación @/**: Configurado en vite.config.ts, tsconfig.json y components.json
- **Estado global con React Query**: `QueryClient` compartido en App.tsx para data fetching
- **Sistema dual de notificaciones**: `sonner` + shadcn `Toaster` para máxima flexibilidad
- **Tooltips globales**: `TooltipProvider` wraps toda la app
- **TypeScript relajado**: `noImplicitAny: false` para prototipado rápido (intencional)

---

## 🛠 Stack Tecnológico

### Core Framework
| Tecnología | Versión | Propósito |
|-----------|---------|-----------|
| **React** | ^18.3.1 | Framework de UI |
| **TypeScript** | ~5.6.2 | Tipado estático con configuración relajada |
| **Vite** | ^5.4.2 | Build tool + HMR ultrarrápido |
| **React Router** | ^6.26.0 | Routing con rutas dinámicas |

### UI & Styling
| Tecnología | Versión | Propósito |
|-----------|---------|-----------|
| **Tailwind CSS** | ^3.4.1 | Utility-first CSS con tokens custom AURA |
| **shadcn/ui** | Latest | Componentes accesibles (Radix UI + Tailwind) |
| **Framer Motion** | ^11.3.28 | Animaciones fluidas y gestos |
| **Lucide React** | ^0.462.0 | Librería de iconos SVG optimizados |
| **class-variance-authority** | ^0.7.0 | Sistema de variantes para componentes |
| **clsx + tailwind-merge** | Latest | Merge condicional de clases CSS |

### State & Data Management
| Tecnología | Versión | Propósito |
|-----------|---------|-----------|
| **@tanstack/react-query** | ^5.55.0 | Server state management + caching |
| **@supabase/supabase-js** | ^2.91.0 | Cliente de Supabase para backend |
| **Sonner** | ^1.5.0 | Toast notifications elegantes |

### Testing
| Tecnología | Versión | Propósito |
|-----------|---------|-----------|
| **Vitest** | ^2.0.5 | Test runner compatible con Vite |
| **@testing-library/react** | ^16.0.1 | Testing de componentes React |
| **jsdom** | ^25.0.0 | Simulación de DOM para tests |

### Development Tools
| Tecnología | Versión | Propósito |
|-----------|---------|-----------|
| **ESLint** | ^9.9.1 | Linter con flat config |
| **PostCSS** | ^8.4.47 | Procesador CSS (Tailwind) |
| **Lovable Tagger** | ^1.1.13 | Integración con Lovable UI editor |

---

## 🎨 Sistema de Diseño ESENCIA

### Paleta de Colores Premium
Tokens CSS custom definidos en `src/index.css` y extendidos en `tailwind.config.ts`:

```css
--aura-deep: 210 50% 11%;     /* #0B1C2D - Fondo base (azul profundo) */
--aura-night: 209 55% 16%;    /* #1A2B3D - Backgrounds de cards */
--aura-gold: 42 47% 54%;      /* #C9A24D - Color primario CTA (oro) */
--aura-smoke: 220 6% 57%;     /* #8A8E97 - Texto muted */
```

**Uso en componentes**:
```tsx
<div className="bg-aura-deep text-aura-gold border-aura-smoke">
```

### Tipografía de Lujo
Sistema dual para contraste elegante:

| Font | Uso | Clase Tailwind |
|------|-----|----------------|
| **Cormorant Garamond** (Serif) | Títulos y headings | `font-serif` |
| **Inter** (Sans) | Texto de cuerpo | `font-sans` (default) |

### Variantes de Componentes Custom

#### Button (Extendidos en `src/components/ui/button.tsx`)
```tsx
<Button variant="gold" size="lg">Comprar ahora</Button>
<Button variant="gold-outline">Ver detalles</Button>
```

#### Badge (Tipos específicos del dominio)
```tsx
<Badge variant="gold">Árabe</Badge>
<Badge variant="secondary">Diseñador</Badge>
<Badge variant="outline">Nicho</Badge>
<Badge variant="stock">En stock</Badge>
<Badge variant="pending">Agotado</Badge>
```

### Utilidades Visuales Custom
```css
.gradient-gold      /* Gradiente dorado para fondos */
.gradient-dark      /* Gradiente oscuro para overlays */
.shadow-gold        /* Sombra con tinte dorado */
.gold-glow          /* Efecto de brillo dorado */
```

### Patrones de Animación (Framer Motion)

**Patrón estándar para entrada**:
```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.5 }}
  whileHover={{ y: -4 }}
>
```

---

## 🛠 Stack Tecnológico

### Core Framework
| Tecnología | Versión | Propósito |
|-----------|---------|-----------|
| **React** | ^18.3.1 | Framework de UI |
| **TypeScript** | ~5.6.2 | Tipado estático |
| **Vite** | ^5.4.2 | Build tool + HMR |
| **React Router** | ^6.26.0 | Routing |

### UI & Styling
| Tecnología | Versión | Propósito |
|-----------|---------|-----------|
| **Tailwind CSS** | ^3.4.1 | Utility-first CSS |
| **shadcn/ui** | Latest | Componentes accesibles |
| **Framer Motion** | ^11.3.28 | Animaciones |
| **Lucide React** | ^0.462.0 | Iconos SVG |

### State & Data
| Tecnología | Versión | Propósito |
|-----------|---------|-----------|
| **@tanstack/react-query** | ^5.55.0 | Server state + caching |
| **@supabase/supabase-js** | ^2.91.0 | Cliente backend |
| **Sonner** | ^1.5.0 | Toast notifications |

### Testing
| Tecnología | Versión | Propósito |
|-----------|---------|-----------|
| **Vitest** | ^2.0.5 | Test runner |
| **@testing-library/react** | ^16.0.1 | Testing de componentes |
| **jsdom** | ^25.0.0 | Simulación de DOM |

---

## 💻 Desarrollo Local

### Instalación

```bash
# Clonar repositorio
git clone https://github.com/tu-usuario/aura-saas-design.git
cd aura-saas-design

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con credenciales de Supabase

# Iniciar servidor de desarrollo
npm run dev
```

Servidor iniciará en **http://localhost:8080**.

### Comandos Disponibles

```bash
npm run dev              # Dev server con HMR
npm run build            # Build de producción
npm run preview          # Preview del build
npm run lint             # Ejecutar ESLint
npm test                 # Ejecutar tests
npm run test:watch       # Tests en watch mode
```

### Configurar Supabase

1. Crear proyecto en [supabase.com](https://supabase.com)
2. Obtener credenciales (Dashboard → Settings → API)
3. Ejecutar `supabase/schema.sql` en SQL Editor
4. Ejecutar `supabase/auth-schema.sql` en SQL Editor
5. Configurar `.env.local` con URL y anon key

📚 **Guía completa**: [CHECKLIST_SUPABASE.md](CHECKLIST_SUPABASE.md)

---

## 🚀 Deploy en Vercel

### ¿Por Qué Vercel?

| Ventaja | Descripción |
|---------|-------------|
| **Deploy Automático** | Cada push a `main` despliega automáticamente |
| **Preview Deploys** | Cada PR genera una URL de preview |
| **Edge Network Global** | CDN en 100+ ubicaciones |
| **Zero Config** | Detecta Vite automáticamente |
| **SSL Gratis** | HTTPS automático con Let's Encrypt |
| **Rollbacks Instantáneos** | Volver a deploy anterior en 1 click |
| **Environment Variables** | Gestión segura de secrets |
| **Analytics Integrado** | Web Vitals y métricas de uso |

### Paso a Paso para Deploy

#### **Opción 1: Deploy desde GitHub (Recomendado)**

1. **Push código a GitHub**:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/tu-usuario/esencia-saas.git
git push -u origin main
```

2. **Conectar con Vercel**:
- Ve a [vercel.com](https://vercel.com)
- Click en "New Project"
- Importa tu repositorio de GitHub
- Vercel detecta automáticamente que es un proyecto Vite

3. **Configurar variables de entorno**:
```
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

4. **Deploy**:
- Click "Deploy"
- Espera 2-3 minutos
- Tu app estará en `https://esencia-saas.vercel.app`

#### **Opción 2: Deploy con Vercel CLI**

```bash
# Instalar Vercel CLI globalmente
npm i -g vercel

# Login en Vercel
vercel login

# Deploy en producción
vercel --prod

# Configurar variables de entorno
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
```

### Configuración Avanzada de Vercel

**Crear `vercel.json`** en raíz del proyecto:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        },
        {
          "key": "Permissions-Policy",
          "value": "geolocation=(), microphone=(), camera=()"
        },
        {
          "key": "Strict-Transport-Security",
          "value": "max-age=31536000; includeSubDomains; preload"
        }
      ]
    }
  ],
  "redirects": [
    {
      "source": "/home",
      "destination": "/",
      "permanent": true
    }
  ]
}
```

**Características del `vercel.json`**:
- ✅ Rewrite para SPA (todas las rutas apuntan a index.html)
- ✅ Headers de seguridad HTTP
- ✅ Redirects personalizados
- ✅ Configuración de framework

### Custom Domain

1. **Comprar dominio** (ej: Namecheap, GoDaddy, Google Domains)
2. **Vercel Dashboard** → Tu proyecto → Settings → Domains
3. **Agregar dominio**: `esencia-perfumes.com`
4. **Configurar DNS** según instrucciones de Vercel:
```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```
5. **Esperar propagación DNS** (5-60 minutos)
6. **SSL automático** - Vercel configura HTTPS gratis

### Monitoreo y Analytics

**Métricas disponibles en Vercel Dashboard**:
- **Web Vitals**: LCP, FID, CLS, TTFB
- **Traffic**: Visitas, países, dispositivos
- **Performance**: Tiempos de carga por página
- **Errors**: Stack traces de errores de JS

**Activar Analytics**:
1. Vercel Dashboard → Proyecto → Analytics
2. Enable "Vercel Analytics"
3. Deploy nuevamente
4. Métricas aparecerán en 24-48 horas

### Environment Variables por Ambiente

```bash
# Variables de desarrollo (local)
vercel env add VITE_SUPABASE_URL development

# Variables de preview (PRs)
vercel env add VITE_SUPABASE_URL preview

# Variables de producción
vercel env add VITE_SUPABASE_URL production
```

**En Vercel Dashboard**: Settings → Environment Variables

### CI/CD Automático

**Flujo implementado automáticamente**:
```
git push origin main
    ↓
GitHub Webhook notifica a Vercel
    ↓
Vercel clona repositorio
    ↓
npm install (con cache de dependencies)
    ↓
npm run build (Vite build optimizado)
    ↓
Deploy a Edge Network global
    ↓
Invalidar cache de CDN
    ↓
Deploy completo ✅
```

**Preview Deploys**:
```
git checkout -b feature/nueva-funcionalidad
git push origin feature/nueva-funcionalidad
    ↓
Crear Pull Request en GitHub
    ↓
Vercel genera Preview URL automática
    ↓
Comentario en PR con link de preview
    ↓
Testeás en URL temporal
    ↓
Merge PR → Deploy a producción
```

### Performance Optimizations en Vercel

**Cache automático de assets**:
```
# Configurado por Vercel automáticamente
/assets/*.js      → Cache por 1 año
/assets/*.css     → Cache por 1 año
/index.html       → No cache (siempre fresco)
```

**Compression**:
- Gzip automático para text/html, text/css, application/javascript
- Brotli para navegadores modernos (mejor ratio que gzip)

**Edge Caching**:
- Static files cacheados en 100+ edge locations
- Latencia <50ms para usuarios globales

### Rollback en Caso de Error

```bash
# Ver deploys anteriores
vercel list

# Promover deploy anterior a producción
vercel promote <deployment-url>

# O desde Vercel Dashboard
# Deployments → Click en deploy anterior → "Promote to Production"
```

### Límites del Plan Free de Vercel

| Recurso | Límite Free | Límite Pro |
|---------|-------------|------------|
| **Bandwidth** | 100 GB/mes | 1 TB/mes |
| **Build time** | 6000 min/mes | 24000 min/mes |
| **Serverless functions** | 100 GB-hours | 1000 GB-hours |
| **Team members** | 1 | Ilimitado |
| **Custom domains** | Ilimitado | Ilimitado |
| **Deploy previews** | Ilimitado | Ilimitado |

💡 **Para este proyecto**: Free plan es más que suficiente

---

## 🧪 Testing

### Configuración Actual

- **Framework**: Vitest (compatible con Vite)
- **Environment**: jsdom
- **Setup**: `src/test/setup.ts`
- **Coverage**: Preparado para activar

### Ejecutar Tests

```bash
npm test              # Run una vez
npm run test:watch    # Watch mode interactivo
npm run test:coverage # Generar reporte de coverage
```

### Ejemplo de Test

```tsx
import { render, screen } from '@testing-library/react';
import { Button } from '@/components/ui/button';

describe('Button', () => {
  it('renders with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick handler', async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    
    await userEvent.click(screen.getByText('Click'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

---

## 📚 Recursos y Documentación

### Guías de Configuración

| Archivo | Propósito | Tiempo |
|---------|-----------|--------|
| 🎯 [**CHECKLIST_SUPABASE.md**](CHECKLIST_SUPABASE.md) | Setup paso a paso de Supabase | 10-15 min |
| ⚡ [**QUICKSTART_SUPABASE.md**](QUICKSTART_SUPABASE.md) | Resumen rápido | 5 min |
| 📖 [**SUPABASE_SETUP.md**](SUPABASE_SETUP.md) | Guía completa con troubleshooting | 20-30 min |
| 🗄️ [**supabase/schema.sql**](supabase/schema.sql) | Schema completo de BD | - |
| 💻 [**src/pages/SupabaseExample.tsx**](src/pages/SupabaseExample.tsx) | Componente CRUD de ejemplo | - |

### Enlaces Externos

- [Supabase Dashboard](https://supabase.com/dashboard)
- [shadcn/ui Components](https://ui.shadcn.com)
- [Tailwind CSS Docs](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion)
- [React Query Docs](https://tanstack.com/query)
- [Vercel Docs](https://vercel.com/docs)

---

## 🎯 Roadmap Futuro

### Features Planeados

- [ ] Google OAuth funcional (activar en Supabase)
- [ ] Sistema de reviews y ratings
- [ ] Wishlist/Favoritos persistente
- [ ] Checkout con Stripe/MercadoPago
- [ ] Email notifications (Resend o SendGrid)
- [ ] Panel admin completo (gestión de productos)
- [ ] Filtros avanzados (precio, marca, notas)
- [ ] Búsqueda con Algolia
- [ ] Chat en vivo (Intercom o custom)
- [ ] PWA (Progressive Web App)

### Mejoras de Seguridad

- [ ] Security headers HTTP completos
- [ ] Rate limiting en login
- [ ] 2FA (Two-Factor Authentication)
- [ ] Validación con Zod en todos los forms
- [ ] Audit logs de acciones críticas
- [ ] Strong password policy
- [ ] Encriptación de datos sensibles

### Optimizaciones

- [ ] Image optimization (next/image equivalent)
- [ ] Lazy loading de rutas
- [ ] Service Worker para offline
- [ ] Skeleton loaders en todas las vistas
- [ ] Infinite scroll en catálogo
- [ ] Virtualized lists para tablas grandes

---

## 👨‍💻 Autor

**Lucas** - Full Stack Developer

- 🌐 Portfolio: [Tu sitio web]
- 💼 LinkedIn: [Tu LinkedIn]
- 🐙 GitHub: [@tu-usuario](https://github.com/tu-usuario)

---

## 📄 Licencia

Este proyecto es de código abierto bajo la licencia MIT.

---

## 🙏 Agradecimientos

- **Lovable.dev** - Plataforma de desarrollo asistido por IA
- **Supabase** - Backend-as-a-Service increíble
- **shadcn/ui** - Librería de componentes de calidad
- **Vercel** - Hosting y deployment sin fricción

---

**Desarrollado con ✨ usando React, TypeScript, Tailwind, Supabase y mucho ☕**

**🎯 Proyecto MVP Funcional** - Listo para portafolio y demos  
**🚀 Demo en vivo**: [https://esencia-perfumes.vercel.app](#)  
**📧 Contacto**: [tu-email@ejemplo.com](mailto:tu-email@ejemplo.com)

---

<div align="center">

**⭐ Si te gustó este proyecto, dale una estrella en GitHub ⭐**

[⬆ Volver al inicio](#-esencia---e-commerce-saas-premium)

</div>

```css
--aura-deep: 210 50% 11%;     /* #0B1C2D - Fondo base (azul profundo) */
--aura-night: 209 55% 16%;    /* #1A2B3D - Backgrounds de cards */
--aura-gold: 42 47% 54%;      /* #C9A24D - Color primario CTA (oro) */
--aura-smoke: 220 6% 57%;     /* #8A8E97 - Texto muted */
```

**Uso en componentes**:
```tsx
<div className="bg-aura-deep text-aura-gold border-aura-smoke">
```

### Tipografía de Lujo
Sistema dual para contraste elegante:

| Font | Uso | Clase Tailwind |
|------|-----|----------------|
| **Cormorant Garamond** (Serif) | Títulos y headings | `font-serif` |
| **Inter** (Sans) | Texto de cuerpo | `font-sans` (default) |

**Ejemplo**:
```tsx
<h1 className="font-serif text-4xl font-bold text-aura-gold">
  Colección Premium
</h1>
```

### Variantes de Componentes Custom

#### Button (Extendidos en [src/components/ui/button.tsx](src/components/ui/button.tsx))
```tsx
<Button variant="gold" size="lg">
  Comprar ahora
</Button>
<Button variant="gold-outline">
  Ver detalles
</Button>
```
- `gold`: Gradiente dorado con shadow glow (CTA principal)
- `gold-outline`: Versión outline para acciones secundarias

#### Badge (Tipos específicos del dominio)
```tsx
<Badge variant="gold">Árabe</Badge>          {/* Tipo de perfume */}
<Badge variant="secondary">Diseñador</Badge>
<Badge variant="outline">Nicho</Badge>
<Badge variant="stock">En stock</Badge>      {/* Estado de inventario */}
<Badge variant="pending">Agotado</Badge>
```

### Utilidades Visuales Custom
Clases definidas en [src/index.css](src/index.css):

```css
.gradient-gold      /* Gradiente dorado para fondos */
.gradient-dark      /* Gradiente oscuro para overlays */
.shadow-gold        /* Sombra con tinte dorado */
.gold-glow          /* Efecto de brillo dorado (productos destacados) */
```

**Uso**:
```tsx
<div className="gold-glow shadow-gold gradient-gold">
  Producto Featured
</div>
```

---

## 🎭 Patrones de Animación

### 1. Framer Motion - Patrón Estándar
Todas las cards y secciones usan este patrón consistente:

```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.5 }}
  whileHover={{ y: -4 }}
>
```

**Componentes de referencia**:
- [PerfumeCard.tsx](src/components/PerfumeCard.tsx) - Animación de entrada + hover
- [StatsCard.tsx](src/components/StatsCard.tsx) - Fade in con stagger

### 2. Hover Effects
Elevación sutil en hover para feedback visual:

```tsx
whileHover={{ y: -4 }}  // Cards se elevan 4px
whileTap={{ scale: 0.98 }}  // Botones comprimen ligeramente
```

### 3. Viewport Triggers
`viewport={{ once: true }}` asegura que las animaciones solo ocurran una vez al entrar en vista (optimización de performance).

### 4. Transiciones Consistentes
```tsx
transition={{ 
  duration: 0.5,  // Duración estándar
  ease: "easeOut"  // Curva de aceleración
}}
```

---

## �️ Backend con Supabase
### 📚 Guías de Configuración Disponibles

El proyecto incluye **documentación completa** para configurar Supabase. Consulta según tu necesidad:

| Archivo | Cuándo Usarlo | Tiempo |
|---------|---------------|--------|
| 🎯 [**CHECKLIST_SUPABASE.md**](CHECKLIST_SUPABASE.md) | **Empieza aquí** - Lista interactiva paso a paso | 10-15 min |
| ⚡ [**QUICKSTART_SUPABASE.md**](QUICKSTART_SUPABASE.md) | Resumen rápido para setup básico | 5 min |
| 📖 [**SUPABASE_SETUP.md**](SUPABASE_SETUP.md) | Guía completa con troubleshooting y features avanzados | 20-30 min |
| 🔄 [**SUPABASE_INTEGRATION_GUIDE.md**](SUPABASE_INTEGRATION_GUIDE.md) | Plantilla reutilizable para otros proyectos | Referencia |
| 🗄️ [**supabase/schema.sql**](supabase/schema.sql) | Schema SQL completo con 7 tablas listo para ejecutar | - |
| 💻 [**src/pages/SupabaseExample.tsx**](src/pages/SupabaseExample.tsx) | Componente CRUD funcional de ejemplo | - |
| 🎣 [**src/integrations/supabase/hooks.example.ts**](src/integrations/supabase/hooks.example.ts) | Patrones de React Query + Supabase | - |
| 📂 [**src/integrations/supabase/README.md**](src/integrations/supabase/README.md) | Documentación técnica del módulo | - |
### Configuración Inicial

El proyecto está pre-configurado para conectarse con Supabase. Sigue estos pasos:

1. **Crear proyecto en Supabase** → [supabase.com](https://supabase.com)
2. **Obtener credenciales** → Dashboard → Settings → API
3. **Configurar `.env.local`**:

```env
VITE_SUPABASE_URL=https://tuprojectref.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

🎯 **¿Primera vez?** → Sigue el [CHECKLIST_SUPABASE.md](CHECKLIST_SUPABASE.md) paso a paso  
📚 **¿Necesitas detalles?** → Lee el [SUPABASE_SETUP.md](SUPABASE_SETUP.md) completo  
⚡ **¿Setup rápido?** → Usa el [QUICKSTART_SUPABASE.md](QUICKSTART_SUPABASE.md) de 5 minutos

### Uso Básico

```tsx
import { supabase } from '@/integrations/supabase';
import { useQuery } from '@tanstack/react-query';

// Fetch de datos
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

// Insertar datos
const createOrder = async (orderData) => {
  const { data, error } = await supabase
    .from('orders')
    .insert([orderData])
    .select()
    .single();
  
  if (error) throw error;
  return data;
};
```

### Características

- ✅ **Database PostgreSQL** - Base de datos relacional completa
- ✅ **Row Level Security** - Seguridad a nivel de fila
- ✅ **Real-time subscriptions** - Actualizaciones en tiempo real
- ✅ **Storage** - Almacenamiento de archivos (imágenes de perfumes)
- ✅ **Edge Functions** - Serverless functions con Deno
- ✅ **Authentication** - Sistema de autenticación integrado

---

## �💻 Desarrollo Local

### Prerrequisitos
- **Node.js** 18+ y **npm** instalados ([nvm recomendado](https://github.com/nvm-sh/nvm))

### Instalación

```bash
# Clonar el repositorio
git clone <YOUR_GIT_URL>
cd aura-saas-design

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus credenciales de Supabase

# Iniciar servidor de desarrollo
npm run dev
```

🔗 **Para configurar Supabase**, consulta la guía completa: [SUPABASE_SETUP.md](SUPABASE_SETUP.md)

El servidor se iniciará en **http://localhost:8080** (puerto configurado en [vite.config.ts](vite.config.ts)).

### Comandos Disponibles

```bash
npm run dev              # Dev server con HMR (puerto 8080)
npm run build            # Build de producción optimizado
npm run build:dev        # Build en modo desarrollo (sin minificar)
npm run preview          # Preview del build de producción
npm run lint             # Ejecutar ESLint con flat config
npm test                 # Ejecutar tests una vez
npm run test:watch       # Tests en watch mode con Vitest
```

### Agregar Componente shadcn/ui

```bash
npx shadcn@latest add <component-name>
# Ejemplo: npx shadcn@latest add dialog
```

⚠️ **IMPORTANTE**: Los componentes en `src/components/ui/` son autogenerados por shadcn CLI. **NO los edites manualmente**.

### Estructura de Rutas

Rutas definidas en [src/App.tsx](src/App.tsx):

```tsx
/                   → Index.tsx (Landing page)
/catalogo          → Catalog.tsx (Catálogo de productos)
/dashboard         → Dashboard.tsx (Panel admin)
/pedido/:id        → OrderDetail.tsx (Detalle de pedido dinámico)
/*                 → NotFound.tsx (404 custom)
```

**Para agregar nuevas rutas**, editar **antes** del catch-all `<Route path="*">`.

---

## 🚀 Deployment

### Opción 1: Lovable (Recomendado)

**Flujo de trabajo integrado**:
1. **Desarrollo local** → Push cambios a GitHub
2. **Sincronización automática** → Lovable detecta cambios
3. **Publicación** → Dashboard de Lovable → Share → Publish
4. **Custom domain** → Project > Settings > Domains

**Ventajas**:
- ✅ Deploy automático en cada push
- ✅ CDN global optimizado
- ✅ SSL gratis incluido
- ✅ Build automático (`vite build`)
- ✅ Variables de entorno en dashboard

### Opción 2: Otros Proveedores

Compatible con cualquier hosting estático:

| Proveedor | Comando | Build Output |
|-----------|---------|--------------|
| **Vercel** | `vercel --prod` | `dist/` |
| **Netlify** | `netlify deploy --prod` | `dist/` |
| **Cloudflare Pages** | Auto-deploy desde GitHub | `dist/` |
| **GitHub Pages** | Workflow Actions | `dist/` |

**Build command**: `npm run build`  
**Output directory**: `dist/`

### Custom Domain en Lovable

1. Dashboard de Lovable → Tu proyecto
2. Project > Settings > Domains
3. Click "Connect Domain"
4. Configurar DNS según instrucciones

📚 **Docs completas**: [docs.lovable.dev/features/custom-domain](https://docs.lovable.dev/features/custom-domain)

---

## 🧪 Testing

### Configuración

- **Framework**: Vitest (compatible con Vite)
- **Environment**: jsdom para simulación de DOM
- **Setup file**: [src/test/setup.ts](src/test/setup.ts)
- **Globals**: Habilitados (`describe`, `it`, `expect` disponibles sin imports)

### Ejecutar Tests

```bash
npm test              # Run una vez
npm run test:watch    # Watch mode con UI interactiva
```

### Patrón de Tests

```tsx
import { render, screen } from '@testing-library/react';
import { Button } from '@/components/ui/button';

describe('Button', () => {
  it('renders with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
});
```

---

## 📝 Editar el Código

### Opción 1: Lovable (Sin configuración)
- Visita [tu proyecto en Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID)
- Usa prompts de IA para modificar código
- Cambios se commitean automáticamente a GitHub

### Opción 2: IDE Local
- Clona el repo y trabaja con tu editor favorito (VS Code, Cursor, etc.)
- Push a GitHub → Sincroniza automáticamente con Lovable
- Recomendado para edición avanzada y debugging

### Opción 3: GitHub UI
- Navega al archivo → Click "Edit" (ícono lápiz)
- Edita y commit directamente en el navegador

### Opción 4: GitHub Codespaces
- Repositorio → Botón "Code" → Pestaña "Codespaces"
- Lanza un entorno de desarrollo completo en la nube
- Incluye todas las extensiones y configuraciones

---

## 🤖 Guía para Agentes IA

Si trabajas con agentes de IA (GitHub Copilot, Cursor, Cline, etc.), consulta [.github/copilot-instructions.md](.github/copilot-instructions.md) para:

- Patrones de importación con alias `@/`
- Convenciones de diseño AURA
- Uso correcto de variantes de componentes
- Estructura de animaciones con Framer Motion
- Integración con Supabase y React Query
- Configuración de TypeScript relajada

---

## 📚 Recursos Adicionales

### Documentación del Proyecto

**Configuración de Supabase:**
- 🎯 [**CHECKLIST_SUPABASE.md**](CHECKLIST_SUPABASE.md) - **START HERE** - Checklist paso a paso
- ⚡ [**QUICKSTART_SUPABASE.md**](QUICKSTART_SUPABASE.md) - Setup rápido en 5 minutos
- 📖 [**SUPABASE_SETUP.md**](SUPABASE_SETUP.md) - Guía completa y detallada
- 🔄 [**SUPABASE_INTEGRATION_GUIDE.md**](SUPABASE_INTEGRATION_GUIDE.md) - Plantilla para otros proyectos
- 🗄️ [**supabase/schema.sql**](supabase/schema.sql) - Schema de base de datos listo para usar
- 📂 [**src/integrations/supabase/README.md**](src/integrations/supabase/README.md) - Documentación del módulo

**Ejemplos de Código:**
- 💻 [**src/pages/SupabaseExample.tsx**](src/pages/SupabaseExample.tsx) - Componente CRUD completo funcional
- 🎣 [**src/integrations/supabase/hooks.example.ts**](src/integrations/supabase/hooks.example.ts) - Patrones de React Query

### Herramientas y Referencias
- [Supabase Dashboard](https://supabase.com/dashboard)
- [shadcn/ui Components](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion)
- [React Query](https://tanstack.com/query)

---

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

---

**Desarrollado con ✨ usando React, TypeScript, Tailwind, Supabase y Lovable**
