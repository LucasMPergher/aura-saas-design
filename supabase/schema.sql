-- ========================================
-- SCHEMA COMPLETO PARA AURA SAAS DESIGN
-- ========================================
-- Ejecuta este script en el SQL Editor de Supabase
-- Dashboard → SQL Editor → New query → Pega y ejecuta

-- ========================================
-- 1. TABLA DE PERFUMES
-- ========================================
CREATE TABLE IF NOT EXISTS perfumes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  type TEXT CHECK (type IN ('Árabe', 'Diseñador', 'Nicho')),
  price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
  description TEXT,
  image_url TEXT,
  notes TEXT[], -- Array de notas olfativas
  concentration TEXT, -- EDT, EDP, Parfum, etc.
  size_ml INTEGER DEFAULT 100,
  is_featured BOOLEAN DEFAULT false,
  in_stock BOOLEAN DEFAULT true,
  stock_quantity INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Índices para mejorar performance
CREATE INDEX IF NOT EXISTS idx_perfumes_type ON perfumes(type);
CREATE INDEX IF NOT EXISTS idx_perfumes_featured ON perfumes(is_featured);
CREATE INDEX IF NOT EXISTS idx_perfumes_stock ON perfumes(in_stock);

-- ========================================
-- 2. TABLA DE CLIENTES
-- ========================================
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  city TEXT,
  postal_code TEXT,
  country TEXT DEFAULT 'España',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);

-- ========================================
-- 3. TABLA DE PEDIDOS
-- ========================================
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL,
  customer_id UUID REFERENCES customers(id),
  customer_email TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  total DECIMAL(10, 2) NOT NULL CHECK (total >= 0),
  subtotal DECIMAL(10, 2) NOT NULL CHECK (subtotal >= 0),
  tax DECIMAL(10, 2) DEFAULT 0,
  shipping_cost DECIMAL(10, 2) DEFAULT 0,
  status TEXT CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')) DEFAULT 'pending',
  payment_method TEXT,
  payment_status TEXT CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')) DEFAULT 'pending',
  shipping_address TEXT,
  shipping_city TEXT,
  shipping_postal_code TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_orders_customer ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_number ON orders(order_number);

-- ========================================
-- 4. TABLA DE ITEMS DE PEDIDO
-- ========================================
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  perfume_id UUID REFERENCES perfumes(id) ON DELETE SET NULL,
  perfume_name TEXT NOT NULL, -- Almacenar por si se elimina el perfume
  perfume_brand TEXT,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price DECIMAL(10, 2) NOT NULL CHECK (unit_price >= 0),
  total_price DECIMAL(10, 2) NOT NULL CHECK (total_price >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_perfume ON order_items(perfume_id);

-- ========================================
-- 5. TABLA DE CATEGORÍAS (OPCIONAL)
-- ========================================
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabla de relación many-to-many
CREATE TABLE IF NOT EXISTS perfume_categories (
  perfume_id UUID REFERENCES perfumes(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  PRIMARY KEY (perfume_id, category_id)
);

-- ========================================
-- 6. TABLA DE REVIEWS (OPCIONAL)
-- ========================================
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  perfume_id UUID REFERENCES perfumes(id) ON DELETE CASCADE NOT NULL,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  rating INTEGER CHECK (rating BETWEEN 1 AND 5) NOT NULL,
  title TEXT,
  comment TEXT,
  verified_purchase BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_reviews_perfume ON reviews(perfume_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);

-- ========================================
-- FUNCIONES Y TRIGGERS
-- ========================================

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para updated_at
DROP TRIGGER IF EXISTS update_perfumes_updated_at ON perfumes;
CREATE TRIGGER update_perfumes_updated_at
  BEFORE UPDATE ON perfumes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_customers_updated_at ON customers;
CREATE TRIGGER update_customers_updated_at
  BEFORE UPDATE ON customers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Función para generar número de pedido único
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
BEGIN
  RETURN 'ORD-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql;

-- Trigger para generar order_number automáticamente
CREATE OR REPLACE FUNCTION set_order_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.order_number IS NULL THEN
    NEW.order_number := generate_order_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_set_order_number ON orders;
CREATE TRIGGER trigger_set_order_number
  BEFORE INSERT ON orders
  FOR EACH ROW
  EXECUTE FUNCTION set_order_number();

-- ========================================
-- ROW LEVEL SECURITY (RLS)
-- ========================================

-- Habilitar RLS en todas las tablas
ALTER TABLE perfumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE perfume_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Políticas para PERFUMES (lectura pública)
DROP POLICY IF EXISTS "Permitir lectura pública de perfumes" ON perfumes;
CREATE POLICY "Permitir lectura pública de perfumes"
  ON perfumes
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Políticas para CUSTOMERS (privado)
DROP POLICY IF EXISTS "Usuarios pueden ver su propio perfil" ON customers;
CREATE POLICY "Usuarios pueden ver su propio perfil"
  ON customers
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = id::text);

DROP POLICY IF EXISTS "Usuarios pueden actualizar su perfil" ON customers;
CREATE POLICY "Usuarios pueden actualizar su perfil"
  ON customers
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = id::text);

-- Políticas para ORDERS (usuarios ven sus propios pedidos)
DROP POLICY IF EXISTS "Usuarios pueden ver sus pedidos" ON orders;
CREATE POLICY "Usuarios pueden ver sus pedidos"
  ON orders
  FOR SELECT
  TO authenticated
  USING (customer_id = auth.uid());

DROP POLICY IF EXISTS "Permitir creación de pedidos" ON orders;
CREATE POLICY "Permitir creación de pedidos"
  ON orders
  FOR INSERT
  TO authenticated, anon
  WITH CHECK (true);

-- Políticas para ORDER_ITEMS
DROP POLICY IF EXISTS "Usuarios pueden ver items de sus pedidos" ON order_items;
CREATE POLICY "Usuarios pueden ver items de sus pedidos"
  ON order_items
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.customer_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Permitir inserción de order items" ON order_items;
CREATE POLICY "Permitir inserción de order items"
  ON order_items
  FOR INSERT
  TO authenticated, anon
  WITH CHECK (true);

-- Políticas para CATEGORIES (lectura pública)
DROP POLICY IF EXISTS "Permitir lectura pública de categorías" ON categories;
CREATE POLICY "Permitir lectura pública de categorías"
  ON categories
  FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Lectura pública perfume_categories" ON perfume_categories;
CREATE POLICY "Lectura pública perfume_categories"
  ON perfume_categories
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Políticas para REVIEWS (lectura pública, escritura autenticada)
DROP POLICY IF EXISTS "Permitir lectura pública de reviews" ON reviews;
CREATE POLICY "Permitir lectura pública de reviews"
  ON reviews
  FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Usuarios autenticados pueden crear reviews" ON reviews;
CREATE POLICY "Usuarios autenticados pueden crear reviews"
  ON reviews
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Usuarios pueden editar sus reviews" ON reviews;
CREATE POLICY "Usuarios pueden editar sus reviews"
  ON reviews
  FOR UPDATE
  TO authenticated
  USING (customer_id = auth.uid());

-- ========================================
-- DATOS DE PRUEBA (OPCIONAL)
-- ========================================

-- Insertar perfumes de ejemplo
INSERT INTO perfumes (name, brand, type, price, description, is_featured, in_stock, stock_quantity)
VALUES
  ('Oud Royal', 'Aura Collection', 'Árabe', 299.99, 'Fragancia oriental intensa con oud puro', true, true, 50),
  ('Musk Imperial', 'Aura Collection', 'Árabe', 249.99, 'Almizcle refinado con notas amaderadas', true, true, 35),
  ('La Vie Est Belle', 'Lancôme', 'Diseñador', 129.99, 'Eau de parfum floral gourmand', false, true, 100),
  ('Sauvage', 'Dior', 'Diseñador', 119.99, 'Fragancia fresca y amaderada', true, true, 80),
  ('Aventus', 'Creed', 'Nicho', 399.99, 'Icónico perfume frutal ahumado', true, false, 0),
  ('Ambre Nuit', 'Dior', 'Nicho', 279.99, 'Ámbar profundo y misterioso', false, true, 20)
ON CONFLICT DO NOTHING;

-- Insertar categorías
INSERT INTO categories (name, slug, description)
VALUES
  ('Oriental', 'oriental', 'Fragancias exóticas y especiadas'),
  ('Amaderado', 'amaderado', 'Notas de madera y tierra'),
  ('Floral', 'floral', 'Fragancias florales delicadas'),
  ('Fresco', 'fresco', 'Aromas cítricos y acuáticos')
ON CONFLICT DO NOTHING;

-- ========================================
-- VIEWS ÚTILES (OPCIONAL)
-- ========================================

-- Vista de estadísticas de perfumes
CREATE OR REPLACE VIEW perfumes_stats AS
SELECT
  COUNT(*) as total_perfumes,
  COUNT(*) FILTER (WHERE in_stock = true) as in_stock_count,
  COUNT(*) FILTER (WHERE is_featured = true) as featured_count,
  AVG(price) as average_price,
  MIN(price) as min_price,
  MAX(price) as max_price
FROM perfumes;

-- Vista de pedidos con totales
CREATE OR REPLACE VIEW orders_summary AS
SELECT
  o.id,
  o.order_number,
  o.customer_name,
  o.customer_email,
  o.status,
  o.total,
  o.created_at,
  COUNT(oi.id) as items_count,
  SUM(oi.quantity) as total_items
FROM orders o
LEFT JOIN order_items oi ON o.id = oi.order_id
GROUP BY o.id;

-- ========================================
-- FINALIZADO
-- ========================================

-- Verificar que todo se creó correctamente
SELECT 'Tablas creadas:' as status;
SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename;

SELECT 'Perfumes insertados:' as status;
SELECT COUNT(*) FROM perfumes;

SELECT '✅ Schema completo instalado correctamente' as resultado;
