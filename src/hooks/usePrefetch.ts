/**
 * Prefetch Hook - Precarga datos comunes
 * Usar en páginas que probablemente necesitarán estos datos
 */

import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase';

export function usePrefetchPerfumes() {
  const queryClient = useQueryClient();

  useEffect(() => {
    // Prefetch perfumes destacados
    queryClient.prefetchQuery({
      queryKey: ['perfumes', 'featured'],
      queryFn: async () => {
        const { data } = await supabase
          .from('perfumes')
          .select('*')
          .eq('is_featured', true)
          .limit(6);
        return data;
      },
      staleTime: 10 * 60 * 1000, // 10 minutos
    });
  }, [queryClient]);
}

export function usePrefetchUserData() {
  const queryClient = useQueryClient();

  useEffect(() => {
    // Prefetch pedidos del usuario
    queryClient.prefetchQuery({
      queryKey: ['orders', 'user'],
      queryFn: async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return [];

        const { data } = await supabase
          .from('orders')
          .select('*, order_items(*)')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5);
        return data;
      },
      staleTime: 5 * 60 * 1000,
    });
  }, [queryClient]);
}
