# ✅ Checklist de Configuración de Supabase

Sigue estos pasos en orden para configurar Supabase en tu proyecto Aura SaaS Design.

---

## 📦 1. Instalación (Completado ✅)

- [x] Dependencia `@supabase/supabase-js` instalada
- [x] Archivos de configuración creados en `src/integrations/supabase/`
- [x] Documentación lista

---

## 🌐 2. Crear Proyecto en Supabase

### Pasos a seguir:

1. [ ] Ve a [supabase.com](https://supabase.com)
2. [ ] Crea una cuenta (si no tienes)
3. [ ] Click en **"New Project"**
4. [ ] Completa:
   - **Organization**: Selecciona o crea una
   - **Name**: `aura-saas-design` (o el nombre que prefieras)
   - **Database Password**: **Guarda esta contraseña** en un lugar seguro
   - **Region**: Selecciona la más cercana (ej: `Europe - West`)
   - **Pricing Plan**: Free (suficiente para empezar)
5. [ ] Click en **"Create new project"**
6. [ ] Espera 1-2 minutos a que el proyecto se inicialice

---

## 🔑 3. Obtener Credenciales

Una vez listo el proyecto:

1. [ ] En el dashboard, ve a **Project Settings** (ícono ⚙️ en sidebar)
2. [ ] Click en **"API"** en el menú lateral
3. [ ] Copia estos dos valores:

   **Project URL:**
   ```
   https://tunombredeproyecto.supabase.co
   ```
   
   **anon public (public key):**
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ey...
   ```

⚠️ **IMPORTANTE**: Usa la key `anon`, NO la `service_role` key

---

## ⚙️ 4. Configurar Variables de Entorno

1. [ ] En tu proyecto, crea el archivo `.env.local`:

```bash
# En la raíz del proyecto
touch .env.local
```

O copia el ejemplo:

```bash
cp .env.local.example .env.local
```

2. [ ] Abre `.env.local` y pega tus credenciales:

```env
VITE_SUPABASE_URL=https://tunombredeproyecto.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ey...
```

3. [ ] Guarda el archivo

---

## 🗄️ 5. Crear Base de Datos

### Opción A: Usar el schema completo (Recomendado)

1. [ ] En Supabase Dashboard, ve a **SQL Editor**
2. [ ] Click en **"New query"**
3. [ ] Abre el archivo `supabase/schema.sql` de este proyecto
4. [ ] Copia TODO el contenido
5. [ ] Pega en el SQL Editor de Supabase
6. [ ] Click en **"Run"** (o Ctrl/Cmd + Enter)
7. [ ] Verifica que no haya errores (debería decir "Success")

Esto creará:
- ✅ Tabla `perfumes` con datos de ejemplo
- ✅ Tabla `orders` con número automático
- ✅ Tabla `order_items` con relaciones
- ✅ Tabla `customers` para clientes
- ✅ Tabla `categories` y `reviews` (opcional)
- ✅ Row Level Security (RLS) configurado
- ✅ Triggers automáticos
- ✅ 6 perfumes de prueba

### Opción B: Crear solo lo esencial (Rápido)

Si prefieres empezar simple:

```sql
CREATE TABLE perfumes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  type TEXT CHECK (type IN ('Árabe', 'Diseñador', 'Nicho')),
  price DECIMAL(10, 2) NOT NULL,
  is_featured BOOLEAN DEFAULT false,
  in_stock BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE perfumes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lectura pública"
  ON perfumes FOR SELECT
  TO anon, authenticated
  USING (true);

-- Insertar un perfume de prueba
INSERT INTO perfumes (name, brand, type, price, is_featured, in_stock)
VALUES ('Oud Royal', 'Aura Collection', 'Árabe', 299.99, true, true);
```

---

## 🔄 6. Reiniciar Servidor

```bash
# Detén el servidor (Ctrl + C si está corriendo)
# Luego ejecuta:
npm run dev
```

⚠️ **Crucial**: El servidor DEBE reiniciarse después de crear `.env.local`

---

## ✅ 7. Probar Conexión

### Método 1: Consola del navegador

1. [ ] Abre tu app en el navegador (`http://localhost:8080`)
2. [ ] Abre las DevTools (F12)
3. [ ] Ve a la pestaña **Console**
4. [ ] Ejecuta este código:

```javascript
import { supabase } from '@/integrations/supabase';
const { data, error } = await supabase.from('perfumes').select('*');
console.log('Datos:', data);
console.log('Error:', error);
```

Si ves los datos de perfumes, ¡funciona! ✅

### Método 2: Componente de prueba

1. [ ] Ve a `src/App.tsx`
2. [ ] Importa el componente de ejemplo:

```tsx
import SupabaseExample from '@/pages/SupabaseExample';
```

3. [ ] Agrega una ruta:

```tsx
<Route path="/supabase-test" element={<SupabaseExample />} />
```

4. [ ] Ve a `http://localhost:8080/supabase-test`
5. [ ] Deberías ver una interfaz completa con CRUD

---

## 📊 8. Verificar en Supabase Dashboard

1. [ ] Ve a **Table Editor** en Supabase
2. [ ] Selecciona la tabla `perfumes`
3. [ ] Deberías ver los datos insertados
4. [ ] Prueba agregar un perfume desde el componente de ejemplo
5. [ ] Verifica que aparezca en el dashboard

---

## 🎯 9. Siguientes Pasos

Una vez que todo funcione:

- [ ] Lee la guía completa: [SUPABASE_SETUP.md](SUPABASE_SETUP.md)
- [ ] Revisa los hooks de ejemplo: [src/integrations/supabase/hooks.example.ts](src/integrations/supabase/hooks.example.ts)
- [ ] Configura Storage para imágenes (sección en SUPABASE_SETUP.md)
- [ ] Implementa autenticación si lo necesitas
- [ ] Genera tipos TypeScript automáticamente:

```bash
npx supabase gen types typescript --project-id "tu-project-ref" > src/integrations/supabase/types.ts
```

---

## 🆘 Troubleshooting

### ❌ Error: "Invalid URL"
**Solución:** Verifica que `.env.local` exista y tenga la URL correcta

### ❌ Error: "Failed to fetch"
**Solución:** Reinicia el servidor después de crear `.env.local`

### ❌ Error: "relation 'perfumes' does not exist"
**Solución:** Ejecuta el schema SQL en Supabase SQL Editor

### ❌ Error: "permission denied for table perfumes"
**Solución:** Verifica que RLS esté habilitado y las políticas creadas

### ❌ Los datos no se actualizan
**Solución:** React Query cachea datos. Espera 5 minutos o recarga la página

---

## 📞 Ayuda Adicional

- 📖 [Supabase Docs](https://supabase.com/docs)
- 💬 [Discord de Supabase](https://discord.supabase.com)
- 📧 [Soporte Supabase](https://supabase.com/support)
- 🐛 Reporta issues en el proyecto

---

## ✅ Checklist Final

Una vez completados todos los pasos:

- [ ] ✅ Proyecto Supabase creado
- [ ] ✅ Credenciales copiadas
- [ ] ✅ `.env.local` configurado
- [ ] ✅ Servidor reiniciado
- [ ] ✅ Schema SQL ejecutado
- [ ] ✅ Conexión probada exitosamente
- [ ] ✅ Datos visibles en dashboard
- [ ] ✅ CRUD funcionando desde el frontend

---

**🎉 ¡Felicitaciones! Tu proyecto está conectado a Supabase.**

Ahora puedes empezar a construir tu e-commerce de perfumes con una base de datos real y profesional.
