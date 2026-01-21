import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface OrderItem {
  perfume_id: string;
  perfume_name: string;
  perfume_brand: string;
  quantity: number;
  unit_price: number;
  in_stock: boolean;
}

export interface CreateOrderData {
  customer_name?: string;
  customer_phone?: string;
  customer_email?: string;
  total_amount: number;
  items: OrderItem[];
  status?: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
}

/**
 * Hook para obtener todos los pedidos
 */
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
            id,
            perfume_id,
            perfume_name,
            perfume_brand,
            quantity,
            unit_price,
            in_stock
          )
        `)
        .order('created_at', { ascending: false });

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }

      const { data, error } = await query;
      
      if (error) throw error;

      // Filtrar pedidos con productos "a pedido" si se solicita
      if (filters?.hasBackorder) {
        return data?.filter(order => 
          order.order_items?.some((item: OrderItem) => !item.in_stock)
        ) || [];
      }

      return data || [];
    },
    staleTime: 30 * 1000, // Cache por 30 segundos
  });
}

/**
 * Hook para crear un nuevo pedido con sus items
 */
export function useSaveOrder() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (orderData: CreateOrderData) => {
      // 1. Crear el pedido
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([{
          customer_name: orderData.customer_name,
          customer_phone: orderData.customer_phone,
          customer_email: orderData.customer_email,
          total_amount: orderData.total_amount,
          status: orderData.status || 'pending',
        }])
        .select()
        .single();
      
      if (orderError) throw orderError;

      // 2. Crear los items del pedido
      const itemsWithOrderId = orderData.items.map(item => ({
        order_id: order.id,
        perfume_id: item.perfume_id,
        perfume_name: item.perfume_name,
        perfume_brand: item.perfume_brand,
        quantity: item.quantity,
        unit_price: item.unit_price,
        in_stock: item.in_stock,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(itemsWithOrderId);
      
      if (itemsError) throw itemsError;

      return order;
    },
    onSuccess: () => {
      // Invalidar cache para refrescar la lista
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}

/**
 * Hook para actualizar el estado de un pedido
 */
export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      orderId, 
      status 
    }: { 
      orderId: number; 
      status: string;
    }) => {
      const { data, error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId)
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
