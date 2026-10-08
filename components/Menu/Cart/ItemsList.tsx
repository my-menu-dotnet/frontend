"use client";

import Block from "@/components/Block";
import SimpleFoodItem from "@/components/SimpleFoodItem";
import { useCart } from "@/hooks/useCart";
import { Separator } from "@/components/ui/separator";
import { BsCart3 } from "react-icons/bs";
import { useCartStep } from "./hooks/useCarStep";
import FooterButtons from "./components/FooterButtons";
import { toast } from "react-toastify";
import OrderOverview from "@/components/OrderOverview";

export default function ItemsList() {
  const { items, addItemUnity, removeItemUnity } = useCart();
  const { addStep } = useCartStep();

  const handleAddItem = (id: string) => {
    addItemUnity(id);
  };

  const handleRemoveItem = (id: string) => {
    removeItemUnity(id);
  };

  const handleNext = () => {
    if (items.length === 0) {
      toast.error("Seu carrinho está vazio.");
      return;
    }
    addStep();
  };

  return (
    <Block>
      <div className="flex items-center gap-2 mb-2 text-muted-foreground">
        <BsCart3 size={24} className="fill-muted-foreground" />
        <h1 className="text-lg">Seu carrinho</h1>
      </div>
      <div className={`min-h-36 ${items.length === 0 ? "max-h-36" : ""} mt-6`}>
        {items.length > 0 ? (
          items.map((item, index) => (
            <div key={index}>
              <SimpleFoodItem
                title={item.title}
                price={item.price}
                description={item.observation || ""}
                discount={item.discount}
                image={item.image}
                onClickAdd={() => handleAddItem(item.id)}
                onClickRemove={() => handleRemoveItem(item.id)}
                total={item.quantity}
                hasIncrease={false}
              />
              <div className="ml-8">
                {item.items.map((subItem) => (
                  <div key={subItem.id}>
                    <SimpleFoodItem
                      title={subItem.title}
                      price={subItem.price}
                      description=""
                      image={subItem.image}
                      onClickAdd={() => handleAddItem(subItem.id)}
                      onClickRemove={() => handleRemoveItem(subItem.id)}
                      total={subItem.quantity}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="flex h-36 relative">
            <span className="text-center text-muted-foreground absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              Seu carrinho está vazio.
            </span>
          </div>
        )}
      </div>

      <Separator className="my-4" />

      <OrderOverview items={items} />

      <FooterButtons onClickNext={handleNext} hasBack={false} />
    </Block>
  );
}
