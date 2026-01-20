/**
 * Componente de ejemplo mostrando integración completa con Supabase
 * 
 * Este componente demuestra:
 * - Fetch de datos con React Query + Supabase
 * - Manejo de estados (loading, error, success)
 * - Mutaciones (crear, actualizar, eliminar)
 * - Real-time subscriptions
 * - Integración con shadcn/ui
 */

import { useState } from 'react';
import { usePerfumes, useCreatePerfume, useUpdatePerfume, useDeletePerfume } from '@/integrations/supabase/hooks.example';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Plus, Trash2, Edit } from 'lucide-react';

export default function SupabaseExample() {
  const { toast } = useToast();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    price: '',
    type: 'Árabe' as 'Árabe' | 'Diseñador' | 'Nicho',
  });

  // Hooks de Supabase
  const { data: perfumes, isLoading, error } = usePerfumes();
  const createPerfume = useCreatePerfume();
  const updatePerfume = useUpdatePerfume();
  const deletePerfume = useDeletePerfume();

  // Manejar creación
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await createPerfume.mutateAsync({
        name: formData.name,
        brand: formData.brand,
        price: parseFloat(formData.price),
        type: formData.type,
        in_stock: true,
        is_featured: false,
      });

      toast({
        title: '✅ Perfume creado',
        description: `${formData.name} se agregó correctamente`,
      });

      // Limpiar formulario
      setFormData({ name: '', brand: '', price: '', type: 'Árabe' });
    } catch (error: any) {
      toast({
        title: '❌ Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  // Manejar actualización
  const handleUpdate = async (id: string) => {
    try {
      await updatePerfume.mutateAsync({
        id,
        updates: {
          name: formData.name,
          price: parseFloat(formData.price),
        },
      });

      toast({
        title: '✅ Perfume actualizado',
        description: 'Los cambios se guardaron correctamente',
      });

      setEditingId(null);
    } catch (error: any) {
      toast({
        title: '❌ Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  // Manejar eliminación
  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`¿Eliminar "${name}"?`)) return;

    try {
      await deletePerfume.mutateAsync(id);

      toast({
        title: '🗑️ Perfume eliminado',
        description: `${name} se eliminó correctamente`,
      });
    } catch (error: any) {
      toast({
        title: '❌ Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  // Estados de carga
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-aura-gold" />
      </div>
    );
  }

  // Estados de error
  if (error) {
    return (
      <Card className="max-w-2xl mx-auto mt-8 border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Error de Conexión</CardTitle>
          <CardDescription>
            No se pudo conectar con Supabase. Verifica:
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-2 text-sm">
            <li>El archivo <code className="bg-muted px-1 rounded">.env.local</code> existe</li>
            <li>Las variables VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY están configuradas</li>
            <li>El servidor de desarrollo se reinició después de crear .env.local</li>
            <li>La tabla "perfumes" existe en Supabase</li>
          </ul>
          <p className="mt-4 text-sm text-muted-foreground">
            Error: {error.message}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="container mx-auto p-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-4xl font-serif font-bold text-aura-gold mb-2">
          Ejemplo Supabase + React Query
        </h1>
        <p className="text-muted-foreground">
          CRUD completo con Aura SaaS Design
        </p>
      </div>

      {/* Formulario de creación */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Crear Nuevo Perfume
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreate} className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Oud Royal"
                required
              />
            </div>
            <div>
              <Label htmlFor="brand">Marca</Label>
              <Input
                id="brand"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                placeholder="Aura Collection"
                required
              />
            </div>
            <div>
              <Label htmlFor="price">Precio (USD)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="299.99"
                required
              />
            </div>
            <div>
              <Label htmlFor="type">Tipo</Label>
              <select
                id="type"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
              >
                <option value="Árabe">Árabe</option>
                <option value="Diseñador">Diseñador</option>
                <option value="Nicho">Nicho</option>
              </select>
            </div>
            <div className="col-span-2">
              <Button
                type="submit"
                variant="gold"
                className="w-full"
                disabled={createPerfume.isPending}
              >
                {createPerfume.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Crear Perfume
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Lista de perfumes */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {perfumes?.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="py-8 text-center text-muted-foreground">
              No hay perfumes todavía. ¡Crea el primero!
            </CardContent>
          </Card>
        ) : (
          perfumes?.map((perfume) => (
            <Card key={perfume.id} className="hover:shadow-gold transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="font-serif text-xl">
                      {perfume.name}
                    </CardTitle>
                    <CardDescription>{perfume.brand}</CardDescription>
                  </div>
                  <Badge variant={
                    perfume.type === 'Árabe' ? 'gold' :
                    perfume.type === 'Diseñador' ? 'secondary' :
                    'outline'
                  }>
                    {perfume.type}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-aura-gold">
                      ${perfume.price}
                    </p>
                    <Badge variant={perfume.in_stock ? 'stock' : 'pending'} className="mt-2">
                      {perfume.in_stock ? 'En stock' : 'Agotado'}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setEditingId(perfume.id)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDelete(perfume.id, perfume.name)}
                      disabled={deletePerfume.isPending}
                    >
                      {deletePerfume.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Estadísticas */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Estadísticas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-3xl font-bold text-aura-gold">
                {perfumes?.length || 0}
              </p>
              <p className="text-sm text-muted-foreground">Total perfumes</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-green-500">
                {perfumes?.filter(p => p.in_stock).length || 0}
              </p>
              <p className="text-sm text-muted-foreground">En stock</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-aura-gold">
                {perfumes?.filter(p => p.is_featured).length || 0}
              </p>
              <p className="text-sm text-muted-foreground">Destacados</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
