/**
 * Ejemplo de Custom Hook para usar Supabase con React Query
 * 
 * Este archivo muestra patrones comunes para integrar Supabase
 * con React Query en el proyecto Aura SaaS Design.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase';
import type { Database } from '@/integrations/supabase/types';

// Tipos de ejemplo (actualiza según tu schema de Supabase)
type Perfume = Database['public']['Tables']['perfumes']['Row'];
type NewPerfume = Database['public']['Tables']['perfumes']['Insert'];
type Order = Database['public']['Tables']['orders']['Row'];

/**
 * Hook para obtener todos los perfumes
 * Incluye filtrado opcional por tipo y orden
 */
export function usePerfumes(options?: {
  type?: string;
  featured?: boolean;
}) {
  return useQuery({
    queryKey: ['perfumes', options],
    queryFn: async () => {
      let query = supabase
        .from('perfumes')
        .select('*')
        .order('created_at', { ascending: false });

      // Aplicar filtros si existen
      if (options?.type) {
        query = query.eq('type', options.type);
      }
      if (options?.featured !== undefined) {
        query = query.eq('is_featured', options.featured);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return data as Perfume[];
    },
    staleTime: 5 * 60 * 1000, // Cache por 5 minutos
  });
}

/**
 * Hook para obtener un perfume específico por ID
 */
export function usePerfume(id: string) {
  return useQuery({
    queryKey: ['perfume', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('perfumes')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data as Perfume;
    },
    enabled: !!id, // Solo ejecutar si hay ID
  });
}

/**
 * Hook para crear un nuevo perfume
 * Invalida el cache de perfumes automáticamente
 */
export function useCreatePerfume() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (newPerfume: NewPerfume) => {
      const { data, error } = await supabase
        .from('perfumes')
        .insert([newPerfume])
        .select()
        .single();
      
      if (error) throw error;
      return data as Perfume;
    },
    onSuccess: () => {
      // Invalidar cache para refrescar la lista
      queryClient.invalidateQueries({ queryKey: ['perfumes'] });
    },
  });
}

/**
 * Hook para actualizar un perfume existente
 */
export function useUpdatePerfume() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      id, 
      updates 
    }: { 
      id: string; 
      updates: Partial<NewPerfume> 
    }) => {
      const { data, error } = await supabase
        .from('perfumes')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data as Perfume;
    },
    onSuccess: (data) => {
      // Actualizar cache específico del perfume
      queryClient.setQueryData(['perfume', data.id], data);
      // Invalidar lista de perfumes
      queryClient.invalidateQueries({ queryKey: ['perfumes'] });
    },
  });
}

/**
 * Hook para eliminar un perfume
 */
export function useDeletePerfume() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('perfumes')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['perfumes'] });
    },
  });
}

/**
 * Hook para obtener pedidos
 * Puede filtrar por estado
 */
export function useOrders(status?: string) {
  return useQuery({
    queryKey: ['orders', status],
    queryFn: async () => {
      let query = supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            perfumes (
              name,
              brand,
              image_url
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (status) {
        query = query.eq('status', status);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return data;
    },
  });
}

/**
 * Hook para crear un pedido con sus items
 */
export function useCreateOrder() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (orderData: {
      order: any;
      items: any[];
    }) => {
      // Crear el pedido
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([orderData.order])
        .select()
        .single();
      
      if (orderError) throw orderError;

      // Crear los items del pedido
      const itemsWithOrderId = orderData.items.map(item => ({
        ...item,
        order_id: order.id,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(itemsWithOrderId);
      
      if (itemsError) throw itemsError;

      return order;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}

/**
 * Hook para suscribirse a cambios en tiempo real de una tabla
 * Ejemplo de uso:
 * 
 * useRealtimeSubscription('perfumes', () => {
 *   refetch(); // Refrescar datos cuando hay cambios
 * });
 */
export function useRealtimeSubscription(
  table: string,
  callback: () => void
) {
  const queryClient = useQueryClient();

  React.useEffect(() => {
    const channel = supabase
      .channel(`${table}-changes`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: table,
        },
        () => {
          callback();
          // También invalidar cache automáticamente
          queryClient.invalidateQueries({ queryKey: [table] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [table, callback, queryClient]);
}

/**
 * Ejemplo de uso en un componente:
 * 
 * function PerfumesList() {
 *   const { data: perfumes, isLoading, error } = usePerfumes({ featured: true });
 *   const createPerfume = useCreatePerfume();
 *   const updatePerfume = useUpdatePerfume();
 *   const deletePerfume = useDeletePerfume();
 * 
 *   const handleCreate = async () => {
 *     await createPerfume.mutateAsync({
 *       name: 'Oud Royal',
 *       brand: 'Aura',
 *       price: 299.99,
 *       type: 'Árabe',
 *       in_stock: true,
 *     });
 *   };
 * 
 *   if (isLoading) return <div>Cargando...</div>;
 *   if (error) return <div>Error: {error.message}</div>;
 * 
 *   return (
 *     <div>
 *       {perfumes?.map(perfume => (
 *         <div key={perfume.id}>{perfume.name}</div>
 *       ))}
 *     </div>
 *   );
 * }
 */
