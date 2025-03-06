"use client";

import { Discounts } from "@/types/api/Discounts";
import { useParams } from "next/navigation";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

interface CartContextType {
  items: FoodOrder[];
  setItems: React.Dispatch<React.SetStateAction<FoodOrder[]>>;
  addItem: (item: FoodOrder) => void;
  removeItemUnity: (itemId: string) => void;
  addItemUnity: (itemId: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export type FoodOrder = {
  id: string;
  itemId: string;
  quantity: number;
  image: string;
  title: string;
  description: string;
  price: number;
  observation?: string;
  discount?: Partial<Discounts>;
  items: Omit<FoodOrder, "items">[];
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<FoodOrder[]>([]);
  const params = useParams();
  const menuId = params.id;

  const addItem = (item: FoodOrder) => {
    setItems([...items, item]);
  };

  const removeItemUnity = (itemId: string) => {
    const newItems = items.map((item) => {
      if (item.id === itemId) {
        return {
          ...item,
          quantity: item.quantity - 1,
        };
      }
      const subItems = item.items.map((subItem) => {
        if (subItem.id === itemId) {
          return {
            ...subItem,
            quantity: subItem.quantity - 1,
          };
        }
        return subItem;
      });
      return {
        ...item,
        items: subItems.filter((subItem) => subItem.quantity > 0),
      };
    });

    setItems(newItems.filter((item) => item.quantity > 0));
  };

  const addItemUnity = (itemId: string) => {
    const newItems = items.map((item) => {
      if (item.id === itemId) {
        return {
          ...item,
          quantity: item.quantity + 1,
        };
      }
      const subItems = item.items.map((subItem) => {
        if (subItem.id === itemId) {
          return {
            ...subItem,
            quantity: subItem.quantity + 1,
          };
        }
        return subItem;
      });

      return {
        ...item,
        items: subItems,
      };
    });

    setItems(newItems);
  };

  useEffect(() => {
    console.log(items);
    localStorage.setItem(`cart`, JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    const cart = localStorage.getItem(`cart`);
    if (cart) {
      setItems(JSON.parse(cart));
    }
  }, []);

  return (
    <CartContext.Provider
      value={{ items, setItems, addItem, removeItemUnity, addItemUnity }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
