# 🌟 Aura SaaS Design

Plataforma e-commerce SaaS premium para perfumes de lujo, construida con React 18, TypeScript y animaciones cinematográficas. Sistema de diseño AURA con identidad visual sofisticada en azul profundo y acentos dorados.

**🔗 Proyecto en Lovable**: https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID

> 🚀 **¿Primera vez configurando el proyecto?** → Lee [SETUP_COMPLETE.md](SETUP_COMPLETE.md) para ver todo lo que está listo  
> 🗄️ **¿Quieres conectar Supabase?** → Sigue el [CHECKLIST_SUPABASE.md](CHECKLIST_SUPABASE.md) paso a paso

---

## 📋 Tabla de Contenidos

- [Arquitectura del Proyecto](#-arquitectura-del-proyecto)
- [Stack Tecnológico](#-stack-tecnológico)
- [Sistema de Diseño AURA](#-sistema-de-diseño-aura)
- [Patrones de Animación](#-patrones-de-animación)
- [Backend con Supabase](#-backend-con-supabase)
- [Desarrollo Local](#-desarrollo-local)
- [Deployment](#-deployment)
- [Testing](#-testing)

---

## 🏗 Arquitectura del Proyecto

Este es un **SPA moderno de e-commerce** optimizado para experiencias de usuario premium y gestión administrativa.

### Estructura de Directorios

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

## 🎨 Sistema de Diseño AURA

### Paleta de Colores Premium
Tokens CSS custom definidos en [src/index.css](src/index.css) y extendidos en [tailwind.config.ts](tailwind.config.ts):

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

### Configuración Inicial

El proyecto está pre-configurado para conectarse con Supabase. Sigue estos pasos:

1. **Crear proyecto en Supabase** → [supabase.com](https://supabase.com)
2. **Obtener credenciales** → Dashboard → Settings → API
3. **Configurar `.env.local`**:

```env
VITE_SUPABASE_URL=https://tuprojectref.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

📚 **Guía completa paso a paso**: [SUPABASE_SETUP.md](SUPABASE_SETUP.md)

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
- 📘 [Configuración completa de Supabase](SUPABASE_SETUP.md) - Guía paso a paso detallada
- 🚀 [Quick Start Supabase](QUICKSTART_SUPABASE.md) - Inicio rápido en 5 minutos
- 🗄️ [Schema SQL completo](supabase/schema.sql) - Schema de base de datos listo para usar
- 💻 [Ejemplo de componente](src/pages/SupabaseExample.tsx) - CRUD completo con Supabase
- 🎣 [Hooks de ejemplo](src/integrations/supabase/hooks.example.ts) - Patrones de React Query

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
