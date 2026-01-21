# Aura SaaS Design - AI Agent Instructions

## Project Overview
Premium perfume e-commerce SaaS platform built with **Vite + React 18 + TypeScript**, using **shadcn/ui** components and **Tailwind CSS**. The design system implements a luxury "AURA" brand theme with deep blue (`#0B1C2D`) and gold (`#C9A24D`) accents.

---

## 🎯 Agent Skills System

This project uses a **skill-based approach** for AI agents. When the user requests an action, identify which skill(s) apply and follow the corresponding workflow.

### Available Skills

#### 🎨 SKILL: Create UI Component
**Triggers**: "create component", "add button", "new card", "build form"

**Workflow**:
1. **Determine type**: Business logic component OR UI primitive?
   - Business → `src/components/` (e.g., ProductCard, UserProfile)
   - Primitive → Use `npx shadcn@latest add <name>` (installs to `src/components/ui/`)
2. **Apply AURA design system**:
   - Colors: `bg-aura-deep`, `text-aura-gold`, `border-aura-smoke`
   - Typography: `font-serif` for headings, `font-sans` for body
   - Buttons: Use `variant="gold"` or `variant="gold-outline"`
3. **Add animations** (see SKILL: Add Animation)
4. **Use TypeScript interfaces** for props
5. **Import with alias**: `import { Button } from "@/components/ui/button"`

**Example Output**:
```tsx
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ProductCardProps {
  title: string;
  price: number;
  featured?: boolean;
}

export function ProductCard({ title, price, featured }: ProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <Card className={cn("bg-aura-night", featured && "gold-glow")}>
        {/* Content */}
      </Card>
    </motion.div>
  );
}
```

---

#### 🎭 SKILL: Add Animation
**Triggers**: "animate", "add motion", "fade in", "hover effect"

**Workflow**:
1. Import Framer Motion: `import { motion } from "framer-motion"`
2. **Apply standard pattern**:
   ```tsx
   <motion.div
     initial={{ opacity: 0, y: 20 }}
     whileInView={{ opacity: 1, y: 0 }}
     viewport={{ once: true }}
     transition={{ duration: 0.5 }}
     whileHover={{ y: -4 }}
   >
   ```
3. **Variants for list items**:
   ```tsx
   const container = {
     hidden: { opacity: 0 },
     show: {
       opacity: 1,
       transition: { staggerChildren: 0.1 }
     }
   };
   ```
4. **Performance**: Always use `viewport={{ once: true }}` for entrance animations

**Reference**: [src/components/PerfumeCard.tsx](../src/components/PerfumeCard.tsx#L31), [src/components/StatsCard.tsx](../src/components/StatsCard.tsx#L27)

---

#### 🗄️ SKILL: Integrate Supabase Data
**Triggers**: "fetch from database", "save to supabase", "query data", "CRUD operations"

**Workflow**:
1. **Check setup**: Verify `.env.local` exists with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
   - If missing → Guide user to [CHECKLIST_SUPABASE.md](../CHECKLIST_SUPABASE.md)
2. **Create React Query hook**:
   ```tsx
   import { useQuery, useMutation } from '@tanstack/react-query';
   import { supabase } from '@/integrations/supabase';

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
   ```
3. **Handle mutations** with optimistic updates:
   ```tsx
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
   ```
4. **Add toast notifications**: Use `import { toast } from "sonner"`

**References**: 
- [hooks.example.ts](../src/integrations/supabase/hooks.example.ts) - React Query patterns
- [SupabaseExample.tsx](../src/pages/SupabaseExample.tsx) - Full CRUD component

---

#### 🛣️ SKILL: Add New Route
**Triggers**: "create page", "add route", "new view"

**Workflow**:
1. **Create page component** in `src/pages/`:
   ```tsx
   export default function NewPage() {
     return (
       <div className="min-h-screen bg-aura-deep p-8">
         <h1 className="font-serif text-3xl text-aura-gold">New Page</h1>
       </div>
     );
   }
   ```
2. **Register route** in [src/App.tsx](../src/App.tsx) **BEFORE** the catch-all `<Route path="*">`:
   ```tsx
   <Route path="/new-route" element={<NewPage />} />
   ```
3. **Add navigation link** to [src/components/Header.tsx](../src/components/Header.tsx):
   ```tsx
   <NavLink to="/new-route">New Page</NavLink>
   ```
4. **Test 404 handling**: Verify catch-all still works for invalid routes

---

#### 🧪 SKILL: Write Tests
**Triggers**: "add test", "test component", "unit test"

**Workflow**:
1. **Create test file** alongside component: `ComponentName.test.tsx`
2. **Use Vitest + Testing Library**:
   ```tsx
   import { render, screen } from '@testing-library/react';
   import { Button } from '@/components/ui/button';

   describe('Button', () => {
     it('renders with correct text', () => {
       render(<Button>Click me</Button>);
       expect(screen.getByText('Click me')).toBeInTheDocument();
     });

     it('handles click events', async () => {
       const handleClick = vi.fn();
       render(<Button onClick={handleClick}>Click</Button>);
       
       await userEvent.click(screen.getByText('Click'));
       expect(handleClick).toHaveBeenCalledTimes(1);
     });
   });
   ```
3. **Run tests**: `npm run test:watch`
4. **Mock Supabase**: Use `vi.mock('@/integrations/supabase')`

**Reference**: [src/test/setup.ts](../src/test/setup.ts)

---

#### 🎨 SKILL: Apply AURA Styling
**Triggers**: "make it look premium", "use brand colors", "style this"

**Workflow**:
1. **Background layers**:
   - Base: `bg-aura-deep` (darkest)
   - Cards: `bg-aura-night` (elevated)
   - Overlays: `bg-aura-night/80` (translucent)
2. **Text hierarchy**:
   - Headings: `font-serif text-3xl font-bold text-aura-gold`
   - Body: `font-sans text-aura-smoke`
   - Links: `text-aura-gold hover:text-aura-gold/80`
3. **Accents**:
   - Borders: `border-aura-smoke/20`
   - Shadows: `shadow-gold` or `gold-glow`
   - Gradients: `gradient-gold` or `gradient-dark`
4. **Buttons**:
   - Primary: `<Button variant="gold">`
   - Secondary: `<Button variant="gold-outline">`
5. **Use cn() utility** for conditional classes:
   ```tsx
   className={cn("base-classes", condition && "conditional-class")}
   ```

**Color Tokens**:
```css
--aura-deep: 210 50% 11%;   /* #0B1C2D */
--aura-night: 209 55% 16%;  /* #1A2B3D */
--aura-gold: 42 47% 54%;    /* #C9A24D */
--aura-smoke: 220 6% 57%;   /* #8A8E97 */
```

---

#### 📦 SKILL: Install shadcn Component
**Triggers**: "add dialog", "install select", "need accordion"

**Workflow**:
1. **Run CLI**: `npx shadcn@latest add <component-name>`
2. **Verify installation**: Component appears in `src/components/ui/`
3. **Import in your component**: `import { Dialog } from "@/components/ui/dialog"`
4. **Follow composition pattern**:
   ```tsx
   <Dialog>
     <DialogTrigger>Open</DialogTrigger>
     <DialogContent>
       <DialogHeader>
         <DialogTitle>Title</DialogTitle>
       </DialogHeader>
     </DialogContent>
   </Dialog>
   ```

**⚠️ NEVER edit files in `src/components/ui/` manually** - they're auto-generated

---

#### 🚀 SKILL: Debug and Troubleshoot
**Triggers**: "not working", "error", "fix", "debug"

**Workflow**:
1. **Check common issues**:
   - Import errors → Verify `@/` alias in imports
   - Styling issues → Ensure `src/index.css` imported in `main.tsx`
   - Supabase errors → Check `.env.local` exists and has correct credentials
   - Build errors → Run `npm run build` to see TypeScript issues
2. **Add console logs** for debugging:
   ```tsx
   console.log('[DEBUG] Component mounted with props:', props);
   ```
3. **Use React Query DevTools**:
   ```tsx
   import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
   // Add to App.tsx
   ```
4. **Check browser console** for errors
5. **Verify environment variables**:
   ```tsx
   console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
   ```

**Troubleshooting Guides**:
- Supabase issues → [SUPABASE_SETUP.md](../SUPABASE_SETUP.md#troubleshooting)
- General setup → [README.md](../README.md#development-local)

---

#### 📊 SKILL: Add State Management
**Triggers**: "manage state", "share data", "global state"

**Workflow**:
1. **For server data**: Use React Query (already configured)
   ```tsx
   const { data, isLoading } = useQuery({ queryKey: ['key'], queryFn });
   ```
2. **For UI state**: Use React Context
   ```tsx
   const ThemeContext = createContext<Theme | null>(null);
   export function ThemeProvider({ children }) {
     const [theme, setTheme] = useState<Theme>('dark');
     return (
       <ThemeContext.Provider value={{ theme, setTheme }}>
         {children}
       </ThemeContext.Provider>
     );
   }
   ```
3. **For form state**: Use React Hook Form (if needed, install first)
4. **Avoid prop drilling**: Lift state up or use Context

---

#### 🔒 SKILL: Implement Authentication
**Triggers**: "add login", "authentication", "sign in", "user auth"

**Workflow**:
1. **Use Supabase Auth**:
   ```tsx
   import { supabase } from '@/integrations/supabase';

   // Sign up
   const { data, error } = await supabase.auth.signUp({
     email: 'user@example.com',
     password: 'password123'
   });

   // Sign in
   const { data, error } = await supabase.auth.signInWithPassword({
     email: 'user@example.com',
     password: 'password123'
   });

   // Get current user
   const { data: { user } } = await supabase.auth.getUser();
   ```
2. **Create auth context** for app-wide user state
3. **Add protected routes**:
   ```tsx
   function ProtectedRoute({ children }) {
     const { user, loading } = useAuth();
     if (loading) return <div>Loading...</div>;
     if (!user) return <Navigate to="/login" />;
     return children;
   }
   ```
4. **Handle auth state changes**:
   ```tsx
   useEffect(() => {
     const { data: { subscription } } = supabase.auth.onAuthStateChange(
       (event, session) => {
         console.log('Auth event:', event, session);
       }
     );
     return () => subscription.unsubscribe();
   }, []);
   ```

**⚠️ IMPORTANT NOTES:**
- **AuthContext** (`src/contexts/AuthContext.tsx`) manages user state globally
- **NO cache system** - Always fetches profile fresh from Supabase to avoid stale data
- **Roles**: 'cliente' (default) and 'admin' stored in `profiles.role`
- **Admin UI**: Header shows 👑 crown icon, "Dashboard" link, gold-outlined button
- **Logout**: Clears all state + localStorage + forces page reload to `/`

**Debug Auth Issues:**
- Use `/debug-auth` page to inspect user, profile, and role state
- Check browser console for `[AUTH]` logs during login/logout
- Verify `profiles` table has correct role in Supabase Dashboard

---

#### 🔐 SKILL: Manage User Roles & Permissions
**Triggers**: "admin", "roles", "permissions", "access control"

**Workflow**:
1. **Check current role**:
   ```tsx
   const { profile, isAdmin } = useAuth();
   // profile.role === 'admin' or 'cliente'
   // isAdmin is computed: profile?.role === 'admin'
   ```

2. **Protect admin routes**:
   ```tsx
   <Route path="/dashboard" element={
     <ProtectedRoute requireAdmin={true}>
       <Dashboard />
     </ProtectedRoute>
   } />
   ```

3. **Conditional UI based on role**:
   ```tsx
   {profile?.role === 'admin' && (
     <Button variant="gold">Admin Only Action</Button>
   )}
   ```

4. **Change user role in Supabase**:
   ```sql
   UPDATE profiles 
   SET role = 'admin'
   WHERE id = 'user-uuid-here';
   ```

**Admin Features:**
- Dashboard access (`/dashboard`)
- Admin panel (`/admin`)
- Crown emoji 👑 in header
- Gold-outlined user button
- Special badge in dropdown menu

**⚠️ CRITICAL - Supabase RLS Policies:**
```sql
-- ✅ CORRECT: No recursion
CREATE POLICY "authenticated_can_view_all_profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

-- ❌ WRONG: Causes infinite recursion
CREATE POLICY "admins_can_view_all"
  ON profiles FOR SELECT
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );
```

**Troubleshooting:**
- Error "infinite recursion detected" → Fix RLS policies (see above)
- Role not updating → Clear localStorage, logout, login again
- `isAdmin: FALSE` but Supabase shows 'admin' → Use `/debug-auth` to refresh profile

---

#### 🔄 SKILL: Password Recovery
**Triggers**: "forgot password", "reset password", "recover account"

**Workflow**:
1. **User flow**:
   - Login page → "¿Olvidaste tu contraseña?" link
   - Enter email → Receives recovery email from Supabase
   - Click link in email → Redirected to `/reset-password`
   - Enter new password → Account recovered

2. **Send recovery email**:
   ```tsx
   const { resetPassword } = useAuth();
   await resetPassword('user@example.com');
   ```

3. **Update password** (after receiving token):
   ```tsx
   const { updatePassword } = useAuth();
   await updatePassword('newPassword123');
   ```

**Implementation:**
- `/forgot-password` - Request recovery email page
- `/reset-password` - Set new password page (validates token from URL)
- AuthContext provides `resetPassword()` and `updatePassword()` functions
- Email templates configurable in Supabase Dashboard → Authentication → Email Templates

**Supabase Configuration Required:**
- **Site URL**: `http://localhost:8080` (or production domain)
- **Redirect URLs**: `http://localhost:8080/reset-password`, `http://localhost:8080/**`
- Configure in: Supabase Dashboard → Authentication → URL Configuration

**Reference**: [FORGOT_PASSWORD_SETUP.md](../FORGOT_PASSWORD_SETUP.md)

---

### 🎯 Skill Selection Logic

When user makes a request:

1. **Identify intent** from request keywords
2. **Select matching skill(s)** from table above
3. **Execute workflow** step by step
4. **Verify completion** with user

**Multi-skill tasks**: Some requests may require multiple skills (e.g., "Create a product page with database" = SKILL: Add New Route + SKILL: Integrate Supabase Data + SKILL: Create UI Component)

---

## Architecture & Key Patterns

### Component Structure
- **Pages**: `src/pages/` - Route components (Dashboard, Catalog, OrderDetail, Index, NotFound)
- **Shared Components**: `src/components/` - Business components (Header, PerfumeCard, StatsCard, OrderRow, AlertItem, NavLink)
- **UI Primitives**: `src/components/ui/` - shadcn components (Button, Card, Badge, etc.)
- **Integrations**: `src/integrations/supabase/` - Supabase client and database types
- **Routing**: React Router v6 with catch-all 404 route (`<Route path="*">`)

### Import Aliases (Critical)
All imports use the `@/` alias configured in [vite.config.ts](vite.config.ts#L15), [tsconfig.json](tsconfig.json#L4), and [components.json](components.json#L10):
```tsx
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
```

### State & Data Management
- **React Query**: Global data fetching via `@tanstack/react-query` with optimized config
  - `staleTime: 5 minutes` - Data considered fresh
  - `gcTime: 10 minutes` - Cache retention
  - `refetchOnWindowFocus: false` - No refetch on tab switch
  - `refetchOnMount: false` - Use cache if available
- **Supabase**: Backend-as-a-Service for database, auth, and storage
  - Client configured in [src/integrations/supabase/client.ts](src/integrations/supabase/client.ts)
  - Optimized with PKCE flow and explicit storage
  - No built-in cache - always fresh data from DB
- **AuthContext**: Global authentication state
  - User, profile (with role), session
  - Functions: signIn, signUp, signOut, resetPassword, updatePassword, refreshProfile
  - **NO cache** - Always fetches fresh profile to avoid stale roles
- **CartContext**: Shopping cart state management
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
- `/dashboard` - Admin dashboard (protected, admin only)
- `/admin` - Admin panel (protected, admin only)
- `/account` - User profile (protected)
- `/pedido/:id` - Order detail (dynamic route)
- `/perfume/:id` - Product detail (dynamic route)
- `/carrito` - Shopping cart
- `/login` - Login page
- `/register` - Registration page
- `/forgot-password` - Password recovery request
- `/reset-password` - Password reset (with token)
- `/debug-auth` - Auth debugging tool (development only)

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

## WAuthentication & User Management
**Tables:**
- `auth.users` - Supabase managed, stores email/password
- `profiles` - Custom table with `id` (FK to auth.users), `role`, `full_name`, `avatar_url`, `created_at`

**Roles:**
- `cliente` - Default role for new users
- `admin` - Full access to dashboard and admin panel

**Creating Admin Users:**
```sql
-- After user registers, promote to admin
UPDATE profiles 
SET role = 'admin'
WHERE id = (SELECT id FROM auth.users WHERE email = 'admin@example.com');
```

**Row Level Security (RLS) Policies:**
```sql
-- ✅ Allow authenticated users to read all profiles
CREATE POLICY "authenticated_can_view_all_profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

-- Users can update their own profile only
CREATE POLICY "users_can_update_own_profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Users can insert their own profile (for signup)
CREATE POLICY "users_can_insert_own_profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);
```

**⚠️ AVOID**: Policies that query the same table (causes infinite recursion)

**Trigger for Auto-Creating Profiles:**
```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    'cliente'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
```

### Common Issues

**Authentication Problems:**
- **Role not updating**: Clear localStorage → Logout → Login again
- **"infinite recursion detected in policy"**: Fix RLS policies (avoid querying same table in USING clause)
- **Profile is NULL but user exists**: Check if profile was created in `profiles` table
- **isAdmin: FALSE but Supabase shows admin**: Use `/debug-auth` to force refresh profile
- **Can't access admin routes**: Verify `profile.role === 'admin'` in `/debug-auth`

**Supabase Connection:**
- Error "Invalid URL" → Verify `.env.local` exists with correct `VITE_SUPABASE_URL`
- "Failed to fetch" → Restart server after creating `.env.local`
- "relation 'table_name' does not exist" → Execute schema SQL in Supabase SQL Editor
- "permission denied for table" → Check RLS policies are configured

**Performance Issues:**
- Slow login/profile load → Check Supabase region (closer is better)
- Data not updating → React Query is caching (5min staleTime by default)
- Multiple fetches → Check if `refetchOnMount` or `refetchOnWindowFocus` enabled

**General:**
- **Import Errors**: Verify `@/` alias works; check [vite.config.ts](vite.config.ts#L15)
- **Styling Issues**: Ensure `src/index.css` is imported in [src/main.tsx](src/main.tsx#L3)
- **Build Errors**: Check TypeScript relaxed settings aren't hiding issues
- **HMR Overlay**: Disabled intentionally in [vite.config.ts](vite.config.ts#L10)

### Debug Tools
- **`/debug-auth`** - Inspect user, profile, role, and isAdmin state
- **Browser Console** - Look for `[AUTH]` logs during auth operations
- **React Query DevTools** - Monitor query cache and network requests
- **Supabase Dashboard** - Verify data directly in database tables

### Useful SQL Queries
```sql
-- Check user's profile and role
SELECT u.email, p.role, p.full_name, p.created_at
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
WHERE u.email = 'user@example.com';

-- List all admins
SELECT u.email, p.full_name, p.created_at
FROM auth.users u
JOIN profiles p ON u.id = p.id
WHERE p.role = 'admin';

-- View RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'profiles';
```tall to `src/components/ui/`
4. **Animations**: Follow the `initial/whileInView` pattern from existing components
5. **Colors**: Use AURA design tokens, don't add arbitrary colors
6. **Typography**: Maintain serif for headings, sans for body text
7. **Database Operations**: Use Supabase client from `@/integrations/supabase` with React Query for caching

## Supabase Integration

### Database Queries
Always use React Query with Supabase for automatic caching and refetching:

```tsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase';

// Fetching data
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

// Mutations
export function useCreateOrder() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (orderData) => {
      const { data, error } = await supabase
        .from('orders')
        .insert([orderData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}
```

### Type Safety
- Database types are defined in `src/integrations/supabase/types.ts`
- Regenerate types after schema changes: `npx supabase gen types typescript --project-id "project-ref" > src/integrations/supabase/types.ts`
- Import types: `import type { Database } from '@/integrations/supabase/types';`

### Environment Variables
Required in `.env.local`:
```env
VITE_SUPABASE_URL=https://project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
```

Client validates these on initialization and will throw if missing.

## Troubleshooting

- **Import Errors**: Verify `@/` alias works; check [vite.config.ts](vite.config.ts#L15)
- **Styling Issues**: Ensure `src/index.css` is imported in [src/main.tsx](src/main.tsx#L3)
- **Build Errors**: Check TypeScript relaxed settings aren't hiding issues
- **Supabase Errors**: Verify `.env.local` exists with correct credentials; check SUPABASE_SETUP.md
- **HMR Overlay**: Disabled intentionally in [vite.config.ts](vite.config.ts#L10)
