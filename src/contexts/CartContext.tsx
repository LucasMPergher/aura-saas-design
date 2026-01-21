import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Perfume } from '@/lib/perfumes-data';
import { toast } from 'sonner';

export interface CartItem extends Perfume {
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (perfume: Perfume, quantity?: number) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getSubtotal: () => number;
  getTotal: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Cargar del localStorage al iniciar
  useEffect(() => {
    const savedCart = localStorage.getItem('aura-cart');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart:', error);
      }
    }
    setIsLoaded(true);
  }, []);

  // Guardar en localStorage cuando cambie
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('aura-cart', JSON.stringify(items));
    }
  }, [items, isLoaded]);

  const addToCart = (perfume: Perfume, quantity: number = 1) => {
    setItems(currentItems => {
      const existingItem = currentItems.find(item => item.id === perfume.id);

      if (existingItem) {
        toast.success('Cantidad actualizada', {
          description: `${perfume.name} (${existingItem.quantity + quantity})`
        });
        return currentItems.map(item =>
          item.id === perfume.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      toast.success('Agregado al carrito', {
        description: perfume.name
      });
      return [...currentItems, { ...perfume, quantity }];
    });
  };

  const removeFromCart = (id: string) => {
    const item = items.find(i => i.id === id);
    if (item) {
      toast.info('Eliminado del carrito', {
        description: item.name
      });
    }
    setItems(currentItems => currentItems.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }

    setItems(currentItems =>
      currentItems.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    toast.info('Carrito vaciado');
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const getSubtotal = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getTotal = () => {
    // Por ahora el total es igual al subtotal
    // En el futuro se puede agregar envío, descuentos, etc.
    return getSubtotal();
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalItems,
        getSubtotal,
        getTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
