# Aura SaaS Design - AI Agent Instructions

## Project Overview
Premium perfume e-commerce SaaS platform built with **Vite + React 18 + TypeScript**, using **shadcn/ui** components and **Tailwind CSS**. The design system implements a luxury "AURA" brand theme with deep blue (`#0B1C2D`) and gold (`#C9A24D`) accents.

## Architecture & Key Patterns

### Component Structure
- **Pages**: `src/pages/` - Route components (Dashboard, Catalog, OrderDetail, Index, NotFound)
- **Shared Components**: `src/components/` - Business components (Header, PerfumeCard, StatsCard, OrderRow, AlertItem, NavLink)
- **UI Primitives**: `src/components/ui/` - shadcn components (Button, Card, Badge, etc.)
- **Routing**: React Router v6 with catch-all 404 route (`<Route path="*">`)

### Import Aliases (Critical)
All imports use the `@/` alias configured in [vite.config.ts](vite.config.ts#L15), [tsconfig.json](tsconfig.json#L4), and [components.json](components.json#L10):
```tsx
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
```

### State & Data Management
- **React Query**: Global data fetching via `@tanstack/react-query` with shared `QueryClient` in [src/App.tsx](src/App.tsx#L12)
- **Toast Notifications**: Dual system using `sonner` and shadcn's `Toaster` (both initialized in App.tsx)
- **Tooltips**: Global `TooltipProvider` wraps entire app

### Animation Pattern
All interactive components use **Framer Motion** with consistent patterns:
```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  whileHover={{ y: -4 }}
>
```
See [src/components/PerfumeCard.tsx](src/components/PerfumeCard.tsx#L31) and [src/components/StatsCard.tsx](src/components/StatsCard.tsx#L27) for reference implementations.

## AURA Design System (Critical)

### Custom Color Tokens
Defined in [src/index.css](src/index.css#L43-L50) and extended in [tailwind.config.ts](tailwind.config.ts#L62-L72):
```css
--aura-deep: 210 50% 11%;     /* Background base */
--aura-night: 209 55% 16%;    /* Card backgrounds */
--aura-gold: 42 47% 54%;      /* Primary CTA color */
--aura-smoke: 220 6% 57%;     /* Muted text */
```

Use via: `text-aura-gold`, `bg-aura-night`, `border-aura-smoke`

### Typography System
- **Serif**: Cormorant Garamond for headings (`font-serif`)
- **Sans**: Inter for body text (`font-sans`, default)
- Usage: `className="font-serif text-3xl font-bold"`

### Button Variants (Custom)
Extended shadcn buttons with luxury variants in [src/components/ui/button.tsx](src/components/ui/button.tsx#L18-L19):
- `gold`: Gradient gold with shadow (primary CTA)
- `gold-outline`: Outlined gold variant
```tsx
<Button variant="gold" size="lg">Comprar ahora</Button>
```

### Badge Variants (Custom)
Project uses custom badge types for product metadata:
- `gold` (type: "Árabe"), `secondary` (type: "Diseñador"), `outline` (type: "Nicho")
- `stock` (in stock), `pending` (out of stock)

### Utility Classes
Custom utilities defined in [src/index.css](src/index.css):
- `.gradient-gold`: Gold gradient backgrounds
- `.gradient-dark`: Dark gradient overlays
- `.shadow-gold`: Gold-tinted box shadow
- `.gold-glow`: Gold glow effect for featured items

## Development Workflow

### Commands
- **Dev Server**: `npm run dev` (port 8080, runs on `::` for network access)
- **Build**: `npm run build` (production) or `npm run build:dev` (development mode)
- **Tests**: `npm test` (run once) or `npm test:watch` (watch mode with Vitest)
- **Lint**: `npm run lint` (ESLint with flat config)

### Testing Setup
Vitest configured with jsdom environment ([vitest.config.ts](vitest.config.ts)):
- Setup file: `src/test/setup.ts`
- Include pattern: `src/**/*.{test,spec}.{ts,tsx}`
- Globals enabled for easier test writing

### TypeScript Configuration
Relaxed strictness for rapid prototyping ([tsconfig.json](tsconfig.json#L8-L13)):
- `noImplicitAny: false`
- `noUnusedParameters: false`
- `noUnusedLocals: false`
- `strictNullChecks: false`

This is **intentional** for a Lovable-generated project focused on design iteration.

## Integration Points

### Lovable Platform
This project integrates with Lovable's component tagging system:
- **Development Only**: [vite.config.ts](vite.config.ts#L13) conditionally loads `lovable-tagger` plugin
- **Purpose**: Enables visual editing in Lovable UI
- **Do not remove** the `componentTagger()` plugin or `lovable-tagger` dependency

### Route Structure
All routes defined in [src/App.tsx](src/App.tsx#L18-L24):
- `/` - Index (landing page)
- `/catalogo` - Product catalog
- `/dashboard` - Admin dashboard
- `/pedido/:id` - Order detail (dynamic route)

**Important**: Add custom routes **above** the `<Route path="*">` catch-all.

## Common Patterns

### Component Props
Use TypeScript interfaces with explicit types:
```tsx
interface StatsCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
}
```

### Styling with cn()
Always use the `cn()` utility from `@/lib/utils` to merge Tailwind classes:
```tsx
<div className={cn("base-classes", featured && "gold-glow", className)} />
```

### Icon Imports
Use **lucide-react** for all icons:
```tsx
import { ShoppingCart, Eye, DollarSign } from "lucide-react";
```

### Card Compositions
Follow shadcn's composition pattern:
```tsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>Content</CardContent>
</Card>
```

## When Adding Features

1. **New Pages**: Add to `src/pages/`, register route in [src/App.tsx](src/App.tsx) **before** catch-all
2. **Reusable Components**: Add to `src/components/` (not `/ui/` - that's for shadcn primitives)
3. **New shadcn Components**: Run `npx shadcn@latest add <component>` to auto-install to `src/components/ui/`
4. **Animations**: Follow the `initial/whileInView` pattern from existing components
5. **Colors**: Use AURA design tokens, don't add arbitrary colors
6. **Typography**: Maintain serif for headings, sans for body text

## Troubleshooting

- **Import Errors**: Verify `@/` alias works; check [vite.config.ts](vite.config.ts#L15)
- **Styling Issues**: Ensure `src/index.css` is imported in [src/main.tsx](src/main.tsx#L3)
- **Build Errors**: Check TypeScript relaxed settings aren't hiding issues
- **HMR Overlay**: Disabled intentionally in [vite.config.ts](vite.config.ts#L10)
