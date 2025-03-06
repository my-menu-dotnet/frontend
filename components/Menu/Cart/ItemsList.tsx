"use client";

import Block from "@/components/Block";
import SimpleFoodItem from "@/components/SimpleFoodItem";
import { useCart } from "@/hooks/useCart";
import { currency } from "@/utils/text";
import { Divider } from "@nextui-org/react";
import { AnimatePresence, motion } from "framer-motion";
import { BsCart3 } from "react-icons/bs";
import { useCartStep } from "./hooks/useCarStep";
import FooterButtons from "./components/FooterButtons";
import { calcTotalDiscount, calcTotalPrice, calcTotalWithoutDiscount } from "@/utils/calcTotalPrice";
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
      <div className="flex items-center gap-2 mb-2 text-gray-400">
        <BsCart3 size={24} className="fill-gray-400" />
        <h1 className="text-lg">Seu carrinho</h1>
      </div>
      <div className={`min-h-36 ${items.length === 0 ? "max-h-36" : ""} mt-6`}>
        <AnimatePresence initial={false}>
          {items.length > 0 ? (
            items.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <SimpleFoodItem
                  title={item.title}
                  price={item.price}
                  description={item.description}
                  discount={item.discount}
                  image={item.image}
                  onClickAdd={() => handleAddItem(item.id)}
                  onClickRemove={() => handleRemoveItem(item.id)}
                  total={item.quantity}
                  hasIncrease={false}
                />
                <div className="ml-8">
                  <AnimatePresence>
                    {item.items.map((subItem) => (
                      <motion.div
                        key={subItem.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <SimpleFoodItem
                          title={subItem.title}
                          price={subItem.price}
                          description={subItem.description}
                          image={subItem.image}
                          onClickAdd={() => handleAddItem(subItem.id)}
                          onClickRemove={() => handleRemoveItem(subItem.id)}
                          total={subItem.quantity}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="flex h-36 relative">
              <motion.span
                key="empty-cart"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="text-center text-gray-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
              >
                Seu carrinho está vazio.
              </motion.span>
            </div>
          )}
        </AnimatePresence>
      </div>

      <Divider className="my-4" />

      <OrderOverview items={items} />

      <FooterButtons onClickNext={handleNext} hasBack={false} />
    </Block>
  );
}
