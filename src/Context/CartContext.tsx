import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from 'react';
import { type Toy } from '../Interfaces/Toy';

type CartItem = {
  item: Toy;
  quantity: number;
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (item: Toy, quantity: number) => void;
  removeFromCart: (item: Toy) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }

  return context;
}

type CartProviderProps = {
  children: ReactNode;
};

export function CartProvider({ children }: CartProviderProps) {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (item: Toy, quantity: number) => {
    const newItem: CartItem = { item, quantity };
    const foundIndex = cart.findIndex((it) => it.item.id === item.id);

    if (foundIndex === -1) {
      setCart([...cart, newItem]);
    } else {
      const updatedCart = cart.slice();
      updatedCart[foundIndex] = { ...updatedCart[foundIndex], quantity };
      setCart(updatedCart);
    }
  };

  const removeFromCart = (item: Toy) => {
    const updatedCart = cart.filter((cartItem) => cartItem.item.id !== item.id);
    setCart(updatedCart);
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}
