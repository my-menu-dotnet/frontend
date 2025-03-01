import React, { createContext, useContext, useState, ReactNode } from 'react';

interface CartContextType {
  items: string[];
  addItem: (item: string) => void;
  removeItem: (item: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

type OrderItemForm = {
  title: string;
  description: string;
  image: string;
  category_id: string;
  quantity: number;
  unit_price: number;
}

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<string[]>([]);

  const addItem = (item: string) => {
    setItems([...items, item]);
  };

  const removeItem = (item: string) => {
    setItems(items.filter(i => i !== item));
  };

  return (
    <CartContext.Provider value={{ items, addItem, removeItem }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};